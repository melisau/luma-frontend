// Sending a guest's personal link over WhatsApp, and showing whether they opened it.
// The message is a template the owner can change; it is kept per event on this device only.
window.LumaInviteSender = {
  DEFAULT_TEMPLATE: 'Merhaba {ad}, {etkinlik} davetiyeniz hazır 💌\n{bağlantı}\nBu bağlantı size özeldir; lütfen başkasıyla paylaşmayın.',
  STATUS_LABELS: { not_sent: 'Gönderilmedi', sent: 'Gönderildi', opened: 'Açtı', responded: 'Yanıtladı' },

  storageKey(eventId) { return `lumaInviteTemplate:${eventId || 'default'}`; },
  template(eventId, storage = window.localStorage) {
    try { return storage.getItem(this.storageKey(eventId)) || this.DEFAULT_TEMPLATE; } catch { return this.DEFAULT_TEMPLATE; }
  },
  saveTemplate(eventId, text, storage = window.localStorage) {
    try {
      if (!text.trim() || text === this.DEFAULT_TEMPLATE) storage.removeItem(this.storageKey(eventId));
      else storage.setItem(this.storageKey(eventId), text);
    } catch {}
  },

  // The link must be in the message; if the owner removed {bağlantı}, it is added at the end.
  message(template, { name, eventName, url }) {
    const text = String(template || this.DEFAULT_TEMPLATE);
    const filled = text.replaceAll('{ad}', name || '').replaceAll('{etkinlik}', eventName || 'etkinliğimizin').replaceAll('{bağlantı}', url);
    return text.includes('{bağlantı}') ? filled : `${filled}\n${url}`;
  },

  // wa.me wants the number in international form, digits only. Same rules as the server.
  phoneDigits(phone) {
    const raw = String(phone || '').trim();
    let digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (!raw.startsWith('+')) {
      if (digits.startsWith('00')) digits = digits.slice(2);
      else if (digits.startsWith('0') && digits.length === 11) digits = '90' + digits.slice(1);
      else if (digits.length === 10 && digits.startsWith('5')) digits = '90' + digits;
    }
    return digits.length >= 8 && digits.length <= 15 ? digits : '';
  },

  // Without a phone, WhatsApp opens and the owner picks the contact there.
  waUrl(phone, text) {
    const digits = this.phoneDigits(phone);
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  },

  status(guest) {
    if (guest.status === 'attending' || guest.status === 'declined') return 'responded';
    if (guest.opened_at || guest.device_count) return 'opened';
    if (guest.invite_sent_at) return 'sent';
    return 'not_sent';
  },
  // Sent (or added) but not opened and not answered: who to remind.
  needsReminder(guest) { return ['not_sent', 'sent'].includes(this.status(guest)); },

  badge(guest, escape = value => value) {
    const key = this.status(guest);
    return `<span class="invite-status invite-${key}">${escape(this.STATUS_LABELS[key])}</span>`;
  },

  async markSent(eventToken, guestId) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(eventToken)}/guests/${encodeURIComponent(guestId)}/invite-link/sent`,
      { method: 'POST', headers: LumaConfig.adminAuthHeaders() });
    if (!response.ok) throw new Error('Gönderim kaydedilemedi.');
    return response.json();
  },

  // The tab is opened right away (inside the click) so pop-up blockers allow it; its address is
  // set once the personal link is ready.
  async send(guest, { eventToken, eventId, eventName, template, refresh, open = window.open } = {}) {
    const tab = open('', '_blank');
    try {
      const link = await LumaGuestAccess.adminLink(eventToken, guest.id);
      const text = this.message(template ?? this.template(eventId), { name: guest.name, eventName, url: link.url });
      const url = this.waUrl(guest.phone, text);
      if (tab) { try { tab.opener = null; } catch {} tab.location.href = url; } else window.location.href = url;
      await this.markSent(eventToken, guest.id).catch(() => {});
      if (refresh) await refresh();
      return url;
    } catch (error) {
      try { tab?.close(); } catch {}
      throw error;
    }
  }
};
