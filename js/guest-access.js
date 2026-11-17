// Personal invitation links (see luma-backend app/services/guest_access.py).
// A guest's link ends in #g=<guest id>.<token>; the venue QR ends in #k=<upload key>. Both are
// exchanged once for an httpOnly cookie on this device and then removed from the address bar, so a
// screenshot or a copied address bar does not carry them on.
window.LumaGuestAccess = {
  guest: null,
  link: null,
  uploadOnly: false,

  parse(hash) {
    const params = new URLSearchParams(String(hash || '').replace(/^#/, ''));
    const value = params.get('g') || '';
    const dot = value.indexOf('.');
    return {
      link: dot > 0 ? { guestId: value.slice(0, dot), token: value.slice(dot + 1) } : null,
      uploadKey: params.get('k') || ''
    };
  },

  async post(eventToken, path, body) {
    let response;
    try {
      response = await fetch(`${LumaConfig.apiBase}/api/events/${encodeURIComponent(eventToken)}/${path}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
    } catch {
      return { error: 'Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.' };
    }
    const data = await response.json().catch(() => ({}));
    if (response.ok) return { ok: true, ...data };
    if (data.code_required) return { codeRequired: true, emailHint: data.email_hint || '', message: data.detail || '' };
    return { error: typeof data.detail === 'string' ? data.detail : 'Davetiye açılamadı.' };
  },

  async open(eventToken, link, code) {
    const result = await this.post(eventToken, 'guest-session', { guest_id: link.guestId, token: link.token, ...(code ? { code } : {}) });
    if (result.ok && result.guest) this.guest = result.guest;
    return result;
  },

  forgetHash(location, history) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch {}
  },

  // Runs before the invitation loads. Returns {ok} to go on, {codeRequired, ...} or {error}.
  async prepare(eventToken, location = (typeof appLocation === 'function' ? appLocation() : window.location), history = window.history) {
    const { link, uploadKey } = this.parse(location.hash);
    if (!link && !uploadKey) return { ok: true };
    if (uploadKey && !link) {
      const result = await this.post(eventToken, 'upload-session', { key: uploadKey });
      if (result.ok) { this.uploadOnly = result.mode === 'upload'; this.forgetHash(location, history); }
      return result.ok ? { ok: true } : result;
    }
    this.link = link;
    const result = await this.open(eventToken, link);
    if (result.ok) this.forgetHash(location, history);
    return result;
  },

  // The owner's panel: the guest's link and how many devices opened it.
  async adminLink(eventToken, guestId, reset = false) {
    const url = `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(eventToken)}/guests/${encodeURIComponent(guestId)}/invite-link${reset ? '/reset' : ''}`;
    const response = await fetch(url, { method: reset ? 'POST' : 'GET', headers: LumaConfig.adminAuthHeaders() });
    if (!response.ok) throw new Error(reset ? 'Yeni bağlantı oluşturulamadı.' : 'Kişisel bağlantı alınamadı.');
    const data = await response.json();
    return { ...data, url: `${LumaConfig.inviteUrl(eventToken)}#${data.fragment}` };
  }
};
