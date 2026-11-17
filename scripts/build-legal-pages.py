"""Builds gizlilik.html, aydinlatma.html and kosullar.html from the KVKK draft (Nov 2026).

Edit the texts here, then run from the repo root: python scripts/build-legal-pages.py
When the lawyer signs off, remove the draft note and fill the highlighted TODO() parts.
"""
import sys
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
TODO = lambda text: f'<mark class="todo">{text}</mark>'
DATE = TODO("[tarih]")
NAV = [("aydinlatma", "Aydınlatma Metni"), ("gizlilik", "Gizlilik Politikası"), ("kosullar", "Kullanım Koşulları")]


def page(slug, title, description, body):
    nav = "".join(
        f'<a href="/{s}"{" aria-current=\"page\"" if s == slug else ""}>{label}</a>' for s, label in NAV
    )
    return f"""<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} · Luma Event</title>
  <meta name="description" content="{description}" />
  <link rel="stylesheet" href="/css/legal.css?v=2" />
</head>
<body>
  <header class="legal-top">
    <a class="legal-brand" href="/">Luma</a>
    <nav aria-label="Yasal metinler">{nav}</nav>
  </header>
  <main class="legal">
    <p class="draft-note" id="draftNote">Taslak: bu metin avukat kontrolündedir ve kesinleşmemiştir. Sarı işaretli yerler henüz doldurulmadı.</p>
    <h1>{title}</h1>
    <p class="updated">Son güncelleme: {DATE}</p>
{body}
  </main>
  <footer class="legal-footer">
    <a href="/gizlilik">Gizlilik</a> · <a href="/aydinlatma">Aydınlatma Metni</a> · <a href="/kosullar">Kullanım Koşulları</a> · İletişim: <a href="mailto:kvkk@melisauyar.com">kvkk@melisauyar.com</a>
  </footer>
</body>
</html>
"""


def table(head, rows):
    th = "".join(f"<th scope=\"col\">{h}</th>" for h in head)
    trs = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in rows)
    wide = ' class="wide"' if len(head) >= 4 else ''
    return f'    <div class="table-wrap"><table{wide}><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div>'


def ul(items):
    return "    <ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


