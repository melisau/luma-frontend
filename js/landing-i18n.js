(() => {
  'use strict';

  // English is the source HTML; keep its original DOM values for switching back.
  const translations = [
    ['.skip-link', 'İçeriğe geç'],
    ['.site-header nav a[href="#how-it-works"],#mobile-menu a[href="#how-it-works"]', 'Nasıl çalışır'],
    ['.site-header nav a[href="#moments"],#mobile-menu a[href="#moments"]', 'Sana özel'],
    ['.site-header nav a[href="#questions"],#mobile-menu a[href="#questions"]', 'Sorular'],
    ['a[href="/app.html"]', 'Davetiyeni hazırla'],
    ['#hero-title', 'Her kutlama<br>kişisel bir<br><em>dokunuşla başlar.</em>', 'html'],
    ['.hero-copy>p', 'Güzel bir davetiye. Kolay bir katılım yanıtı. Her fotoğraf ve mesaj için tek bir yer. Sevdiklerini Luma ile bir araya getir.'],
    ['.hero-actions .text-link', 'Örnek davetiyeyi gör ', 'firstText'],
    ['.hero-copy small', 'Kendine göre hazırla. Herkesle paylaş.'],
    ['.occasions span:nth-child(1)', 'Düğün'],
    ['.occasions span:nth-child(2)', 'Nişan'],
    ['.occasions span:nth-child(3)', 'Doğum günü'],
    ['.occasions span:nth-child(4)', 'Her güzel an'],
    ['#how-title', 'Biraz sihir. Çok daha az telaş.'],
    ['.steps article:nth-child(1) h3', 'Sana özel olsun'],
    ['.steps article:nth-child(1) p', 'Renklerini seç, fotoğraflarını ekle ve kutlamanı yansıtan bir davetiye hazırla.'],
    ['.steps article:nth-child(2) h3', 'Sevinci paylaş'],
    ['.steps article:nth-child(2) p', 'Tek bir bağlantı gönder. Misafirlerin davetiyeni açıp birkaç dokunuşla katılım bildirsin.'],
    ['.steps article:nth-child(3) h3', 'Hepsini bir arada tut'],
    ['.steps article:nth-child(3) p', 'Yanıtlar, fotoğraflar ve içten mesajlar yönetim panelinde bir arada.'],
    ['#moments-title', 'Senin<br>güzel anın.', 'html'],
    ['.moments-copy>p', 'Büyük bir evetten yeni bir yaşa, her buluşmayı özel kıl.'],
    ['#tab-wedding', 'Düğün'], ['#tab-engagement', 'Nişan'], ['#tab-birthday', 'Doğum günü'], ['#tab-party', 'Parti'],
    ['.moments-copy>small', 'Etkinliğin. Senin renklerin.'],
    ['.preview-open', 'Davetiyeyi aç ', 'firstText'],
    ['#faq-title', 'Merak ettiklerin.', 'html'],
    ['.faq-list details:nth-child(1) summary', 'Davetiyeyi etkinliğime göre düzenleyebilir miyim?', 'firstText'],
    ['.faq-list details:nth-child(1) p', 'Evet. Renkleri, fotoğrafları ve ayrıntıları kutlamana göre seçebilirsin. Her etkinliğin görünümü farklı olabilir.'],
    ['.faq-list details:nth-child(2) summary', 'Misafirlerimin hesap açması gerekiyor mu?', 'firstText'],
    ['.faq-list details:nth-child(2) p', 'Hayır. Misafirlerin paylaştığın bağlantıdan davetiyeyi açabilir, katılım bildirebilir, fotoğraf ve mesaj paylaşabilir.'],
    ['.faq-list details:nth-child(3) summary', 'Fotoğraflar ve mesajlar nerede görünür?', 'firstText'],
    ['.faq-list details:nth-child(3) p', 'Etkinliğinin galerisinde ve anı defterinde bir arada durur. Yönetim panelinden görüntüleyip yönetebilirsin.'],
    ['#closing-title', 'İlk izlenim<br>hep hatırlansın.', 'html'],
    ['.closing>p', 'Kutlaman Luma ile başlasın.'],
    ['.site-footer>p', 'Bizi bir araya getiren anlar için.'],
    ['.site-footer .text-link', 'Yukarı dön ', 'firstText'],
    ['.demo-label', 'Davetlisin'],
    ['#demo-rsvp label[for="demo-name"]', 'Adın'],
    ['#demo-name', 'Adın', 'placeholder'],
    ['#demo-rsvp legend', 'Katılabilecek misin?'],
    ['#demo-rsvp label:has(input[value="yes"])', ' Sevinçle katılıyorum', 'lastText'],
    ['#demo-rsvp label:has(input[value="no"])', ' Katılamayacağım', 'lastText'],
    ['#demo-rsvp button[type="submit"]', 'Yanıtı gönder'],
    ['.demo-note', 'Misafir deneyiminden küçük bir önizleme.<br>Demo yanıtları kaydedilmez veya gönderilmez.', 'html'],
    ['.site-header nav', 'Ana gezinme', 'aria-label'],
    ['#mobile-menu', 'Mobil gezinme', 'aria-label'],
    ['.wordmark', 'Luma ana sayfa', 'aria-label'],
    ['.event-tabs', 'Kutlama türü', 'aria-label'],
    ['.swatches', 'Davetiye rengi', 'aria-label'],
    ['.swatch.forest', 'Orman yeşili', 'aria-label'],
    ['.swatch.sage', 'Adaçayı', 'aria-label'],
    ['.swatch.rose', 'Gül kurusu', 'aria-label'],
    ['.dialog-close', 'Davetiyeyi kapat', 'aria-label'],
    ['.hero-image', 'Krem davetiye, orman yeşili mühür, adaçayı kurdele ve çerçeveli düğün fotoğrafı', 'alt'],
    ['.invitation-preview>img', 'Beyaz çiçekli dokulu davetiye kağıdı, ipek kurdele ve düğün fotoğrafı', 'alt']
  ];

  const nodes = translations.flatMap(([selector, turkish, mode = 'text']) =>
    [...document.querySelectorAll(selector)].map(node => {
      const target = mode === 'firstText' ? node.firstChild : mode === 'lastText' ? node.lastChild : node;
      const get = () => mode === 'html' ? node.innerHTML : mode === 'firstText' || mode === 'lastText' ? target.nodeValue : mode === 'text' ? node.textContent : node.getAttribute(mode);
      const set = value => {
        if (mode === 'html') node.innerHTML = value;
        else if (mode === 'firstText' || mode === 'lastText') target.nodeValue = value;
        else if (mode === 'text') node.textContent = value;
        else node.setAttribute(mode, value);
      };
      const entry = { turkish, english: get(), set };
      return entry;
    })
  );

  const turkishEvents = {
    wedding: { names: 'Elif & Deniz', date: '20 Haziran 2027', intro: 'En sevdiklerimizle birlikte', message: 'Bu güzel günü seninle kutlamak isteriz.' },
    engagement: { names: 'Elif & Deniz', date: '14 Şubat 2027', intro: 'Birlikte yeni bir başlangıç', message: 'Nişan sevincimize ortak ol.' },
    birthday: { names: 'Yeni bir yaş', date: '10 Temmuz 2027', intro: 'Yeni yaş, yeni maceralar', message: 'Pasta, mumlar ve en sevdiklerimiz.' },
    party: { names: 'Yıldızların altında', date: '21 Ağustos 2027', intro: 'Güzel dostlarla güzel bir akşam', message: 'Müzik için gel, anılarla kal.' }
  };
  let language = 'tr';
  try { language = localStorage.getItem('lumaLandingLanguage') || (navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en'); } catch (_) {}
  if (language !== 'tr' && language !== 'en') language = 'tr';
  const title = document.title;
  const description = document.querySelector('meta[name="description"]');
  const englishDescription = description.content;

  function setLanguage(next, persist = true) {
    language = next;
    document.documentElement.lang = language;
    document.title = language === 'tr' ? 'Luma — Her kutlama özel bir davetle başlar' : title;
    description.content = language === 'tr' ? 'Dijital davetiyeni oluştur, katılım yanıtlarını topla; fotoğraf ve mesajları Luma ile bir arada sakla.' : englishDescription;
    nodes.forEach(entry => entry.set(language === 'tr' ? entry.turkish : entry.english));
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    if (persist) { try { localStorage.setItem('lumaLandingLanguage', language); } catch (_) {} }
    window.LumaLandingRefresh?.();
  }

  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  window.LumaLandingI18n = {
    current: () => language,
    events: englishEvents => language === 'tr' ? turkishEvents : englishEvents,
    message: (key, name) => {
      if (language === 'tr') return key === 'required' ? 'Lütfen adını yaz.' : key === 'yes' ? `Teşekkürler ${name}, birlikte kutlamak için sabırsızlanıyoruz!` : `Teşekkürler ${name}, güzel dileklerin bizimle.`;
      return key === 'required' ? 'Please enter your name.' : key === 'yes' ? `Thank you, ${name}. We can’t wait to celebrate with you!` : `Thank you, ${name}. You’ll be with us in spirit.`;
    },
    menuLabel: open => language === 'tr' ? open ? 'Menüyü kapat' : 'Menüyü aç' : open ? 'Close menu' : 'Open menu'
  };
  setLanguage(language, false);
})();
