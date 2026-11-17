window.LumaUpload = {
  submitting: false,
  maxFiles: 30,
  allowedPattern: /\.(jpe?g|png|webp|heic|heif)$/i,

  isAllowedImage(file) {
    const type = (file.type || '').toLowerCase();
    if (type.startsWith('image/')) {
      return ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(type);
    }
    return this.allowedPattern.test(file.name || '');
  },

  fileKey(file) {
    return `${file.name}:${file.size}:${file.lastModified}`;
  },

  mergeFiles(existing, incoming) {
    const map = new Map(existing.map(file => [this.fileKey(file), file]));
    const rejected = [];
    incoming.forEach(file => {
      if (this.isAllowedImage(file)) map.set(this.fileKey(file), file);
      else rejected.push(file.name || 'dosya');
    });
    if (rejected.length) {
      Luma.toast(`${rejected.length} dosya desteklenmiyor (JPG, PNG, WebP, HEIC).`);
    }
    return [...map.values()];
  },

  syncInputFiles(input, files) {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    input.files = dt.files;
  },

  async uploadPhotos(token, files, uploaderName, caption = '', onProgress) {
    const formData = new FormData();
    formData.append('uploader_name', uploaderName);
    if (caption) formData.append('caption', caption);
    [...files].forEach(file => formData.append('files', file));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', LumaConfig.photosUrl(token));
      xhr.withCredentials = true;
      xhr.upload.onprogress = event => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
          return;
        }
        let message = 'Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        try {
          const detail = JSON.parse(xhr.responseText).detail;
          if (typeof detail === 'string') message = detail;
        } catch {}
        const error = new Error(message);
        error.status = xhr.status;
        error.retryAfter = Number(xhr.getResponseHeader('Retry-After')) || 0;
        reject(error);
      };
      xhr.onerror = () => reject(new Error('Bağlantı hatası. Lütfen tekrar deneyin.'));
      xhr.send(formData);
    });
  },

  // A busy venue (everyone on one Wi-Fi) can hit the server's per-minute limit; wait as the
  // server asks and try again instead of failing the guest's upload.
  async uploadWithRetry(send, onWait, wait = ms => new Promise(resolve => setTimeout(resolve, ms)), attempts = 6) {
    for (let attempt = 1; ; attempt++) {
      try {
        return await send();
      } catch (error) {
        // 429: per-minute limit; 503: the server is busy processing other guests' photos.
        if (![429, 503].includes(error.status) || attempt >= attempts) throw error;
        const seconds = Math.min(30, Math.max(3, error.retryAfter || 5));
        if (onWait) onWait(seconds);
        await wait(seconds * 1000);
      }
    }
  },

  // Phones take 12-48 MP photos of 3-10 MB. Sending a 2560 px JPEG instead cuts the venue Wi-Fi
  // and server load about 4x with no visible loss in the album. Re-encoding also drops EXIF (and
  // with it the GPS location). Anything the browser cannot decode (HEIC on Chrome) goes as is.
  maxSide: 2560,
  jpegQuality: 0.85,
  async shrinkImage(file, env = globalThis) {
    try {
      if (typeof env.createImageBitmap !== 'function') return file;
      const bitmap = await env.createImageBitmap(file, { imageOrientation: 'from-image' });
      const longest = Math.max(bitmap.width, bitmap.height);
      if (longest <= this.maxSide && file.size <= 1.5 * 1024 * 1024) { bitmap.close?.(); return file; }
      const scale = Math.min(1, this.maxSide / longest);
      const width = Math.round(bitmap.width * scale), height = Math.round(bitmap.height * scale);
      const canvas = typeof env.OffscreenCanvas === 'function'
        ? new env.OffscreenCanvas(width, height)
        : Object.assign(env.document.createElement('canvas'), { width, height });
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close?.();
      const blob = canvas.convertToBlob
        ? await canvas.convertToBlob({ type: 'image/jpeg', quality: this.jpegQuality })
        : await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', this.jpegQuality));
      if (!blob || blob.size >= file.size) return file;
      const name = (file.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg';
      return new env.File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
    } catch {
      return file;
    }
  },

  // One photo per request, a few at a time: a stuck photo is retried alone, progress moves photo
  // by photo, and the server spreads the work across guests. Failures do not stop the others.
  async uploadMany(token, files, uploaderName, caption, { onProgress, onWait, concurrency = 2, send } = {}) {
    send = send || ((file, progress) => this.uploadPhotos(token, [file], uploaderName, caption, progress));
    const total = files.length, partial = new Array(total).fill(0);
    const result = { uploaded: [], duplicates_skipped: 0, failed: [], failedFiles: [] };
    let next = 0, firstError = null;
    const report = () => onProgress && onProgress(Math.round(partial.reduce((a, b) => a + b, 0) / total), result.uploaded.length + result.duplicates_skipped + result.failed.length, total);
    const worker = async () => {
      while (next < total) {
        const index = next++;
        const original = files[index];
        try {
          const file = await this.shrinkImage(original);
          const response = await this.uploadWithRetry(
            () => send(file, percent => { partial[index] = percent; report(); }),
            seconds => onWait && onWait(seconds)
          );
          result.uploaded.push(...(response.uploaded || []));
          result.duplicates_skipped += response.duplicates_skipped || 0;
        } catch (error) {
          firstError = firstError || error;
          result.failed.push(original.name || 'foto');
          result.failedFiles.push(original);
        }
        partial[index] = 100;
        report();
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));
    if (!result.uploaded.length && !result.duplicates_skipped && firstError) throw firstError;
    return result;
  },

  bindUploadForm(form, onComplete) {
    const fileInput = form.querySelector('input[type="file"]');
    fileInput.accept = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif';
    fileInput.multiple = true;
    fileInput.removeAttribute('capture');

    const uploadDropzone = form.querySelector('.dropzone');
    uploadDropzone.insertAdjacentHTML(
      'afterend',
      `<div id="selectedFiles" class="selected-files hidden"></div>
       <div id="uploadProgress" class="upload-progress hidden" aria-hidden="true"><span id="uploadProgressBar"></span></div>
       <div id="uploadStatus" class="upload-status hidden" aria-live="polite"></div>
       <div id="uploadSuccess" class="upload-status hidden" aria-live="polite">✓ Fotoğrafların başarıyla gönderildi.</div>`
    );

    let selectedFiles = [];

    const updateDropzoneLabel = () => {
      uploadDropzone.querySelector('p').textContent = selectedFiles.length
        ? `${selectedFiles.length} fotoğraf seçildi · daha ekle`
        : 'Fotoğraf ekle';
      uploadDropzone.classList.toggle('has-files', selectedFiles.length > 0);
    };

    const showSelectedFiles = () => {
      const preview = form.querySelector('#selectedFiles');
      preview.innerHTML = selectedFiles.map((file, index) => {
        const url = URL.createObjectURL(file);
        return `<div class="selected-file"><button type="button" class="selected-file-remove" data-remove-index="${index}" aria-label="Kaldır">×</button><img src="${url}" alt=""><span title="${Luma.escapeHtml(file.name)}">${Luma.escapeHtml(file.name)}</span></div>`;
      }).join('');
      preview.classList.toggle('hidden', !selectedFiles.length);
      updateDropzoneLabel();

      preview.querySelectorAll('[data-remove-index]').forEach(button => {
        button.onclick = event => {
          event.preventDefault();
          event.stopPropagation();
          const index = Number(button.dataset.removeIndex);
          selectedFiles = selectedFiles.filter((_, i) => i !== index);
          this.syncInputFiles(fileInput, selectedFiles);
          showSelectedFiles();
        };
      });
    };

    const addFiles = incoming => {
      const merged = this.mergeFiles(selectedFiles, incoming);
      if (merged.length > this.maxFiles) {
        Luma.toast(`En fazla ${this.maxFiles} fotoğraf ekleyebilirsiniz.`);
        selectedFiles = merged.slice(0, this.maxFiles);
      } else {
        selectedFiles = merged;
      }
      this.syncInputFiles(fileInput, selectedFiles);
      showSelectedFiles();
    };

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) addFiles([...fileInput.files]);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, event => {
        event.preventDefault();
        uploadDropzone.classList.add('has-files');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, event => {
        event.preventDefault();
        if (eventName === 'drop' && event.dataTransfer?.files?.length) {
          addFiles([...event.dataTransfer.files]);
        }
        uploadDropzone.classList.remove('dragging');
      });
    });
    uploadDropzone.addEventListener('dragenter', () => uploadDropzone.classList.add('dragging'));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (this.submitting) return;

      const files = [...selectedFiles];
      const uploaderName = form.querySelector('[name="uploaderName"]').value.trim();
      const caption = form.querySelector('textarea')?.value.trim() || '';
      const submit = form.querySelector('.submit-btn');
      const statusBox = form.querySelector('#uploadStatus');
      const successBox = form.querySelector('#uploadSuccess');
      const progressWrap = form.querySelector('#uploadProgress');
      const progressBar = form.querySelector('#uploadProgressBar');
      const token = LumaConfig.getEventToken();
      const guestUploadEntry = document.body.classList.contains('guest-upload-entry');

      if (!files.length) {
        Luma.toast('Lütfen en az bir fotoğraf seçin.');
        return;
      }

      this.submitting = true;
      submit.disabled = true;
      submit.textContent = files.length > 1 ? `${files.length} fotoğraf gönderiliyor...` : 'Gönderiliyor...';
      successBox.classList.add('hidden');
      statusBox.textContent = files.length > 1 ? `${files.length} fotoğraf yükleniyor...` : 'Yükleniyor...';
      statusBox.classList.remove('hidden');
      progressWrap.classList.remove('hidden');
      progressBar.style.width = '0%';

      try {
        const result = await this.uploadMany(token, files, uploaderName, caption, {
          onProgress: (percent, done, total) => {
            progressBar.style.width = `${percent}%`;
            statusBox.textContent = total > 1 ? `Yükleniyor... ${done}/${total} fotoğraf` : `Yükleniyor... ${percent}%`;
          },
          onWait: seconds => {
            statusBox.textContent = `Şu an çok sayıda fotoğraf yükleniyor; ${seconds} saniye sonra kendiliğinden yeniden denenecek...`;
          }
        });
        const resultMessage=`${result.uploaded.length} fotoğraf gönderildi.${result.duplicates_skipped ? ` ${result.duplicates_skipped} yinelenen fotoğraf atlandı.` : ''}${result.failed.length ? ` ${result.failed.length} fotoğraf gönderilemedi; seçili bıraktık, Gönder'e yeniden basabilirsin.` : ''}`;
        progressBar.style.width = '100%';
        statusBox.classList.add('hidden');
        successBox.textContent = `✓ ${resultMessage} Onaylandıktan sonra albümde görünecek.${guestUploadEntry ? ' Dilersen daha fazla ekleyebilirsin.' : ''}`;
        successBox.classList.remove('hidden');
        await onComplete(result, uploaderName);

        // Keep only the photos that did not go, so the guest can simply press Gönder again.
        selectedFiles = result.failedFiles;
        this.syncInputFiles(fileInput, selectedFiles);
        showSelectedFiles();

        if (guestUploadEntry) {
          await new Promise(resolve => setTimeout(resolve, 1200));
          successBox.classList.add('hidden');
          Luma.toast(`${resultMessage} Daha fazla ekleyebilirsin.`);
        } else {
          await new Promise(resolve => setTimeout(resolve, 900));
          document.getElementById('modal').classList.add('hidden');
          Luma.toast(`${resultMessage} Yönetici onayından sonra paylaşılacak.`);
          form.reset();
        }
      } catch (error) {
        Luma.toast(error.message);
      } finally {
        this.submitting = false;
        submit.disabled = false;
        submit.textContent = 'Gönder';
        progressWrap.classList.add('hidden');
        statusBox.classList.add('hidden');
      }
    });
  }
};