aydinlatma = "\n".join([
    "    <p>Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun (\"KVKK\") 10. maddesi uyarınca, Luma Event'i (luma.melisauyar.com) kullananları kişisel verilerinin nasıl işlendiği hakkında bilgilendirmek için hazırlanmıştır.</p>",
    '    <h2 id="veri-sorumlusu">1. Veri sorumlusu</h2>',
    f"    <p>Melisa Uyar (gerçek kişi), Muslihittin Mahallesi, Rıfat Ayaydın Cad. No: {TODO('[kapı no]')}, 48000 Menteşe/Muğla. İletişim: <a href=\"mailto:kvkk@melisauyar.com\">kvkk@melisauyar.com</a></p>",
    "    <h3>Kim hangi veriden sorumlu?</h3>",
    ul([
        "Etkinlik sahiplerinin hesap verileri (ad, e-posta, şifre) için veri sorumlusu Melisa Uyar'dır.",
        "Misafir verileri (misafir listesi, katılım yanıtları, beslenme tercihi, fotoğraflar, anı defteri mesajları) için veri sorumlusu, o davetiyeyi oluşturan etkinlik sahibidir. Luma Event bu verileri yalnızca etkinlik sahibi adına, onun talimatıyla ve davetiye hizmetini sunmak için işleyen veri işleyendir.",
    ]),
    '    <h2 id="veriler">2. Hangi verileri, neden işliyoruz?</h2>',
    table(["Kimin verisi", "Hangi veriler", "Ne için", "Hukuki sebep (KVKK m.5/2)"], [
        ["Etkinlik sahibi (hesap açan)", "Ad, e-posta, şifrenin geri döndürülemez özeti, Kullanım Koşulları'nı kabul ettiği tarih", "Hesap açmak, giriş, e-posta doğrulama, şifre sıfırlama", "Sözleşmenin kurulması ve ifası (c)"],
        ["Etkinlik sahibi", "Etkinlik bilgileri, davetiye içeriği, yüklediği kapak görseli ve müzik", "Davetiyeyi oluşturmak ve misafirlere göstermek", "Sözleşmenin ifası (c)"],
        ["Misafir", "Ad, e-posta, kişi sayısı, katılım durumu, grup ve masa bilgisi, notlar", "Davetiyeyi iletmek, katılım yanıtını kaydetmek, onay ve hatırlatma e-postası göndermek", "Etkinlik sahibiyle kurulan sözleşmenin ifası (c) ve ilgili kişinin kendisinin paylaşması"],
        ["Misafir", "Beslenme tercihi veya alerji (isteğe bağlı) ve açık rızanın verildiği tarih", "Etkinlik sahibinin yemek planlaması", "Açık rıza (sağlık veya din bilgisi içerebildiği için, m.6)"],
        ["Misafir", "Yüklediği fotoğraflar, fotoğraf notu, anı defteri mesajları, verdiği isim", "Etkinliğin anılarını etkinlik sahibiyle paylaşmak", "İlgili kişinin kendisinin paylaşması ve sözleşmenin ifası (c)"],
        ["Herkes", "IP adresi, istek kayıtları (log), hata kayıtları", "Güvenlik, kötüye kullanımı önleme (deneme sayısı sınırları), hata ayıklama", "Meşru menfaat (f) ve hukuki yükümlülük (ç, 5651 sayılı Kanun)"],
    ]),
    "    <p>Fotoğraflarda başka kişiler de görünebilir. Fotoğraf yükleyen misafir, fotoğraftaki kişilerin paylaşıma itirazı olmadığını gözetmekle sorumludur.</p>",
    "    <p>Tablodaki misafir verileri etkinlik sahibi adına işlenir. Bu veriler için işleme amacını ve hukuki sebebi belirlemek, veri sorumlusu olarak etkinlik sahibine aittir; yukarıdaki hukuki sebepler Luma Event'in hizmeti nasıl sunduğunu gösterir.</p>",
    '    <h2 id="toplama">3. Verileri nasıl topluyoruz?</h2>',
    "    <p>Veriler, kayıt, davetiye düzenleme, katılım yanıtı, fotoğraf yükleme ve anı defteri formları aracılığıyla elektronik ortamda, doğrudan sizden veya etkinlik sahibinden (misafir listesi) toplanır. Misafir bilgileri etkinlik sahibi tarafından da girilebilir.</p>",
    '    <h2 id="aktarim">4. Verileri kimlere aktarıyoruz?</h2>',
    ul([
        "<strong>Etkinlik sahibi:</strong> Misafirlerin katılım yanıtları, fotoğrafları ve mesajları etkinliğin sahibine ve sahibinin ekip olarak eklediği kişilere görünür.",
        "<strong>Diğer misafirler:</strong> Etkinlik sahibi onayladığı fotoğraf ve mesajları aynı davetiyenin diğer misafirleriyle paylaşmayı seçebilir.",
        "<strong>Hizmet sağlayıcılar:</strong> Sunucu hizmeti Keyubu İnternet ve Bilişim Tic. Ltd. Şti. (Türkiye) tarafından sağlanır; veriler bu sunucuda tutulur. E-postalar Brevo SAS (Fransa) aracılığıyla gönderilir; Brevo'ya yalnızca alıcı e-posta adresi ve e-postanın içeriği aktarılır. Veritabanı yedeklerinin ve fotoğrafların bir kopyası, sunucu arızasına karşı Backblaze, Inc. (ABD) depolama hizmetinde tutulur. Sitede oluşan teknik hataların kayıtları Functional Software, Inc. (Sentry, ABD şirketi; veriler Almanya'daki sunucularda) hizmetine gönderilir; bu kayıtlara IP adresi ve form içerikleri eklenmez.",
        "<strong>Yetkili kurumlar:</strong> Kanunen zorunlu olduğunda yetkili kamu kurum ve kuruluşlarına.",
    ]),
    f"    <p>Brevo, Backblaze ve Sentry'ye yapılan aktarımlar yurt dışı aktarımdır ve KVKK m.9 kapsamında {TODO('[standart sözleşme / diğer güvence: avukatla netleştirilecek]')} ile yapılır.</p>",
    '    <h2 id="haklar">5. Haklarınız (KVKK m.11)</h2>',
    "    <p>Veri sorumlusuna başvurarak şunları isteyebilirsiniz: verilerinizin işlenip işlenmediğini öğrenmek; işlendiyse bilgi istemek; işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenmek; yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilmek; eksik veya yanlış işlenmişse düzeltilmesini istemek; KVKK m.7 çerçevesinde silinmesini veya yok edilmesini istemek; düzeltme ve silme işlemlerinin aktarılan kişilere bildirilmesini istemek; yalnızca otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etmek; kanuna aykırı işleme nedeniyle zarara uğrarsanız zararın giderilmesini talep etmek.</p>",
    "    <p>Başvurularınızı <a href=\"mailto:kvkk@melisauyar.com\">kvkk@melisauyar.com</a> adresine veya yukarıdaki posta adresine yazılı olarak iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.</p>",
    "    <p>Etkinlik sahibiyseniz, panelde Ayarlar → Verilerimi indir ile hesabınıza ait tüm verileri tek dosya olarak hemen indirebilir, Ayarlar → Hesabımı sil ile hesabınızı ve tüm etkinliklerinizi kalıcı olarak silebilirsiniz.</p>",
    "    <p>Bir etkinliğin misafiriyseniz, misafir bilgileriniz, yanıtlarınız, fotoğraflarınız ve mesajlarınız için başvurunuzu veri sorumlusu olan etkinlik sahibine yapmalısınız. Bize ulaşan misafir başvurularını gecikmeden ilgili etkinlik sahibine iletir ve talebi yerine getirebilmesi için ona teknik destek veririz.</p>",
])

