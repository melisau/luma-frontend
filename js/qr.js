window.LumaQr = {
  _bound: false,

  qrApiUrl(token, size = 'screen', download = false) {
    const params = new URLSearchParams({ size });
    if (download) params.set('download', '1');
    return `${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/upload-qr?${params}`;
  },

  async getTokenOrWarn() {
    const token = window.ensureEventToken ? await window.ensureEventToken() : LumaConfig.getEventToken();
    if (!token) {
      Luma.toast('Etkinlik bağlantısı alınamadı. Çıkış yapıp admin@example.com ile tekrar giriş yapın.');
      return '';
    }
    return token;
  },

  async copyUploadUrl(url) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        Luma.toast('Fotoğraf yükleme bağlantısı kopyalandı.');
        return;
      }
    } catch {
      /* fallback below */
    }

    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      Luma.toast('Fotoğraf yükleme bağlantısı kopyalandı.');
    } catch {
      window.prompt('Fotoğraf yükleme bağlantısını kopyalayın:', url);
    } finally {
      textarea.remove();
    }
  },

  async downloadQr(token, size = 'screen') {
    try {
      const response = await fetch(this.qrApiUrl(token, size, true));
      if (!response.ok) throw new Error('QR indirilemedi');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = size === 'print'
        ? 'luma-fotograf-yukleme-qr-baski.png'
        : 'luma-fotograf-yukleme-qr.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      return true;
    } catch {
      Luma.toast('QR kod indirilemedi. Sayfayı yenileyip tekrar deneyin.');
      return false;
    }
  },

  bindActions() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById('copyUploadQrUrlBtn')?.addEventListener('click', async event => {
      event.preventDefault();
      const token = await this.getTokenOrWarn();
      if (!token) return;
      await this.copyUploadUrl(LumaConfig.uploadUrl(token));
    });

    document.getElementById('downloadUploadQrBtn')?.addEventListener('click', async event => {
      event.preventDefault();
      const token = await this.getTokenOrWarn();
      if (!token) return;
      await this.downloadQr(token, 'screen');
    });

    document.getElementById('downloadUploadQrPrintBtn')?.addEventListener('click', async event => {
      event.preventDefault();
      const token = await this.getTokenOrWarn();
      if (!token) return;
      const ok = await this.downloadQr(token, 'print');
      if (ok) Luma.toast('Baskı için yüksek çözünürlüklü QR kod indirildi.');
    });
  },

  async render() {
    const token = window.ensureEventToken ? await window.ensureEventToken() : LumaConfig.getEventToken();
    const empty = document.getElementById('uploadQrEmpty');
    const preview = document.getElementById('uploadQrPreview');
    const image = document.getElementById('uploadQrImage');
    const urlEl = document.getElementById('uploadQrUrl');

    if (!token) {
      empty?.classList.remove('hidden');
      preview?.classList.add('hidden');
      if (urlEl) urlEl.textContent = '';
      return;
    }

    const uploadUrl = LumaConfig.uploadUrl(token);
    empty?.classList.add('hidden');
    preview?.classList.remove('hidden');
    if (urlEl) urlEl.textContent = uploadUrl;
    if (image) {
      image.src = `${this.qrApiUrl(token, 'screen')}&t=${Date.now()}`;
      image.alt = 'Fotoğraf yükleme QR kodu';
    }
  }
};

LumaQr.bindActions();
