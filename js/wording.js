// Ready-made invitation wording per event type (original Luma texts). One click fills the
// tagline, the story title and the story text; the owner edits them as they like.
window.LumaWording = {
  TEXTS: {
    wedding: [
      { tagline: 'Hayatımızın en güzel gününe davetlisiniz', title: 'Bir ömre “evet” diyoruz', story: 'Yollarımız kesişti, kalplerimiz aynı yere çıktı. Şimdi bu yolculuğun en güzel durağında, sevdiklerimizi yanımızda görmek istiyoruz. Mutluluğumuzu sizinle paylaşmaktan onur duyarız.' },
      { tagline: 'Sevgiyle başlayan hikâyemize bir sayfa daha', title: 'Bir masal, bir başlangıç', story: 'Yıllar önce başlayan küçük bir hikâye bugün en güzel hâline kavuşuyor. Bu özel günde gülüşünüz, sofrada yeriniz ve dualarınız bizim için çok değerli. Sizi aramızda görmekten mutluluk duyarız.' },
      { tagline: 'Birlikte kutlayalım', title: 'Aileler birleşiyor', story: 'Ailelerimizin hayır duasıyla hayatımızı birleştiriyoruz. Bu mutlu günümüzde sizleri de aramızda görmek, sevincimizi paylaşmak isteriz.' }
    ],
    engagement: [
      { tagline: 'Söz verdik, şimdi kutlama zamanı', title: 'Yüzükler takılıyor', story: 'Kalplerimizin çoktan verdiği sözü, sevdiklerimizin önünde de tazelemek istiyoruz. Nişan törenimizde sizi de aramızda görmek bizi çok mutlu eder.' },
      { tagline: 'İlk adımımıza tanık olun', title: 'Yeni bir başlangıç', story: 'Birlikte atacağımız ilk büyük adımda yanımızda olmanızı isteriz. Gülüşlerle, müzikle ve sevgiyle dolu bir akşamda buluşalım.' },
      { tagline: 'Sevinçle haber veriyoruz', title: 'Nişanlanıyoruz', story: 'Hayatımızın yeni sayfasını açarken bu güzel anı sevdiklerimizle paylaşmak istiyoruz. Varlığınız mutluluğumuzu tamamlayacak.' }
    ],
    nikah: [
      { tagline: 'Nikâhımızda şahidimiz olun', title: 'İmzalar atılıyor', story: 'Hayatımızı resmen birleştireceğimiz bu anlamlı günde sizleri de yanımızda görmek isteriz. Kısa ve samimi törenimize katılımınız bizi çok mutlu eder.' },
      { tagline: 'Sade, samimi ve mutlu', title: 'Bir imza, bir ömür', story: 'Gösterişten uzak, sevdiklerimizle dolu küçük bir törenle evleniyoruz. Bu güzel anda gülümsemenizi aramızda görmek isteriz.' },
      { tagline: 'Mutluluğumuza ortak olun', title: 'Nikâh davetimiz', story: 'Ailelerimizin ve sevdiklerimizin huzurunda hayatımızı birleştiriyoruz. Nikâh törenimizi onurlandırmanızı rica ederiz.' }
    ],
    henna: [
      { tagline: 'Kınamız yakılıyor, türkülerimiz söyleniyor', title: 'Kına gecemize davetlisiniz', story: 'Geleneklerimizi yaşatmak, kınamızı sevdiklerimizle birlikte yakmak istiyoruz. Türküler, eğlence ve bolca kahkahayla dolu gecemizde sizi de aramızda görmek isteriz.' },
      { tagline: 'Bir avuç kına, bir ömür hatıra', title: 'Kına gecesi', story: 'Gelinimizin avucuna yakılacak kınada sizin de dualarınız olsun. Bu özel gecede bize eşlik etmenizden mutluluk duyarız.' },
      { tagline: 'Gelenekle, sevgiyle', title: 'Kınamıza buyurun', story: 'Annelerimizden, ninelerimizden kalan bu güzel geleneği birlikte yaşatalım. Kına gecemizde sizleri de bekliyoruz.' }
    ],
    circumcision: [
      { tagline: 'Şehzademizin mutlu günü', title: 'Sünnet düğünümüze davetlisiniz', story: 'Oğlumuzun bu özel gününde sevincimizi sevdiklerimizle paylaşmak istiyoruz. Eğlencemize katılarak onu mutlu etmenizi rica ederiz.' },
      { tagline: 'Büyüdü, delikanlı oldu', title: 'Mutlu bir gün', story: 'Küçük prensimiz büyüyor. Bu anlamlı günde dualarınızı ve neşenizi aramızda görmek isteriz.' },
      { tagline: 'Sevinçle sizi bekliyoruz', title: 'Sünnet şölenimiz', story: 'Oğlumuzun sünnet düğününde aile ve dostlarımızla bir arada olmak istiyoruz. Varlığınız bizi çok mutlu edecek.' }
    ],
    birthday: [
      { tagline: 'Pastayı birlikte keselim', title: 'Doğum günü partisine davetlisiniz', story: 'Bir yaş daha büyüyoruz ve bunu en sevdiklerimizle kutlamak istiyoruz. Müzik, sürprizler ve bol neşeyle dolu partimizde sizi de görmek isteriz.' },
      { tagline: 'Yeni yaşa merhaba', title: 'Kutlama zamanı', story: 'Mumları üflemeden önce dileklerimizi sevdiklerimizle birlikte tutmak istiyoruz. Bu güzel günü bizimle paylaşır mısınız?' },
      { tagline: 'Eğlence başlıyor', title: 'Parti var!', story: 'Oyunlar, pasta ve kahkahalar hazır; eksik olan bir tek sizsiniz. Doğum günü partimize bekliyoruz.' }
    ],
    baby_shower: [
      { tagline: 'Minik bir mucize yolda', title: 'Baby shower davetimiz', story: 'Ailemize katılacak en küçük üyemizi beklerken bu heyecanı sevdiklerimizle paylaşmak istiyoruz. Tatlı bir buluşmada sizi de aramızda görmek isteriz.' },
      { tagline: 'Kalplerimiz şimdiden onunla dolu', title: 'Bebeğimizi bekliyoruz', story: 'Minik ayak sesleri çok yakında evimizi dolduracak. Bu güzel bekleyişi birlikte kutlamaya ne dersiniz?' },
      { tagline: 'Hoş geldin bebek', title: 'Tatlı bir kutlama', story: 'Hayatımıza girecek bu küçük mucize için dualarınızı ve sevginizi bekliyoruz. Baby shower partimizde buluşalım.' }
    ],
    corporate: [
      { tagline: 'Sizi aramızda görmekten memnuniyet duyarız', title: 'Davetimiz', story: 'Kurumumuzun bu önemli etkinliğinde iş ortaklarımızı, dostlarımızı ve meslektaşlarımızı ağırlamaktan onur duyacağız. Katılımınızı rica ederiz.' },
      { tagline: 'Birlikte daha ileriye', title: 'Lansman davetiyesi', story: 'Yeni projemizi ilk kez sizlerle paylaşacağımız bu buluşmada yerinizi ayırdık. Programa ilişkin ayrıntıları aşağıda bulabilirsiniz.' },
      { tagline: 'Bir yılı birlikte kutluyoruz', title: 'Yıl sonu buluşması', story: 'Birlikte geçirdiğimiz bir yılı, emeği geçen herkesle kutlamak istiyoruz. Keyifli bir akşamda bir araya gelelim.' }
    ],
    other: [
      { tagline: 'Sizi aramızda görmek isteriz', title: 'Bir davetiniz var', story: 'Bu özel günü sevdiklerimizle paylaşmak istiyoruz. Ayrıntılar aşağıda; katılım durumunuzu bildirirseniz hazırlıklarımız kolaylaşır.' },
      { tagline: 'Birlikte kutlayalım', title: 'Buluşuyoruz', story: 'Güzel bir günü birlikte geçirmek için sizi de aramızda görmek isteriz. Lütfen yanıtınızı bize iletin.' }
    ]
  },

  forType(type) { return this.TEXTS[type] || this.TEXTS.other; },

  // Fills the fields; asks first if the owner has already written something there.
  fill(entry, { confirmFn = window.confirm } = {}) {
    const fields = { contentTagline: entry.tagline, contentStoryTitle: entry.title, contentStoryText: entry.story };
    const written = Object.keys(fields).some(id => (document.getElementById(id)?.value || '').trim());
    if (written && !confirmFn('Yazdığınız slogan ve hikâye metninin yerine bu söz yazılsın mı?')) return false;
    for (const [id, value] of Object.entries(fields)) {
      const input = document.getElementById(id); if (!input) continue;
      input.value = value; input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
  },

  init() {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'ghost-btn wording-btn'; button.id = 'openWording';
    button.textContent = '✎ Hazır davetiye sözleri';
    const tagline = document.getElementById('contentTagline')?.closest('.editor-field');
    if (!tagline) return;
    tagline.before(button);
    button.onclick = () => this.open();
  },

  open() {
    const modal = document.getElementById('modal'), content = document.getElementById('modalContent');
    document.querySelector('.modal-card').classList.remove('media-viewer-card');
    const type = document.getElementById('eventTypeSelect')?.value || 'wedding';
    const options = Object.entries(window.LumaLooks?.EVENT_TYPES || { wedding: 'Düğün' }).map(([value, label]) => `<option value="${value}"${value === type ? ' selected' : ''}>${label}</option>`).join('');
    content.innerHTML = `<p class="invite-kicker">HAZIR SÖZLER</p><h2>Davetiye sözleri</h2><p class="wording-help">Birini seçin; slogan, hikâye başlığı ve metni doldurulur. Sonra dilediğiniz gibi değiştirebilirsiniz.</p><label class="editor-field"><span>ETKİNLİK TÜRÜ</span><select id="wordingType">${options}</select></label><div id="wordingList" class="wording-list"></div>`;
    modal.classList.remove('hidden');
    const render = () => {
      const list = document.getElementById('wordingList');
      list.innerHTML = '';
      this.forType(document.getElementById('wordingType').value).forEach(entry => {
        const card = document.createElement('article'); card.className = 'wording-card';
        const small = document.createElement('small'); small.textContent = entry.tagline;
        const title = document.createElement('strong'); title.textContent = entry.title;
        const text = document.createElement('p'); text.textContent = entry.story;
        const use = document.createElement('button'); use.type = 'button'; use.className = 'create-btn'; use.textContent = 'Bu sözü kullan';
        use.onclick = () => { if (this.fill(entry)) { modal.classList.add('hidden'); window.Luma?.toast?.('Söz eklendi. Dilediğiniz gibi düzenleyebilirsiniz.'); } };
        card.append(small, title, text, use); list.append(card);
      });
    };
    document.getElementById('wordingType').onchange = render;
    render();
  }
};
