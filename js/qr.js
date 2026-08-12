window.LumaQr = {
  _bound: false,

  qrApiUrl(token, size = 'screen', download = false) {
    const params = new URLSearchParams({ size });
    if (download) params.set('download', '1');
    return `${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/upload-qr?${params}`;
  },

  downloadFilename(slug, size = 'screen') {
    const safeSlug = (slug || 'etkinlik').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'etkinlik';
    return size === 'print'
      ? `luma-${safeSlug}-fotograf-yukleme-qr-baski.png`
      : `luma-${safeSlug}-fotograf-yukleme-qr.png`;
  },

  adminEventCount() {
    return Array.isArray(window._lumaEvents) ? window._lumaEvents.length : 0;
  },

  tokenUnavailableMessage() {
    if (!sessionStorage.getItem('lumaAdminJwt')) {
      return 'QR kod için yönetici olarak giriş yapın.';
    }
    if (!this.adminEventCount()) {
      return 'QR kod için önce bir etkinlik oluşturun.';
    }
    return 'Etkinlik bağlantısı alınamadı. Sayfayı yenileyip tekrar deneyin.';
  },

  async getTokenOrWarn() {
    const token = window.ensureEventToken ? await window.ensureEventToken() : LumaConfig.getEventToken();
    if (!token) {
      Luma.toast(this.tokenUnavailableMessage());
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

  async downloadQr(token, size = 'screen', slug = '') {
    try {
      const response = await fetch(this.qrApiUrl(token, size, true));
      if (!response.ok) throw new Error('QR indirilemedi');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = this.downloadFilename(slug, size);
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
      const meta = window.currentEventMeta ? window.currentEventMeta() : null;
      await this.downloadQr(token, 'screen', meta?.slug || meta?.id || '');
    });

    document.getElementById('downloadUploadQrPrintBtn')?.addEventListener('click', async event => {
      event.preventDefault();
      const token = await this.getTokenOrWarn();
      if (!token) return;
      const meta = window.currentEventMeta ? window.currentEventMeta() : null;
      const ok = await this.downloadQr(token, 'print', meta?.slug || meta?.id || '');
      if (ok) Luma.toast('Baskı için yüksek çözünürlüklü QR kod indirildi.');
    });

    document.getElementById('createEventFromQrBtn')?.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById('newEventBtn')?.click();
    });
  },

  updateEmptyState() {
    const empty = document.getElementById('uploadQrEmpty');
    const preview = document.getElementById('uploadQrPreview');
    const actions = document.querySelector('#qrView .qr-actions');
    const urlLabel = document.querySelector('#qrView .qr-url-label');
    const emptyTitle = document.getElementById('uploadQrEmptyTitle');
    const emptyText = document.getElementById('uploadQrEmptyText');
    const createBtn = document.getElementById('createEventFromQrBtn');
    const loggedIn = Boolean(sessionStorage.getItem('lumaAdminJwt'));
    const eventCount = this.adminEventCount();

    empty?.classList.remove('hidden');
    preview?.classList.add('hidden');
    actions?.classList.add('hidden');
    urlLabel?.classList.add('hidden');

    if (!loggedIn) {
      if (emptyTitle) emptyTitle.textContent = 'Yönetici girişi gerekli';
      if (emptyText) emptyText.textContent = 'QR kod oluşturmak için hesabınızla giriş yapın.';
      createBtn?.classList.add('hidden');
      return;
    }

    if (!eventCount) {
      if (emptyTitle) emptyTitle.textContent = 'Henüz etkinlik yok';
      if (emptyText) emptyText.textContent = 'Her etkinliğin kendi QR kodu vardır. Başlamak için bir etkinlik oluşturun.';
      createBtn?.classList.remove('hidden');
      return;
    }

    if (emptyTitle) emptyTitle.textContent = 'Etkinlik seçilemedi';
    if (emptyText) emptyText.textContent = 'Üst menüden bir etkinlik seçin veya sayfayı yenileyin.';
    createBtn?.classList.add('hidden');
  },

  async render() {
    const token = window.ensureEventToken ? await window.ensureEventToken() : LumaConfig.getEventToken();
    const meta = window.currentEventMeta ? window.currentEventMeta() : null;
    const empty = document.getElementById('uploadQrEmpty');
    const preview = document.getElementById('uploadQrPreview');
    const image = document.getElementById('uploadQrImage');
    const urlEl = document.getElementById('uploadQrUrl');
    const eventNameEl = document.getElementById('uploadQrEventName');
    const actions = document.querySelector('#qrView .qr-actions');
    const urlLabel = document.querySelector('#qrView .qr-url-label');

    if (!token) {
      this.updateEmptyState();
      if (urlEl) urlEl.textContent = '';
      if (eventNameEl) eventNameEl.textContent = '';
      return;
    }

    const uploadUrl = LumaConfig.uploadUrl(token);
    empty?.classList.add('hidden');
    preview?.classList.remove('hidden');
    actions?.classList.remove('hidden');
    urlLabel?.classList.remove('hidden');
    document.getElementById('createEventFromQrBtn')?.classList.add('hidden');
    if (eventNameEl) {
      eventNameEl.textContent = meta?.name ? `${meta.name} · Bu etkinliğe özel QR` : 'Bu etkinliğe özel QR';
    }
    if (urlEl) urlEl.textContent = uploadUrl;
    if (image) {
      image.src = `${this.qrApiUrl(token, 'screen')}&t=${Date.now()}`;
      image.alt = meta?.name ? `${meta.name} fotoğraf yükleme QR kodu` : 'Fotoğraf yükleme QR kodu';
    }
  }
};

LumaQr.bindActions();