gizlilik = "\n".join([
    "    <p>Luma Event, düğün, nişan, doğum günü gibi etkinlikler için dijital davetiye ve misafir yönetimi sunar. Bu politika, verilerinizi ne kadar süre sakladığımızı, nasıl koruduğumuzu ve hangi tarayıcı depolama araçlarını kullandığımızı açıklar. Hangi verileri neden işlediğimiz ve haklarınız <a href=\"/aydinlatma\">Aydınlatma Metni</a>'nde yer alır.</p>",
    '    <h2 id="saklama">1. Verileri ne kadar saklarız?</h2>',
    table(["Veri", "Saklama süresi"], [
        ["Hesap bilgileri (ad, e-posta)", "Hesap açık kaldığı sürece. Hesabınızı Ayarlar → Hesabımı sil ile sildiğinizde hemen silinir; e-postayla istediğinizde " + TODO("[30]") + " gün içinde silinir."],
        ["Etkinlik ve misafir listesi", "Etkinlik sahibi etkinliği silene kadar. Etkinlik silinince misafir bilgileri, yanıtlar, fotoğraflar ve mesajlar da silinir."],
        ["Beslenme bilgisi", "Misafir alanı boşaltana veya etkinlik silinene kadar. Alan boşaltılınca bilgi ve rıza kaydı silinir."],
        ["Fotoğraflar ve anı defteri mesajları", "Etkinlik sahibinin seçtiği saklama süresi dolunca otomatik silinir. Süre seçilmemişse etkinlik silinene kadar saklanır."],
        ["Tek kullanımlık e-posta bağlantıları (doğrulama, şifre sıfırlama)", "30 dakika ile 24 saat arasında geçerlidir; kullanıldıktan sonra geçersiz olur."],
        ["Deneme sayısı sınırı kayıtları (IP adresi)", "En fazla 1 saat."],
        ["Sunucu istek kayıtları (log)", TODO("[Süre: avukatla netleştirilecek, 5651 sayılı Kanun]")],
        ["Hata kayıtları (Sentry)", TODO("[90 gün: Sentry ayarıyla netleştirilecek]")],
        ["Veritabanı ve fotoğraf yedekleri", "14 gün. Silinen veriler sunucudaki ve sunucu dışındaki yedeklerden en geç 14 gün içinde kalkar."],
    ]),
    '    <h2 id="koruma">2. Verilerinizi nasıl koruyoruz?</h2>',
    ul([
        "Site yalnızca şifreli bağlantıyla (HTTPS) çalışır.",
        "Şifreler okunabilir halde saklanmaz; yalnızca geri döndürülemez özetleri tutulur.",
        "Fotoğraflar herkese açık bir klasörde değil, özel bir depolama alanında tutulur ve yalnızca birkaç dakika geçerli imzalı bağlantılarla açılır.",
        "Davetiyeler tahmin edilemeyen kişiye özel bağlantılarla açılır. Etkinlik sahibi ayrıca bir erişim kodu belirleyebilir.",
        "Giriş, kayıt, katılım yanıtı ve yükleme işlemlerinde deneme sayısı sınırlanır.",
        "Sunucu Türkiye'dedir (İstanbul). Her gece yedek alınır ve yedeklerin bir kopyası sunucu dışında saklanır.",
        "Davetiye sayfaları ve fotoğraflar arama motorlarına kapalıdır.",
    ]),
    '    <h2 id="cerezler">3. Çerezler ve tarayıcı depolaması</h2>',
    "    <p>Luma Event reklam, analiz veya takip çerezi kullanmaz. Yalnızca sitenin çalışması için zorunlu olan şu araçlar kullanılır; bunlar için onayınızı istemiyoruz:</p>",
    table(["Araç", "Ne için", "Ne kadar kalır"], [
        ["Erişim kodu çerezi (luma_access_…)", "Erişim kodu olan bir davetiyede kodu tekrar sormamak", "12 saat"],
        ["Oturum depolaması (sessionStorage)", "Etkinlik sahibinin giriş oturumu", "Tarayıcı sekmesi kapanınca silinir"],
        ["Yerel depolama (localStorage)", "Dil ve görünüm tercihleri, misafirin kendi yanıtını düzenleyebilmesi", "Siz silene kadar"],
    ]),
    "    <p>Sayfaların yazı tipleri kendi sunucumuzdan yüklenir; yazı tipi için Google Fonts gibi dış bir hizmete istek gönderilmez.</p>",
    '    <h2 id="cocuklar">4. Çocuklar</h2>',
    "    <p>Hesap açmak için 18 yaşını doldurmuş olmak gerekir. Misafirlerin yüklediği fotoğraflarda çocuklar yer alabilir; bu fotoğrafları paylaşırken velilerinin rızasını gözetmenizi rica ederiz. Bir fotoğrafın kaldırılmasını etkinlik sahibinden veya bizden isteyebilirsiniz.</p>",
    '    <h2 id="degisiklikler">5. Bu politikadaki değişiklikler</h2>',
    "    <p>Politikayı değiştirdiğimizde bu sayfadaki \"Son güncelleme\" tarihini yeniler, önemli değişiklikleri hesap sahiplerine e-postayla bildiririz.</p>",
    '    <h2 id="iletisim">6. İletişim</h2>',
    "    <p>Sorularınız ve talepleriniz için: <a href=\"mailto:kvkk@melisauyar.com\">kvkk@melisauyar.com</a>.</p>",
])

