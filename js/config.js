function resolveApiBase() {
  if (typeof window.__LUMA_API_BASE__ === 'string') return window.__LUMA_API_BASE__;
  // Frontend on port 5500 — point at the API on the same machine
  if (location.port === '5500') {
    return `${location.protocol}//${location.hostname}:8000`;
  }
  return '';
}

window.LumaConfig = {
  apiBase: resolveApiBase(),
  defaultCover: '/assets/images/wedding-hero.png',

  /** @type {() => string} */
  getEventToken: () => '',

  adminAuthHeaders() {
    const token = sessionStorage.getItem('lumaAdminJwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  eventApiUrl(token) {
    return `${this.apiBase}/api/events/${encodeURIComponent(token)}`;
  },

  photosUrl(token) {
    return `${this.eventApiUrl(token)}/photos`;
  },

  adminPhotosUrl(token) {
    return `${this.apiBase}/api/admin/events/${encodeURIComponent(token)}/photos`;
  },

  photoThumbnailUrl(photoId, token) {
    const q = token ? `?access=${encodeURIComponent(token)}` : '';
    return `${this.apiBase}/api/photos/${encodeURIComponent(photoId)}/thumbnail${q}`;
  },

  photoOriginalUrl(photoId, token) {
    const q = token ? `?access=${encodeURIComponent(token)}` : '';
    return `${this.apiBase}/api/photos/${encodeURIComponent(photoId)}${q}`;
  },

  publicEventToken() {
    const uploadMatch = location.pathname.match(/^\/e\/([^/]+)\/upload\/?$/);
    if (uploadMatch) return decodeURIComponent(uploadMatch[1]);
    const match = location.pathname.match(/^\/e\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  },

  shouldOpenUploadModal() {
    return /\/upload\/?$/.test(location.pathname)
      || new URLSearchParams(location.search).get('upload') === '1';
  },

  inviteUrl(token) {
    return `${location.origin}/e/${encodeURIComponent(token)}`;
  },

  uploadUrl(token) {
    const resolved = token || this.getEventToken();
    return `${location.origin}/e/${encodeURIComponent(resolved)}/upload`;
  },

  slugFromName(name) {
    return name
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'etkinlik';
  }
};

window.Luma = {
  escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  },

  trDate(date, options) {
    return new Intl.DateTimeFormat('tr-TR', options).format(date);
  },

  toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
};
