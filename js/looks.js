// Ready-made looks: one click sets the envelope, the invitation colours and the font together.
// The owner can still change any single setting afterwards; nothing is saved until "Kaydet".
window.LumaLooks = {
  EVENT_TYPES: {
    wedding: 'Düğün', engagement: 'Nişan', nikah: 'Nikâh', henna: 'Kına gecesi', circumcision: 'Sünnet düğünü',
    birthday: 'Doğum günü', baby_shower: 'Baby shower', corporate: 'Kurumsal etkinlik', other: 'Diğer'
  },
  FONTS: { classic: 'Klasik · Zarif serif', modern: 'Modern · Belirgin başlıklar', script: 'El yazısı · İsimler kaligrafik', clean: 'Sade · Yalın yazı' },
  LOOKS: [
    { id: 'orman', name: 'Orman Yeşili', note: 'Koyu yeşil zarf, krem davetiye', types: ['wedding', 'engagement', 'nikah'], font: 'classic',
      envelope: { envelope_color: '#25463B', paper_color: '#FFFDF7', ribbon_color: '#718CA2' },
      palette: { background: '#F8F5EF', text: '#242B27', heading: '#25463B', hero_text: '#FFFFFF', details_background: '#EDF0E7', memory_background: '#F8F5EF', memory_text: '#242B27', badge_background: '#925551', badge_text: '#FFFFFF', button_background: '#25463B', button_text: '#FFFFFF', countdown_background: '#25463B', countdown_text: '#FFFFFF' } },
    { id: 'gece-altin', name: 'Gece & Altın', note: 'Siyah zemin, altın vurgular; akşam davetleri için', types: ['wedding', 'engagement', 'corporate'], font: 'modern',
      envelope: { envelope_color: '#161616', paper_color: '#F4ECDD', ribbon_color: '#C9A55A' },
      palette: { background: '#121212', text: '#EDE6D6', heading: '#D4AF6A', hero_text: '#FFFFFF', details_background: '#1C1C1C', memory_background: '#121212', memory_text: '#EDE6D6', badge_background: '#C9A55A', badge_text: '#121212', button_background: '#C9A55A', button_text: '#121212', countdown_background: '#0B0B0B', countdown_text: '#D4AF6A' } },
    { id: 'zeytin-altin', name: 'Zeytin & Altın', note: 'Zeytin yeşili ve sıcak altın; kır ve bağ düğünleri', types: ['wedding', 'nikah', 'engagement'], font: 'classic',
      envelope: { envelope_color: '#5B6B3A', paper_color: '#F7F3EA', ribbon_color: '#B8975A' },
      palette: { background: '#F7F3EA', text: '#3E4430', heading: '#5B6B3A', hero_text: '#FFFFFF', details_background: '#ECE9DC', memory_background: '#F7F3EA', memory_text: '#3E4430', badge_background: '#B8975A', badge_text: '#FFFFFF', button_background: '#5B6B3A', button_text: '#FFFFFF', countdown_background: '#4A5730', countdown_text: '#F7F3EA' } },
    { id: 'pudra-botanik', name: 'Pudra Botanik', note: 'Pudra pembesi, gül kurusu; isimler el yazısıyla', types: ['wedding', 'engagement', 'baby_shower'], font: 'script',
      envelope: { envelope_color: '#D9B8B0', paper_color: '#FFF8F5', ribbon_color: '#A87C7C' },
      palette: { background: '#FFF8F5', text: '#5A4646', heading: '#9A6B6B', hero_text: '#FFFFFF', details_background: '#F7E9E5', memory_background: '#FFF8F5', memory_text: '#5A4646', badge_background: '#C98F8F', badge_text: '#FFFFFF', button_background: '#9A6B6B', button_text: '#FFFFFF', countdown_background: '#9A6B6B', countdown_text: '#FFF8F5' } },
    { id: 'kina-gecesi', name: 'Kına Gecesi', note: 'Kadife kırmızı ve altın', types: ['henna', 'circumcision'], font: 'script',
      envelope: { envelope_color: '#7A1023', paper_color: '#FBF3E4', ribbon_color: '#C9A55A' },
      palette: { background: '#FBF3E4', text: '#4A1A20', heading: '#7A1023', hero_text: '#FFFFFF', details_background: '#F3E2CF', memory_background: '#FBF3E4', memory_text: '#4A1A20', badge_background: '#C9A55A', badge_text: '#4A1A20', button_background: '#7A1023', button_text: '#FFFFFF', countdown_background: '#5C0C1A', countdown_text: '#F3D9A0' } },
    { id: 'deniz', name: 'Deniz Esintisi', note: 'Lacivert ve açık mavi; sahil ve tekne davetleri', types: ['wedding', 'nikah', 'birthday', 'circumcision'], font: 'modern',
      envelope: { envelope_color: '#24476B', paper_color: '#F6F9FB', ribbon_color: '#C9D7E3' },
      palette: { background: '#F6F9FB', text: '#22384D', heading: '#24476B', hero_text: '#FFFFFF', details_background: '#E6EEF4', memory_background: '#F6F9FB', memory_text: '#22384D', badge_background: '#D4A65A', badge_text: '#FFFFFF', button_background: '#24476B', button_text: '#FFFFFF', countdown_background: '#1C3A57', countdown_text: '#FFFFFF' } },
    { id: 'pastel-kutlama', name: 'Pastel Kutlama', note: 'Açık mavi ve pembe; çocuk ve bebek kutlamaları', types: ['birthday', 'baby_shower', 'circumcision'], font: 'clean',
      envelope: { envelope_color: '#A8D5E2', paper_color: '#FFFDF5', ribbon_color: '#F4B6C2' },
      palette: { background: '#FFFDF5', text: '#3D4A5C', heading: '#D96C8E', hero_text: '#FFFFFF', details_background: '#EAF6F9', memory_background: '#FFFDF5', memory_text: '#3D4A5C', badge_background: '#F4B6C2', badge_text: '#3D4A5C', button_background: '#D96C8E', button_text: '#FFFFFF', countdown_background: '#5BA9BE', countdown_text: '#FFFFFF' } },
    { id: 'kurumsal', name: 'Kurumsal Lacivert', note: 'Lacivert ve sade altın; lansman, gala, toplantı', types: ['corporate', 'other'], font: 'modern',
      envelope: { envelope_color: '#1F2A44', paper_color: '#F7F7F5', ribbon_color: '#B9975B' },
      palette: { background: '#FFFFFF', text: '#1F2A44', heading: '#1F2A44', hero_text: '#FFFFFF', details_background: '#F1F3F7', memory_background: '#FFFFFF', memory_text: '#1F2A44', badge_background: '#B9975B', badge_text: '#FFFFFF', button_background: '#1F2A44', button_text: '#FFFFFF', countdown_background: '#1F2A44', countdown_text: '#FFFFFF' } },
    { id: 'sade-beyaz', name: 'Sade Beyaz', note: 'Bol beyaz alan, siyah yazı', types: ['nikah', 'corporate', 'other', 'birthday'], font: 'clean',
      envelope: { envelope_color: '#E8E4DC', paper_color: '#FFFFFF', ribbon_color: '#8C8C8C' },
      palette: { background: '#FFFFFF', text: '#181818', heading: '#181818', hero_text: '#FFFFFF', details_background: '#F4F4F2', memory_background: '#FFFFFF', memory_text: '#181818', badge_background: '#151515', badge_text: '#FFFFFF', button_background: '#151515', button_text: '#FFFFFF', countdown_background: '#151515', countdown_text: '#FFFFFF' } }
  ],

  // Looks made for this event type first, the rest after (order kept within each group).
  ordered(eventType) {
    const fits = look => look.types.includes(eventType);
    return [...this.LOOKS.filter(fits), ...this.LOOKS.filter(look => !fits(look))].map(look => ({ ...look, recommended: fits(look) }));
  },
  find(id) { return this.LOOKS.find(look => look.id === id) || null; },

  init() {
    const panel = document.createElement('section');
    panel.className = 'editor-panel looks-panel';
    const typeOptions = Object.entries(this.EVENT_TYPES).map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
    panel.innerHTML = `<div class="editor-panel-head"><span>✧</span><div><h2>Hazır görünümler</h2><p>Ne kutladığınızı seçin; size uygun görünümler öne gelir. Bir görünüm zarfı, davetiye renklerini ve yazı tipini birlikte ayarlar, sonra her birini ayrıca değiştirebilirsiniz.</p></div></div>
      <label class="editor-field"><span>NE KUTLUYORSUNUZ?</span><select id="eventTypeSelect" data-presentation="event_type">${typeOptions}</select></label>
      <input type="hidden" data-presentation="look" id="lookInput">
      <div id="lookGrid" class="look-grid" role="list"></div>
      <p id="lookStatus" class="look-status" role="status"></p>`;
    const firstStage = document.querySelector('.editor-stage-divider[data-stage="1"]') || document.querySelector('.opening-style-panel');
    firstStage.before(panel);
    document.getElementById('eventTypeSelect').addEventListener('change', () => this.render());
    // The font choice belongs to the invitation (stage 2), next to its colours.
    const fontField = document.createElement('label'); fontField.className = 'editor-field font-field';
    fontField.innerHTML = `<span>YAZI TİPİ</span><select id="fontSelect" data-presentation="font">${Object.entries(this.FONTS).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select>`;
    const colorGrid = document.querySelector('.invitation-colors-panel .invitation-color-grid');
    (colorGrid || document.querySelector('.invitation-colors-panel')).before(fontField);
    document.getElementById('fontSelect').addEventListener('change', () => { LumaPresentation.apply(LumaPresentation.readEditor()); window.LumaEditorPreview?.schedule(); });
    this.render();
  },

  swatch(look) {
    const p = look.palette, e = look.envelope;
    return `<span class="look-swatch" aria-hidden="true"><span class="look-envelope" style="background:${e.envelope_color}"><i style="background:${e.ribbon_color}"></i></span><span class="look-card" style="background:${p.background};color:${p.heading}"><b class="look-font-${look.font}">Aa</b><em style="background:${p.button_background}"></em><em style="background:${p.details_background}"></em><em style="background:${p.countdown_background}"></em></span></span>`;
  },

  render() {
    const grid = document.getElementById('lookGrid'); if (!grid) return;
    const type = document.getElementById('eventTypeSelect').value || 'wedding';
    const current = document.getElementById('lookInput').value;
    grid.innerHTML = this.ordered(type).map(look => `<button type="button" class="look-option${look.id === current ? ' selected' : ''}" data-look="${look.id}" role="listitem" aria-pressed="${look.id === current}">${this.swatch(look)}<strong>${look.name}</strong><small>${look.note}</small>${look.recommended ? '<span class="look-badge">Önerilen</span>' : ''}</button>`).join('');
    grid.querySelectorAll('[data-look]').forEach(button => button.onclick = () => this.apply(button.dataset.look));
  },

  apply(id) {
    const look = this.find(id); if (!look) return;
    LumaEnvelope.fillEditor({ ...LumaEnvelope.readEditor(), ...look.envelope });
    const theme = document.getElementById('contentTheme')?.value || 'romantic';
    LumaInvitationColors.fillEditor(look.palette, theme);
    LumaInvitationColors.apply(document.getElementById('invitation'), look.palette, theme);
    document.getElementById('fontSelect').value = look.font;
    document.getElementById('lookInput').value = look.id;
    LumaPresentation.apply(LumaPresentation.readEditor());
    // Tell the progress steps and the preview that both stages changed.
    document.getElementById('envelope_color')?.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.invitation-colors-panel [data-palette-color]')?.dispatchEvent(new Event('input', { bubbles: true }));
    window.LumaEditorPreview?.showSection?.(document.getElementById('openingStyle')?.value === 'envelope' ? 'opening-envelope' : 'inviteHero');
    window.LumaEditorPreview?.schedule();
    this.render();
    document.getElementById('lookStatus').textContent = `“${look.name}” uygulandı. Zarfı, renkleri ve yazı tipini ayrıca değiştirebilirsiniz; Kaydet ile etkinliğinize uygulanır.`;
  }
};
