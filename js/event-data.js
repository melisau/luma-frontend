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
    invitation.memory_cover_url = this.coverFullUrl(invitation.memory_cover_url);
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

  accessRequired: false,
  lastError: '',
  loadErrors: [],
  loadSequence: 0,
  async load(token, { admin = false } = {}) {
    const sequence=++this.loadSequence;
    this.cache={guests:[],messages:[],invitation:null,activities:[],event:null};
    this.lastError='';this.loadErrors=[];this.accessRequired=false;
    if(!token){this.lastError='Etkinlik seçilmedi.';return false}
    const headers=this.authHeaders(admin),base=`${LumaConfig.apiBase}/api/${admin?'admin/':''}events/${encodeURIComponent(token)}`;
    const paths=admin?['invitation','guests','messages','activities']:['invitation','messages',''];
    try{
      const results=await Promise.allSettled(paths.map(path=>fetch(`${base}${path?'/'+path:''}`,{headers})));
      const bodies=await Promise.all(results.map(async result=>{
        if(result.status!=='fulfilled')return {error:'Bağlantı kurulamadı. İnternetinizi ve API bağlantısını kontrol edin.'};
        const response=result.value;
        if(response.status===423)return {error:'Bu davetiye için erişim kodu gerekiyor.',locked:true};
        if(!response.ok)return {error:response.status===401?'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.':[403,404].includes(response.status)?'Davetiye bulunamadı veya artık erişime açık değil.':'Bilgiler yüklenemedi. Lütfen tekrar deneyin.'};
        try{return {data:await response.json()}}catch{return {error:'Sunucudan geçerli bir yanıt alınamadı.'}}
      }));
      if(sequence!==this.loadSequence)return false;
      this.accessRequired=Boolean(bodies.some(body=>body.locked));
      if(bodies[0].error||(!admin&&bodies[2].error)){this.lastError=bodies[0].error||bodies[2].error;return false}
      const next={guests:[],messages:[],invitation:this.normalizeInvitation(bodies[0].data),activities:[],event:null};
      if(admin){
        for(const [index,key,label] of [[1,'guests','Misafirler'],[2,'messages','Anı defteri'],[3,'activities','Aktiviteler']]){
          if(bodies[index].error)this.loadErrors.push(`${label}: ${bodies[index].error}`);
          else next[key]=bodies[index].data;
        }
      }else{
        if(bodies[1].error)this.loadErrors.push(`Anı defteri: ${bodies[1].error}`);
        else next.messages=bodies[1].data;
        next.event=bodies[2].data;
      }
      this.cache=next;
      if(!admin)this.syncPublicEventList(token);
      return true;
    }catch{
      if(sequence===this.loadSequence)this.lastError='Bilgiler yüklenemedi. Lütfen tekrar deneyin.';
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

  memoriesExpired() {
    const deadline=this.cache.event?.memory_delete_at||window.currentEventMeta?.().memory_delete_at;
    return Boolean(deadline&&LumaDates.parse(deadline).getTime()<=Date.now());
  },

  uploadsEnabled() {
    if(this.memoriesExpired())return false;
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
        body: JSON.stringify({...payload,edit_token:LumaRsvpAccess.credential(token,payload.email)}),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(typeof err.detail==='string'?err.detail:'Bilgilerinizi kontrol edin: geçerli e-posta ve 1–20 arası kişi sayısı gereklidir.');
    }
    const receipt=await response.json();
    LumaRsvpAccess.save(token,payload.email,receipt.edit_token);
    return receipt;
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
      signature_text: formData.signature_text || formData.signatureText || '',
      memory_title: formData.memory_title || formData.memoryTitle || '',
      memory_text: formData.memory_text || formData.memoryText || '',
      language: formData.language || 'tr',
      design_theme: formData.design_theme || formData.designTheme || 'romantic',
      opening_style: formData.opening_style || 'classic',
      address:formData.address||'',
      transport_notes:formData.transport_notes||'',
      contact_info:formData.contact_info||'',
      schedule:formData.schedule||'',

      envelope_color: formData.envelope_color || '#e9dcc4',
      seal_color: formData.seal_color || '#873f43',
      paper_color: formData.paper_color || '#fffdf7',
      envelope_texture: formData.envelope_texture || 'linen',
      envelope_pattern: formData.envelope_pattern || 'plain',
      seal_motif: formData.seal_motif || 'botanical',

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

  async uploadMemoryCover(token, file) {
    const form=new FormData();form.append('file',file);
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/memory-cover`,{method:'POST',headers:LumaConfig.adminAuthHeaders(),body:form});
    if(!response.ok)throw new Error('Anı bölümü görseli yüklenemedi.');
    return this.cache.invitation=this.normalizeInvitation(await response.json());
  },

  async removeMemoryCover(token) {
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/invitation/memory-cover`,{method:'DELETE',headers:LumaConfig.adminAuthHeaders()});
    if(!response.ok)throw new Error('Anı bölümü görseli kaldırılamadı.');
    return this.cache.invitation=this.normalizeInvitation(await response.json());
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
      memory_delete_at: event.memory_delete_at,
      publish_at: event.publish_at,
      rsvp_reminder_at: event.rsvp_reminder_at,
      rsvp_reminder_sent_at: event.rsvp_reminder_sent_at,
      album_public: event.album_public,
      access_code_enabled: event.access_code_enabled,
      role: event.role || 'owner',
      is_active: event.is_active,
    };
  },

  async listEvents() {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/events`, {
      headers: LumaConfig.adminAuthHeaders(),
    });
    if (response.status === 401) throw new Error('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.');
    if (!response.ok) throw new Error('Etkinlikler yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.');
    const events = await response.json();
    return events.map(event => this.mapEvent(event));
  },

  async listMembers(token) {
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/members`,{headers:LumaConfig.adminAuthHeaders()});
    if(!response.ok)throw new Error('Etkinlik ekibi yüklenemedi.');
    return response.json();
  },
  async addMember(token,payload) {
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/members`,{method:'POST',headers:{'Content-Type':'application/json',...LumaConfig.adminAuthHeaders()},body:JSON.stringify(payload)});
    if(!response.ok){const error=await response.json().catch(()=>({}));throw new Error(error.detail||'Ekip üyesi eklenemedi.')}
    return response.json();
  },
  async updateMember(token,id,role) {
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/members/${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json',...LumaConfig.adminAuthHeaders()},body:JSON.stringify({role})});
    if(!response.ok)throw new Error('Rol güncellenemedi.');return response.json();
  },
  async removeMember(token,id) {
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/members/${encodeURIComponent(id)}`,{method:'DELETE',headers:LumaConfig.adminAuthHeaders()});
    if(!response.ok)throw new Error('Ekip üyesi kaldırılamadı.');
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
