// Panel: the owner curates the slide show (order, add, remove, own photos, transition, timing).
// Guest photos (venue QR or personal link) can only be added once approved in the gallery.
window.LumaSlideshowEditor = {
  state: null,
  token: '',

  // Pure helpers (tested) ---------------------------------------------------------------------
  move(ids, index, step) {
    const target = index + step;
    if (target < 0 || target >= ids.length) return ids.slice();
    const next = ids.slice();
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  },
  remove(ids, id) { return ids.filter(item => item !== id); },
  add(ids, id) { return ids.includes(id) ? ids.slice() : [...ids, id]; },

  // API -----------------------------------------------------------------------------------------
  url(token) { return `${LumaConfig.apiBase}/api/admin/events/${encodeURIComponent(token)}/slideshow`; },
  async load(token) {
    const response = await fetch(this.url(token), { headers: LumaConfig.adminAuthHeaders() });
    if (!response.ok) throw new Error('Slayt gösterisi yüklenemedi.');
    return response.json();
  },
  async save(token, payload) {
    const response = await fetch(this.url(token), {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() }, body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Slayt gösterisi kaydedilemedi.');
    return response.json();
  },
  async approve(photoId) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/photos/${encodeURIComponent(photoId)}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() }, body: JSON.stringify({ status: 'approved' })
    });
    if (!response.ok) throw new Error('Fotoğraf onaylanamadı.');
  },

  // UI ------------------------------------------------------------------------------------------
  async open(token) {
    this.token = token;
    const modal = document.getElementById('modal'), content = document.getElementById('modalContent');
    document.querySelector('.modal-card').classList.remove('media-viewer-card');
    document.querySelector('.modal-card').classList.add('slideshow-editor-card');
    content.innerHTML = '<div class="slideshow-editor"><p class="invite-kicker">SLAYT GÖSTERİSİ</p><h2>Anılarınızdan bir gösteri</h2><p class="slideshow-help">Fotoğraflar seçtiğiniz sırayla, geçişlerle tam ekranda oynar. Salon ekranında açabilir, isterseniz misafirlerinizin de davetiyeden izlemesine izin verebilirsiniz. Misafirlerin yüklediği fotoğraflar ancak Galeri\'de onayladıktan sonra eklenebilir.</p><div id="slideshowEditorBody" role="status">Yükleniyor...</div></div>';
    modal.classList.remove('hidden');
    try { this.state = await this.load(token); this.render(); } catch (error) { document.getElementById('slideshowEditorBody').textContent = error.message; }
  },

  thumb(photo) {
    const item = LumaGallery.normalizePhoto(photo, this.token, { admin: true });
    const img = document.createElement('img');
    img.alt = photo.uploader_name ? `${photo.uploader_name} yükledi` : 'Fotoğraf';
    LumaGallery.loadImage(img, item.thumbPath, item);
    return img;
  },

  render() {
    const s = this.state, body = document.getElementById('slideshowEditorBody');
    body.innerHTML = `
      <div class="slideshow-settings">
        <label><span>BAŞLIK</span><input id="ssTitle" maxlength="120" placeholder="Boş bırakırsanız etkinlik adı"></label>
        <label><span>GEÇİŞ</span><select id="ssTransition"><option value="fade">Yumuşak geçiş</option><option value="zoom">Yavaş yakınlaşma</option><option value="slide">Kayarak</option><option value="mix">Karışık</option></select></label>
        <label><span>HER FOTOĞRAF</span><select id="ssSeconds">${[4, 5, 6, 8, 10, 12].map(n => `<option value="${n}">${n} saniye</option>`).join('')}</select></label>
        <label class="slideshow-check"><input type="checkbox" id="ssAuto"><span>Onayladığım yeni fotoğrafları sona kendiliğinden ekle</span></label>
        <label class="slideshow-check"><input type="checkbox" id="ssCaptions"><span>Fotoğrafı ekleyenin adını ve notunu göster</span></label>
        <label class="slideshow-check"><input type="checkbox" id="ssGuests"><span>Misafirlerim davetiyeden izleyebilsin</span></label>
      </div>
      <p id="ssAlbumNote" class="slideshow-help slideshow-note hidden">Ayarlar'da "Onaylı fotoğrafları misafirlerle paylaş" kapalı olduğu için misafirler gösteriyi göremez. Siz salon ekranında yine açabilirsiniz.</p>
      <h3>Gösterideki fotoğraflar <small id="ssCount"></small></h3>
      <ol id="ssSlides" class="slideshow-strip"></ol>
      <p id="ssEmpty" class="slideshow-help hidden">Henüz fotoğraf yok. Aşağıdan onaylı fotoğrafları ekleyin ya da kendi fotoğraflarınızı yükleyin.</p>
      <h3>Eklenebilecek onaylı fotoğraflar</h3>
      <div id="ssAvailable" class="slideshow-grid"></div>
      <label class="ghost-btn slideshow-upload"><input id="ssUpload" type="file" accept="image/*" multiple hidden>Kendi fotoğraflarımı ekle</label>
      <p id="ssUploadStatus" class="slideshow-help" role="status"></p>
      <div class="slideshow-actions"><button type="button" id="ssSave" class="create-btn">Kaydet</button><button type="button" id="ssPlay" class="ghost-btn">Gösteriyi başlat ↗</button></div>`;
    document.getElementById('ssTitle').value = s.title || '';
    document.getElementById('ssTransition').value = s.transition;
    document.getElementById('ssSeconds').value = String(s.seconds);
    document.getElementById('ssAuto').checked = s.auto_add;
    document.getElementById('ssCaptions').checked = s.show_captions;
    document.getElementById('ssGuests').checked = s.show_to_guests;
    document.getElementById('ssAlbumNote').classList.toggle('hidden', s.album_public !== false);
    this.renderPhotos();
    document.getElementById('ssSave').onclick = () => this.persist();
    document.getElementById('ssPlay').onclick = async () => {
      // Saves first, so the screen shows what the owner sees here; the panel's preview cookie lets
      // the owner's browser open it even when guests are not allowed.
      const tab = window.open('about:blank', '_blank');
      try { await this.persist(true); if (tab) tab.location.href = this.state.player_path; } catch (error) { tab?.close(); Luma.toast(error.message); }
    };
    document.getElementById('ssUpload').onchange = event => this.uploadOwn([...event.target.files]);
  },

  renderPhotos() {
    const s = this.state, strip = document.getElementById('ssSlides'), grid = document.getElementById('ssAvailable');
    strip.replaceChildren(); grid.replaceChildren();
    document.getElementById('ssCount').textContent = `(${s.slides.length})`;
    document.getElementById('ssEmpty').classList.toggle('hidden', s.slides.length > 0);
    s.slides.forEach((photo, index) => {
      const li = document.createElement('li'); li.className = 'slideshow-slide';
      li.append(this.thumb(photo));
      const tools = document.createElement('div'); tools.className = 'slideshow-slide-tools';
      tools.innerHTML = `<span>${index + 1}</span><button type="button" data-step="-1" aria-label="Öne al" ${index === 0 ? 'disabled' : ''}>‹</button><button type="button" data-step="1" aria-label="Sona doğru al" ${index === s.slides.length - 1 ? 'disabled' : ''}>›</button><button type="button" data-remove aria-label="Gösteriden çıkar">×</button>`;
      tools.querySelectorAll('[data-step]').forEach(button => button.onclick = () => this.reorder(index, Number(button.dataset.step)));
      tools.querySelector('[data-remove]').onclick = () => { s.available = [photo, ...s.available]; s.slides = s.slides.filter(item => item.id !== photo.id); this.renderPhotos(); };
      li.append(tools); strip.append(li);
    });
    if (!s.available.length) grid.innerHTML = '<p class="slideshow-help">Eklenecek onaylı fotoğraf yok. Galeri\'de bekleyen fotoğrafları onayladığınızda burada görünür.</p>';
    s.available.forEach(photo => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'slideshow-pick';
      button.setAttribute('aria-label', 'Gösteriye ekle'); button.append(this.thumb(photo));
      const plus = document.createElement('span'); plus.textContent = '+'; button.append(plus);
      button.onclick = () => { s.slides = [...s.slides, photo]; s.available = s.available.filter(item => item.id !== photo.id); this.renderPhotos(); };
      grid.append(button);
    });
  },

  reorder(index, step) {
    const ids = this.move(this.state.slides.map(p => p.id), index, step);
    const byId = Object.fromEntries(this.state.slides.map(p => [p.id, p]));
    this.state.slides = ids.map(id => byId[id]);
    this.renderPhotos();
  },

  payload() {
    return {
      photo_ids: this.state.slides.map(p => p.id),
      title: document.getElementById('ssTitle').value.trim(),
      transition: document.getElementById('ssTransition').value,
      seconds: Number(document.getElementById('ssSeconds').value),
      auto_add: document.getElementById('ssAuto').checked,
      show_captions: document.getElementById('ssCaptions').checked,
      show_to_guests: document.getElementById('ssGuests').checked
    };
  },

  async persist(quiet = false) {
    const button = document.getElementById('ssSave'); button.disabled = true;
    try {
      this.state = await this.save(this.token, this.payload());
      this.renderPhotos();
      if (!quiet) Luma.toast('Slayt gösterisi kaydedildi.');
    } finally { button.disabled = false; }
  },

  async uploadOwn(files) {
    if (!files.length) return;
    const status = document.getElementById('ssUploadStatus');
    status.textContent = `${files.length} fotoğraf yükleniyor...`;
    try {
      const name = (sessionStorage.getItem('lumaAdminDisplayName') || 'Etkinlik sahibi').slice(0, 255);
      const result = await LumaUpload.uploadMany(this.token, files, name, '', { onProgress: (p, done, total) => { status.textContent = `Yükleniyor... ${done}/${total}`; } });
      // The owner's own photos need no review: approve them and put them at the end of the show.
      for (const photo of result.uploaded) await this.approve(photo.id);
      const order = this.state.slides.map(p => p.id).concat(result.uploaded.map(p => p.id));
      this.state = await this.save(this.token, { ...this.payload(), photo_ids: order });
      this.renderPhotos();
      status.textContent = `${result.uploaded.length} fotoğraf gösteriye eklendi.${result.failed.length ? ` ${result.failed.length} fotoğraf yüklenemedi.` : ''}`;
    } catch (error) {
      status.textContent = error.message || 'Fotoğraflar yüklenemedi.';
    }
  }
};
