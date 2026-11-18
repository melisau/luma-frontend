// Instagram story image (1080x1920) made from the saved invitation: names, date, place,
// the invitation colours and font, and the cover photo. Drawn in the browser; nothing is uploaded.
window.LumaStoryImage = {
  WIDTH: 1080, HEIGHT: 1920,
  FONTS: {
    classic: { names: "600 120px 'Cormorant Garamond'", body: "500 46px 'Cormorant Garamond'", family: 'Cormorant Garamond' },
    modern: { names: "600 104px 'Playfair Display'", body: "500 40px 'Manrope'", family: 'Playfair Display' },
    script: { names: "400 132px 'Great Vibes'", body: "500 46px 'Cormorant Garamond'", family: 'Great Vibes' },
    clean: { names: "600 100px 'Manrope'", body: "500 38px 'Manrope'", family: 'Manrope' }
  },
  FALLBACK: { background: '#F8F5EF', text: '#242B27', heading: '#25463B', button_background: '#25463B', button_text: '#FFFFFF' },

  // Everything the picture shows, from the invitation as the server returns it.
  content(inv = {}, { locale = 'tr-TR', timeZone } = {}) {
    const palette = { ...this.FALLBACK };
    for (const key of Object.keys(this.FALLBACK)) if (/^#[0-9a-f]{6}$/i.test(inv.palette?.[key] || '')) palette[key] = inv.palette[key];
    const date = inv.event_date ? new Date(inv.event_date) : null;
    const valid = date && !Number.isNaN(date.getTime());
    const opts = timeZone ? { timeZone } : {};
    return {
      kicker: (inv.tagline || 'Davetlisiniz').trim(),
      names: (inv.name || 'Davetiyemiz').trim(),
      date: valid ? date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', ...opts }) : '',
      weekdayTime: valid ? `${date.toLocaleDateString(locale, { weekday: 'long', ...opts })} · ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', ...opts })}` : '',
      place: [inv.venue, inv.city].map(v => (v || '').trim()).filter(Boolean).join(' · '),
      footer: 'Ayrıntılar ve katılım yanıtı davetiyede',
      palette,
      font: this.FONTS[inv.presentation?.font] ? inv.presentation.font : 'classic',
      cover: inv.cover_url || ''
    };
  },

  // Splits text into lines that fit the width (measureText from the canvas).
  wrap(text, maxWidth, measure, maxLines = 3) {
    const words = String(text).split(/\s+/).filter(Boolean), lines = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && measure(next) > maxWidth) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) { const kept = lines.slice(0, maxLines); kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, '') + '…'; return kept; }
    return lines;
  },

  async loadCover(url) {
    if (!url) return null;
    try {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) return null;
      return await createImageBitmap(await response.blob());
    } catch { return null; }
  },

  async render(inv, { canvas = document.createElement('canvas') } = {}) {
    const data = this.content(inv);
    const font = this.FONTS[data.font];
    try { await Promise.all([document.fonts.load(font.names), document.fonts.load(font.body)]); } catch {}
    const cover = await this.loadCover(data.cover);
    canvas.width = this.WIDTH; canvas.height = this.HEIGHT;
    const ctx = canvas.getContext('2d'), W = this.WIDTH, H = this.HEIGHT, p = data.palette;
    ctx.fillStyle = p.background; ctx.fillRect(0, 0, W, H);

    let top = 720; // without a photo the text sits in the middle
    if (cover) {
      // Photo fills the top part, cropped to cover, fading into the background.
      const area = { h: 1080 }, scale = Math.max(W / cover.width, area.h / cover.height);
      const sw = W / scale, sh = area.h / scale;
      ctx.drawImage(cover, (cover.width - sw) / 2, (cover.height - sh) / 2, sw, sh, 0, 0, W, area.h);
      const fade = ctx.createLinearGradient(0, area.h - 420, 0, area.h);
      fade.addColorStop(0, this.alpha(p.background, 0)); fade.addColorStop(1, p.background);
      ctx.fillStyle = fade; ctx.fillRect(0, area.h - 420, W, 420);
      top = 1000;
    }
    // Thin frame
    ctx.strokeStyle = this.alpha(p.heading, 0.35); ctx.lineWidth = 3; ctx.strokeRect(48, 48, W - 96, H - 96);

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    let y = top;
    ctx.fillStyle = p.heading; ctx.font = `600 30px 'Manrope'`;
    const kicker = data.kicker.toLocaleUpperCase('tr-TR');
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
    for (const line of this.wrap(kicker, W - 260, t => ctx.measureText(t).width, 2)) { ctx.fillText(line, W / 2, y); y += 46; }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    y += 90;

    ctx.font = font.names; ctx.fillStyle = p.heading;
    const nameSize = parseInt(font.names.match(/(\d+)px/)[1], 10);
    for (const line of this.wrap(data.names, W - 200, t => ctx.measureText(t).width, 3)) { ctx.fillText(line, W / 2, y); y += nameSize * 1.1; }
    y += 10;

    // Ornament: line · dot · line
    ctx.strokeStyle = p.heading; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 150, y); ctx.lineTo(W / 2 - 22, y); ctx.moveTo(W / 2 + 22, y); ctx.lineTo(W / 2 + 150, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, y, 7, 0, Math.PI * 2); ctx.fillStyle = p.heading; ctx.fill();
    y += 100;

    ctx.fillStyle = p.text; ctx.font = font.body;
    if (data.date) { ctx.fillText(data.date, W / 2, y); y += 64; }
    if (data.weekdayTime) { ctx.fillText(data.weekdayTime, W / 2, y); y += 64; }
    if (data.place) { y += 10; for (const line of this.wrap(data.place, W - 240, t => ctx.measureText(t).width, 2)) { ctx.fillText(line, W / 2, y); y += 58; } }

    // Footer pill
    ctx.font = `600 32px 'Manrope'`;
    const pill = ctx.measureText(data.footer).width + 96, py = H - 250;
    ctx.fillStyle = p.button_background; this.roundRect(ctx, (W - pill) / 2, py, pill, 92, 46); ctx.fill();
    ctx.fillStyle = p.button_text; ctx.textBaseline = 'middle'; ctx.fillText(data.footer, W / 2, py + 47);
    return canvas;
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  },
  alpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  },
  fileName(names) {
    const slug = String(names || 'davetiye').toLocaleLowerCase('tr-TR').replace(/[çğıöşü]/g, c => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' })[c]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${slug || 'davetiye'}-hikaye.png`;
  },

  // Preview window: share on phones (opens Instagram among the apps), download everywhere.
  async open(inv) {
    const modal = document.getElementById('modal'), content = document.getElementById('modalContent');
    document.querySelector('.modal-card').classList.remove('media-viewer-card');
    content.innerHTML = '<p class="invite-kicker">PAYLAŞIM GÖRSELİ</p><h2>Instagram hikâyesi</h2><p class="story-help">Davetiyenizin isimleri, tarihi, yeri, renkleri ve kapak fotoğrafıyla hazırlanır. Hikâyeye ekledikten sonra Instagram\'ın “Bağlantı” çıkartmasıyla davet bağlantınızı ekleyebilirsiniz; kişiye özel davetiyelerde misafirler kendi bağlantılarıyla açar.</p><div class="story-preview" id="storyPreview" role="status">Görsel hazırlanıyor...</div><div class="story-actions"><button type="button" class="create-btn hidden" id="shareStory">Paylaş</button><a class="ghost-btn" id="downloadStory" download>Görseli indir</a></div>';
    modal.classList.remove('hidden');
    const holder = document.getElementById('storyPreview');
    try {
      const canvas = await this.render({ ...inv, cover_url: inv?.cover_url || window.LumaConfig?.defaultCover || '' });
      const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Görsel oluşturulamadı.')), 'image/png'));
      const url = URL.createObjectURL(blob), name = this.fileName(inv?.name);
      const img = new Image(); img.src = url; img.alt = 'Instagram hikâyesi önizlemesi'; holder.replaceChildren(img);
      const download = document.getElementById('downloadStory'); download.href = url; download.download = name;
      const file = new File([blob], name, { type: 'image/png' });
      const share = document.getElementById('shareStory');
      if (navigator.canShare?.({ files: [file] })) {
        share.classList.remove('hidden');
        share.onclick = () => navigator.share({ files: [file] }).catch(() => {});
      }
    } catch (error) {
      holder.textContent = error.message || 'Görsel oluşturulamadı.';
    }
  }
};