kosullar = "\n".join([
    "    <p>Bu koşullar, Luma Event'te (luma.melisauyar.com) hesap açan ve etkinlik oluşturan kişiler (\"etkinlik sahibi\") ile hizmeti sunan Melisa Uyar (\"Luma Event\") arasındaki ilişkiyi düzenler. Hesap açarak bu koşulları kabul etmiş olursunuz.</p>",
    '    <h2 id="hizmet">1. Hizmet</h2>',
    "    <p>Luma Event; dijital davetiye tasarlama, misafir listesi ve katılım yanıtlarını yönetme, misafirlerden fotoğraf ve mesaj toplama imkânı sunar. Hizmet şu an ücretsizdir. İleride yeni özellikler veya ücretli planlar eklenebilir. Böyle bir değişiklik madde 8'deki gibi önceden bildirilir; onayınız olmadan sizden hiçbir ücret alınmaz.</p>",
    '    <h2 id="hesap">2. Hesap</h2>',
    ul([
        "Hesap açmak için 18 yaşını doldurmuş olmanız ve gerçek bir e-posta adresi kullanmanız gerekir. E-posta adresinizi doğrulamadan davetiyeniz misafirlere açılmaz.",
        "Şifrenizin güvenliğinden siz sorumlusunuz. Hesabınızın izinsiz kullanıldığını fark ederseniz bize hemen bildirin.",
        "Etkinliğinize ekip arkadaşı eklediğinizde, onların verdiği yetkiyle yaptığı işlemlerden de siz sorumlu olursunuz.",
    ]),
    '    <h2 id="misafir-verileri">3. Misafir verileri konusunda sizin sorumluluğunuz</h2>',
    "    <p>Misafir listesine eklediğiniz kişilerin ad ve e-posta bilgilerini siz sağlarsınız. Bu nedenle:</p>",
    ul([
        "Yalnızca gerçekten davet ettiğiniz kişileri listeye ekleyin.",
        "Misafirlerinize bilgilerinin Luma Event aracılığıyla davetiye ve hatırlatma göndermek için kullanılacağını bildirin.",
        "Misafirlerin beslenme bilgisini panelden kendiniz girecekseniz, bunu yalnızca misafirin açık rızasıyla yapın.",
        "Misafirlerin fotoğraflarını, mesajlarını ve yanıtlarını yalnızca etkinliğinizle ilgili amaçlarla kullanın; reklam veya ticari amaçla kullanmayın, üçüncü kişilere satmayın.",
        "Bir misafir verisinin silinmesini isterse, kaydını silin veya bize iletin.",
    ]),
    "    <p><strong>Veri işleme:</strong> Misafir verileri için veri sorumlusu sizsiniz; Luma Event ise bu verileri sizin adınıza işleyen veri işleyendir (KVKK m.3 ve m.12). Buna göre Luma Event:</p>",
    ul([
        "Misafir verilerini yalnızca davetiye hizmetini sunmak ve sizin talimatlarınız (örneğin misafir eklemek, hatırlatma göndermek, fotoğraf onaylamak) doğrultusunda işler; kendi amacı için kullanmaz, satmaz, reklam için kullanmaz.",
        "Verileri yetkisiz erişime karşı korumak için gerekli teknik ve idari tedbirleri alır (<a href=\"/gizlilik#koruma\">Gizlilik Politikası, bölüm 2</a>).",
        "Hizmet için yalnızca şu yardımcı sağlayıcıları kullanır: Keyubu İnternet ve Bilişim Tic. Ltd. Şti. (sunucu, Türkiye), Brevo SAS (e-posta gönderimi, Fransa), Backblaze, Inc. (sunucu dışı yedek, ABD) ve Functional Software, Inc. (Sentry, hata kayıtları, ABD şirketi, veriler Almanya'da). Bu listeyi değiştirmeden önce size bildirir.",
        "Bir misafirin başvurusunu yanıtlamanız için size yardımcı olur; misafirden gelen başvuruları size iletir.",
        "Verilere yetkisiz erişildiğini fark ederse size gecikmeden bildirir.",
        "Etkinliği veya hesabınızı sildiğinizde misafir verilerini siler; yedeklerden en geç 14 gün içinde kalkar.",
    ]),
    '    <h2 id="yasaklar">4. Yasak kullanımlar</h2>',
    "    <p>Luma Event'i şu amaçlarla kullanamazsınız:</p>",
    ul([
        "Toplu reklam, pazarlama veya istenmeyen e-posta (spam) göndermek",
        "Yasa dışı, hakaret içeren, nefret söylemi veya çocukları istismar eden içerik yüklemek",
        "Başkasının telif hakkı veya kişilik hakkı olan içeriği izinsiz yüklemek",
        "Başka bir kişi veya kurum adına sahte davetiye oluşturmak, dolandırıcılık yapmak",
        "Sistemin güvenliğini aşmaya, aşırı yük bindirmeye veya otomatik araçlarla hesap açmaya çalışmak",
    ]),
    "    <p>Bu kurallara uyulmadığını tespit edersek ilgili içeriği kaldırabilir, etkinliği yayından çıkarabilir veya hesabı kapatabiliriz.</p>",
    '    <h2 id="icerik">5. İçerik</h2>',
    "    <p>Yüklediğiniz davetiye içeriği, görseller ve müzik size aittir veya bunları kullanma hakkınızın olduğunu kabul edersiniz. Luma Event bu içerikleri yalnızca hizmeti sunmak için (saklamak, küçültmek, misafirlere göstermek) kullanır; başka bir amaçla kullanmaz.</p>",
    '    <h2 id="kapatma">6. Hesabın kapatılması</h2>',
    "    <p>Hesabınızı istediğiniz zaman kapatabilirsiniz: panelde Ayarlar → Hesabımı sil bölümünü kullanın (şifrenizi ve onayınızı ister, geri alınamaz) ya da <a href=\"mailto:kvkk@melisauyar.com\">kvkk@melisauyar.com</a> adresine yazın. Hesap kapatılınca etkinlikleriniz ve bunlara ait misafir verileri, fotoğraflar ve mesajlar silinir. Silmeden önce fotoğrafları ZIP olarak indirmeniz önerilir.</p>",
    '    <h2 id="sorumluluk">7. Sorumluluğun sınırları</h2>',
    "    <p>Hizmeti özenle ve mümkün olduğunca kesintisiz sunmak için makul çabayı gösteririz. Bakım, arıza veya üçüncü taraf hizmet sağlayıcılarından kaynaklanan kısa kesintiler olabilir; önemli fotoğraflarınızın bir kopyasını ayrıca saklamanızı öneririz.</p>",
    ul([
        "Kastımız veya ağır kusurumuzdan doğan zararlardan ve hayat, beden veya sağlığa verilen zararlardan sorumluluğumuz sınırlandırılmaz.",
        "Kanunun izin verdiği ölçüde, hafif kusurla verilen dolaylı zararlardan (örneğin kazanç kaybı) sorumlu değiliz.",
        "Bu madde, tüketici mevzuatından veya kanunun diğer emredici hükümlerinden doğan haklarınızı kısıtlamaz.",
    ]),
    '    <h2 id="degisiklikler">8. Değişiklikler ve uygulanacak hukuk</h2>',
    f"    <p>Bu koşulları değiştirmemiz gerekirse, değişikliği yürürlüğe girmeden en az {TODO('[30]')} gün önce hesap sahiplerine e-postayla bildirir ve panelde yeni metni onayınıza sunarız. Yeni koşulları kabul etmezseniz, verilerinizi indirip hesabınızı kapatabilirsiniz; bu durumda yeni koşullar size uygulanmaz. Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. {TODO('[Yetkili mahkeme ve icra daireleri: avukatla netleştirilecek; tüketiciler için tüketici hakem heyetleri ve tüketici mahkemeleri saklıdır.]')}</p>",
])

pages = {
    "aydinlatma": ("Aydınlatma Metni", "Luma Event kişisel verilerin işlenmesine ilişkin aydınlatma metni (KVKK m.10).", aydinlatma),
    "gizlilik": ("Gizlilik Politikası", "Luma Event verileri ne kadar saklar, nasıl korur ve hangi tarayıcı depolamasını kullanır.", gizlilik),
    "kosullar": ("Kullanım Koşulları", "Luma Event etkinlik sahipleri için kullanım koşulları.", kosullar),
}
for slug, (title, description, body) in pages.items():
    (OUT / f"{slug}.html").write_text(page(slug, title, description, body), encoding="utf-8", newline="\n")
    print("wrote", slug)
