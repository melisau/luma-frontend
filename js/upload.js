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
        reject(new Error(message));
      };
      xhr.onerror = () => reject(new Error('Bağlantı hatası. Lütfen tekrar deneyin.'));
      xhr.send(formData);
    });
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
        const result = await this.uploadPhotos(token, files, uploaderName, caption, percent => {
          progressBar.style.width = `${percent}%`;
          statusBox.textContent = `Yükleniyor... ${percent}%`;
        });
        progressBar.style.width = '100%';
        statusBox.classList.add('hidden');
        successBox.textContent = `✓ ${result.uploaded.length} fotoğraf gönderildi. Onaylandıktan sonra albümde görünecek.${guestUploadEntry ? ' Dilersen daha fazla ekleyebilirsin.' : ''}`;
        successBox.classList.remove('hidden');
        await onComplete(result, uploaderName);

        selectedFiles = [];
        this.syncInputFiles(fileInput, selectedFiles);
        form.querySelector('#selectedFiles').classList.add('hidden');
        updateDropzoneLabel();

        if (guestUploadEntry) {
          await new Promise(resolve => setTimeout(resolve, 1200));
          successBox.classList.add('hidden');
          Luma.toast(`${result.uploaded.length} fotoğraf gönderildi. Daha fazla ekleyebilirsin.`);
        } else {
          await new Promise(resolve => setTimeout(resolve, 900));
          document.getElementById('modal').classList.add('hidden');
          Luma.toast(`${result.uploaded.length} fotoğraf gönderildi. Yönetici onayından sonra paylaşılacak.`);
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
