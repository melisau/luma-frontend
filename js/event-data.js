function apiErrorMessage(body, fallback) {
  if (!body || body.detail == null) return fallback;
  if (typeof body.detail === 'string') return body.detail;
  if (Array.isArray(body.detail)) {
    return body.detail.map(item => item.msg || item.message || JSON.stringify(item)).join(', ');
  }
  return fallback;
}

window.LumaEventData = {
  cache: {
    guests: [],
    messages: [],
    invitation: null,
    activities: [],
    event: null,
  },

  emptyInvitation() {
    return {
      name: 'Melisa & Berk',
      slug: 'melisa-berk',
      event_date: null,
      venue: 'The Marmara Esma Sultan',
      city: 'İstanbul',
      tagline: 'Birlikte, sonsuza...',
      story_title: 'Hayat, seninle daha güzel.',
      story_text:
        'Bir kahveyle başlayan hikâyemiz, şimdi en güzel “evet”e hazırlanıyor. Bu özel günümüzde sevincimizi sizinle paylaşmak için sabırsızlanıyoruz.',
      guest_note: 'Şıklığınızı yansıtan kokteyl veya gece kıyafeti.',
      cover_url: null,
      music_url: null,
      music_filename: null,
    };
  },

  mediaFullUrl(relative) {
    return this.coverFullUrl(relative);
  },

  normalizeInvitation(invitation) {
    invitation.cover_url = this.coverFullUrl(invitation.cover_url);
    invitation.music_url = this.mediaFullUrl(invitation.music_url);
    return invitation;
  },

  authHeaders(admin) {
    return admin ? LumaConfig.adminAuthHeaders() : {};
  },

  coverFullUrl(relative) {
    if (!relative) return null;
    if (relative.startsWith('http') || relative.startsWith('data:') || relative.startsWith('/assets')) {
      return relative;
    }
    return `${LumaConfig.apiBase}${relative}`;
  },

  async load(token, { admin = false } = {}) {
    if (!token) return false;
    try {
      const headers = this.authHeaders(admin);
      const invitationUrl = admin
        ? `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation`
        : `${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/invitation`;
      const requests = [fetch(invitationUrl, { headers })];
      if (admin) {
        requests.push(
          fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/guests`, { headers }),
          fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/messages`, { headers }),
          fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/activities`, { headers }),
        );
      } else {
        requests.push(
          fetch(`${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/messages`),
          fetch(`${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}`),
        );
      }
      const responses = await Promise.all(requests);
      if (!responses[0].ok) return false;
      const invitation = await responses[0].json();
      this.cache.invitation = this.normalizeInvitation(invitation);
      if (admin) {
        if (responses[1]?.ok) this.cache.guests = await responses[1].json();
        if (responses[2]?.ok) this.cache.messages = await responses[2].json();
        if (responses[3]?.ok) this.cache.activities = await responses[3].json();
        this.cache.event = null;
      } else {
        this.cache.guests = [];
        this.cache.activities = [];
        if (responses[1]?.ok) this.cache.messages = await responses[1].json();
        else this.cache.messages = [];
        if (responses[2]?.ok) this.cache.event = await responses[2].json();
        else this.cache.event = null;
        this.syncPublicEventList(token);
      }
      return true;
    } catch {
      return false;
    }
  },

  syncPublicEventList(token) {
    const event = this.cache.event;
    if (!event || !token) return;
    window._lumaEvents = [
      {
        id: event.slug,
        slug: event.slug,
        private_token: token,
        name: event.name,
        date: event.event_date || null,
        venue: event.venue || '',
        city: event.city || '',
        uploads_enabled: event.uploads_enabled !== false,
        is_active: event.is_active !== false,
      },
    ];
  },

  uploadsEnabled() {
    const meta = window._lumaEvents?.find(item => item.private_token === LumaConfig.publicEventToken());
    if (meta && meta.uploads_enabled === false) return false;
    if (this.cache.event && this.cache.event.uploads_enabled === false) return false;
    return true;
  },

  getData() {
    return {
      guests: [...this.cache.guests],
      messages: [...this.cache.messages],
      invitation: this.cache.invitation ? { ...this.cache.invitation } : null,
      activities: [...this.cache.activities],
      uploads: 0,
    };
  },

  async fetchActivities(token) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/activities`,
      { headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) return [];
    const activities = await response.json();
    this.cache.activities = activities;
    return activities;
  },

  async createGuest(token, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/guests`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Misafir eklenemedi.');
    }
    const guest = await response.json();
    this.cache.guests.push(guest);
    return guest;
  },

  async deleteGuest(token, guestId) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/guests/${encodeURIComponent(guestId)}`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) throw new Error('Misafir silinemedi.');
    this.cache.guests = this.cache.guests.filter(g => g.id !== guestId);
  },

  async updateGuest(token, guestId, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/guests/${encodeURIComponent(guestId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Misafir güncellenemedi.'));
    }
    const guest = await response.json();
    const index = this.cache.guests.findIndex(item => item.id === guestId);
    if (index >= 0) this.cache.guests[index] = guest;
    return guest;
  },

  async submitRsvp(token, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/rsvp`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Katılım yanıtı gönderilemedi.');
    }
    return response.json();
  },

  async submitMessage(token, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Mesaj gönderilemedi.');
    }
    const message = await response.json();
    this.cache.messages.push(message);
    return message;
  },

  async deleteMessage(token, messageId) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/messages/${encodeURIComponent(messageId)}`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) throw new Error('Mesaj silinemedi.');
    this.cache.messages = this.cache.messages.filter(m => m.id !== messageId);
  },

  async updateMessage(token, messageId, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/messages/${encodeURIComponent(messageId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Mesaj güncellenemedi.'));
    }
    const message = await response.json();
    const index = this.cache.messages.findIndex(item => item.id === messageId);
    if (index >= 0) this.cache.messages[index] = message;
    return message;
  },

  invitationPayloadFromForm(formData) {
    return {
      name: formData.names || formData.name || '',
      event_date: formData.event_date,
      venue: formData.venue || '',
      city: formData.city || formData.location || '',
      tagline: formData.tagline || '',
      story_title: formData.story_title || formData.storyTitle || '',
      story_text: formData.story_text || formData.storyText || '',
      guest_note: formData.guest_note || formData.guestNote || '',
    };
  },

  async saveInvitation(token, formData) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
        body: JSON.stringify(this.invitationPayloadFromForm(formData)),
      },
    );
    if (!response.ok) throw new Error('Davetiye kaydedilemedi.');
    const invitation = await response.json();
    this.cache.invitation = this.normalizeInvitation(invitation);
    return invitation;
  },

  async dataUrlToFile(dataUrl, filename = 'cover.jpg') {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  },

  async uploadCover(token, source) {
    const form = new FormData();
    if (source instanceof File) {
      form.append('file', source);
    } else if (typeof source === 'string' && source.startsWith('data:')) {
      form.append('file', await this.dataUrlToFile(source));
    } else {
      return this.removeCover(token);
    }
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/cover`,
      { method: 'POST', headers: LumaConfig.adminAuthHeaders(), body: form },
    );
    if (!response.ok) throw new Error('Kapak görseli yüklenemedi.');
    const invitation = await response.json();
    this.cache.invitation = this.normalizeInvitation(invitation);
    return invitation;
  },

  async removeCover(token) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/cover`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) throw new Error('Kapak görseli kaldırılamadı.');
    const invitation = await response.json();
    this.cache.invitation = this.normalizeInvitation(invitation);
    return invitation;
  },

  async uploadMusic(token, file) {
    const form = new FormData();
    form.append('file', file);
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/music`,
      { method: 'POST', headers: LumaConfig.adminAuthHeaders(), body: form },
    );
    if (!response.ok) throw new Error('Müzik dosyası yüklenemedi.');
    const invitation = await response.json();
    this.cache.invitation = this.normalizeInvitation(invitation);
    await this.fetchActivities(token);
    return invitation;
  },

  async removeMusic(token) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/music`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) throw new Error('Müzik dosyası kaldırılamadı.');
    const invitation = await response.json();
    this.cache.invitation = this.normalizeInvitation(invitation);
    await this.fetchActivities(token);
    return invitation;
  },

  async loadContacts() {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/contacts`, {
      headers: LumaConfig.adminAuthHeaders(),
    });
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Kişiler yüklenemedi.'));
    }
    return response.json();
  },

  async createContact(payload) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Kişi kaydedilemedi.'));
    }
    return response.json();
  },

  async fetchGuests(token) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/guests`,
      { headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Misafirler yüklenemedi.'));
    }
    return response.json();
  },

  async deleteContact(contactId) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/contacts/${encodeURIComponent(contactId)}`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (!response.ok) throw new Error('Kişi silinemedi.');
  },

  mapEvent(event) {
    return {
      id: event.slug,
      slug: event.slug,
      private_token: event.private_token,
      name: event.name,
      date: event.event_date || null,
      venue: event.venue || '',
      city: event.city || '',
      uploads_enabled: event.uploads_enabled,
      is_active: event.is_active,
    };
  },

  async listEvents() {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/events`, {
      headers: LumaConfig.adminAuthHeaders(),
    });
    if (!response.ok) throw new Error('Etkinlikler yüklenemedi.');
    const events = await response.json();
    return events.map(event => this.mapEvent(event));
  },

  async createEvent(payload) {
    if (!sessionStorage.getItem('lumaAdminJwt')) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
      body: JSON.stringify({
        name: payload.name,
        ...(payload.slug ? { slug: payload.slug } : {}),
        event_date: payload.event_date || null,
        venue: payload.venue || '',
        city: payload.city || '',
        tagline: payload.tagline || '',
        story_title: payload.story_title || '',
        story_text: payload.story_text || '',
        guest_note: payload.guest_note || '',
      }),
    });
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Etkinlik oluşturulamadı.'));
    }
    const event = await response.json();
    return this.mapEvent(event);
  },

  async fetchAdminProfile() {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/me`, {
      headers: LumaConfig.adminAuthHeaders(),
    });
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (!response.ok) throw new Error('Profil yüklenemedi.');
    return response.json();
  },

  async updateAdminProfile(payload) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(err, 'Profil kaydedilemedi.'));
    }
    return response.json();
  },

  async deleteEvent(token) {
    if (!sessionStorage.getItem('lumaAdminJwt')) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}`,
      { method: 'DELETE', headers: LumaConfig.adminAuthHeaders() },
    );
    if (response.status === 401) {
      sessionStorage.removeItem('lumaAdminJwt');
      throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
    }
    if (response.status === 404) throw new Error('Etkinlik bulunamadı.');
    if (!response.ok) throw new Error('Etkinlik silinemedi.');
  },

  async updateEvent(token, payload) {
    const response = await fetch(
      `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Etkinlik güncellenemedi.');
    }
    const event = await response.json();
    return this.mapEvent(event);
  },

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    if (response.status === 400) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Şifre değiştirilemedi.');
    }
    if (!response.ok) throw new Error('Şifre değiştirilemedi.');
  },

  async migrateLegacyEventsOnce() {
    if (localStorage.getItem('lumaEventsMigrated') === '1') return;
    let legacy = [];
    try {
      legacy = JSON.parse(localStorage.getItem('lumaEvents') || '[]');
    } catch {
      legacy = [];
    }
    if (!legacy.length) {
      localStorage.setItem('lumaEventsMigrated', '1');
      return;
    }
    let existing = [];
    try {
      existing = await this.listEvents();
    } catch {
      return;
    }
    const existingSlugs = new Set(existing.map(event => event.slug));
    const existingNames = new Set(existing.map(event => event.name.toLocaleLowerCase('tr-TR')));
    for (const item of legacy) {
      const slug = item.slug || LumaConfig.slugFromName(item.name || '');
      if (existingSlugs.has(slug) || existingNames.has((item.name || '').toLocaleLowerCase('tr-TR'))) {
        continue;
      }
      try {
        await this.createEvent({
          name: item.name || 'Etkinlik',
          slug,
          event_date: item.date || null,
          venue: item.venue || '',
          city: item.city || '',
        });
      } catch {
        /* skip */
      }
    }
    localStorage.removeItem('lumaEvents');
    localStorage.removeItem('lumaActiveEvent');
    localStorage.setItem('lumaEventsMigrated', '1');
  },
};
