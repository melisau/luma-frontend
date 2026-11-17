// Full-screen slide show of an event's approved photos (/e/<token>/slayt).
// The owner opens it on the venue screen from the panel; guests with their personal link can open it
// when the owner allows. New approvals join within ~30 s without restarting the show.
window.LumaSlideshow = {
  TITLE_MS: 4500,
  REFRESH_MS: 30000,
  MIX: ['fade', 'zoom', 'slide'],
  slides: [],
  index: -1,
  playing: true,
  timer: null,
  layer: 'a',
  data: null,

  token(pathname = location.pathname) {
    const match = pathname.match(/^\/e\/([^/]+)\/slayt\/?$/);
    return match ? decodeURIComponent(match[1]) : '';
  },

  // Keeps the photo on screen when the list is refreshed; returns the index to continue from.
  // If that photo was taken out, the show goes on with the one that took its place.
  merge(incoming, currentId, currentIndex) {
    const position = incoming.findIndex(item => item.id === currentId);
    return { slides: incoming, index: position >= 0 ? position : Math.min(currentIndex, incoming.length) - 1 };
  },

  transitionFor(setting, index) {
    return setting === 'mix' ? this.MIX[index % this.MIX.length] : setting || 'fade';
  },

  captionHtml(slide, escape) {
    const name = (slide.uploader_name || '').trim(), text = (slide.caption || '').trim();
    if (!name && !text) return '';
    return [text && `“${escape(text)}”`, name && `<em>${escape(name)}</em>`].filter(Boolean).join(' · ');
  },

  async fetchData(token) {
    const response = await fetch(`${LumaConfig.apiBase}/api/events/${encodeURIComponent(token)}/slideshow`);
    if (response.status === 401) throw Object.assign(new Error('Bu slayt gösterisi kişiye özel bir davetiyeye ait. Size gönderilen kişisel bağlantıyı bu cihazda bir kez açın, sonra tekrar deneyin.'), { title: 'Davetiyenizi açın' });
    if (response.status === 404) throw Object.assign(new Error('Etkinlik sahibi bu slayt gösterisini misafirlerle paylaşmıyor.'), { title: 'Slayt gösterisi kapalı' });
    if (!response.ok) throw Object.assign(new Error('Slayt gösterisi yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.'), { title: 'Bir sorun oluştu' });
    return response.json();
  },

  // --- page ---------------------------------------------------------------------------------
  el(id) { return document.getElementById(id); },
  escape(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; },

  showMessage(title, text) {
    this.el('messageTitle').textContent = title; this.el('messageText').textContent = text;
    this.el('message').classList.remove('hidden');
  },

  async start() {
    const token = this.token();
    if (!token) return this.showMessage('Slayt gösterisi bulunamadı', 'Bağlantıyı kontrol edin.');
    try { this.data = await this.fetchData(token); } catch (error) { return this.showMessage(error.title, error.message); }
    this.slides = this.data.slides || [];
    document.title = `${this.data.title} · Slayt gösterisi`;
    this.el('showTitle').textContent = this.data.title;
    this.bindControls();
    if (!this.slides.length) {
      this.showMessage(this.data.title, 'Henüz gösterilecek fotoğraf yok. Onaylanan fotoğraflar burada kendiliğinden belirecek.');
    }
    await this.titleCard();
    this.next();
    setInterval(() => this.refresh(token), this.REFRESH_MS);
  },

  async refresh(token) {
    try {
      const data = await this.fetchData(token);
      const currentId = this.slides[this.index]?.id;
      const merged = this.merge(data.slides || [], currentId, this.index);
      const wasEmpty = !this.slides.length;
      this.data = data; this.slides = merged.slides; this.index = merged.index;
      this.el('showTitle').textContent = data.title;
      if (this.slides.length) this.el('message').classList.add('hidden');
      if (wasEmpty && this.slides.length) this.next();
      this.updatePosition();
    } catch {}
  },

  titleCard() {
    const card = this.el('titleCard');
    this.el('showCount').textContent = this.slides.length ? `${this.slides.length} fotoğraf` : '';
    card.classList.add('visible');
    return new Promise(resolve => setTimeout(() => { card.classList.remove('visible'); resolve(); }, this.TITLE_MS));
  },

  show(index) {
    if (!this.slides.length) return;
    this.index = (index + this.slides.length) % this.slides.length;
    const slide = this.slides[this.index];
    const show = this.el('show');
    show.dataset.transition = this.transitionFor(this.data.transition, this.index);
    show.style.setProperty('--fade', show.dataset.transition === 'slide' ? '1.1s' : '1.4s');
    const incoming = document.querySelector(`.slide[data-layer="${this.layer === 'a' ? 'b' : 'a'}"]`);
    const outgoing = document.querySelector(`.slide[data-layer="${this.layer}"]`);
    const url = `${LumaConfig.apiBase}${slide.url}`;
    const img = incoming.querySelector('img');
    const reveal = () => {
      incoming.querySelector('.slide-backdrop').style.backgroundImage = `url("${url}")`;
      img.style.transitionDuration = `${(this.data.seconds || 6) + 1.5}s`;
      incoming.classList.remove('leaving');
      // Slide-in starts from the right edge: put it there without animating first.
      if (show.dataset.transition === 'slide') { incoming.style.transition = 'none'; incoming.offsetWidth; incoming.style.transition = ''; }
      incoming.classList.add('active');
      outgoing.classList.remove('active');
      outgoing.classList.add('leaving');
      setTimeout(() => outgoing.classList.remove('leaving'), 1500);
      this.layer = incoming.dataset.layer;
      const caption = this.el('caption');
      caption.classList.remove('visible');
      caption.innerHTML = this.captionHtml(slide, value => this.escape(value));
      setTimeout(() => caption.classList.add('visible'), 600);
      this.updatePosition();
      const following = this.slides[(this.index + 1) % this.slides.length];
      if (following) new Image().src = `${LumaConfig.apiBase}${following.url}`;
    };
    img.onload = reveal; img.onerror = () => this.schedule(1000);
    img.src = url;
    this.schedule((this.data.seconds || 6) * 1000);
  },

  schedule(ms) {
    clearTimeout(this.timer);
    if (this.playing) this.timer = setTimeout(() => this.advance(), ms);
  },

  async advance() {
    // One pass is done: show the title card again, like the start of a recap.
    if (this.slides.length > 1 && this.index === this.slides.length - 1) await this.titleCard();
    this.next();
  },

  next() { this.show(this.index + 1); },
  prev() { this.show(this.index - 1); },

  togglePlay() {
    this.playing = !this.playing;
    this.el('playBtn').textContent = this.playing ? '❚❚' : '▶';
    this.el('playBtn').setAttribute('aria-label', this.playing ? 'Duraklat' : 'Oynat');
    if (this.playing) this.schedule((this.data.seconds || 6) * 1000); else clearTimeout(this.timer);
  },

  updatePosition() {
    this.el('position').textContent = this.slides.length ? `${this.index + 1} / ${this.slides.length}` : '';
  },

  bindControls() {
    const show = this.el('show');
    let idle;
    const wake = () => { show.classList.add('pointer'); clearTimeout(idle); idle = setTimeout(() => show.classList.remove('pointer'), 2500); };
    ['mousemove', 'touchstart', 'keydown'].forEach(name => document.addEventListener(name, wake, { passive: true }));
    this.el('nextBtn').onclick = () => this.next();
    this.el('prevBtn').onclick = () => this.prev();
    this.el('playBtn').onclick = () => this.togglePlay();
    const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())?.catch?.(() => {});
    this.el('fullscreenBtn').onclick = fullscreen;
    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') this.next();
      else if (event.key === 'ArrowLeft') this.prev();
      else if (event.key === ' ') { event.preventDefault(); this.togglePlay(); }
      else if (event.key.toLowerCase() === 'f') fullscreen();
    });
    document.addEventListener('fullscreenchange', () => { this.el('fullscreenBtn').textContent = document.fullscreenElement ? 'Tam ekrandan çık' : 'Tam ekran'; });
  }
};

if (document.getElementById('show')) window.LumaSlideshow.start();
