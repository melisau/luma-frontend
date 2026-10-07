# Luma — Uygulama görevleri

İlk kapsam ve mevcut kod karşılaştırılarak hazırlandı. Bu dosya proje içi görev listesidir.

## Davetiye özelleştirme ilerlemesi (7 Ekim 2026)

**Durum: uygulandı.** Dört adımlı ilerleme, etkinliğin varlığına değil davetiye editöründe kaydedilmiş seçimlere göre hesaplanır. Varsayılan görünüm ve renkler adım kartında açıkça seçilebilir.

`Davetiye özelleştir` ekranının üstünde, mevcut tasarımı kaplamayan ince bir ilerleme çubuğu ve küçük adım listesi göster. Amaç kullanıcıya sıradaki işi hatırlatmak; puan, rozet veya zorunlu bir sihirbaz akışı eklemek değil. Kullanıcı bölümler arasında serbestçe dolaşabilmeli. Tamamlanan adım işaretlenmeli, ilerleme nazik bir animasyonla artmalı ve sonraki eksik adıma tıklanınca ilgili editör alanına gidilmeli.

Önerilen temel adımlar ve tamamlanma ölçütleri:

1. **Davetiye görünümü:** Açılış veya kâğıt görünümü değiştirilip kaydedilmiş ya da kullanıcı adım kartında varsayılan görünümü seçtiğini belirtmiş olmalı.
2. **Davetiye renkleri:** Tema veya renk paleti değiştirilip kaydedilmiş ya da kullanıcı adım kartında mevcut renkleri seçtiğini belirtmiş olmalı.
3. **Tarih ve saat:** Geçerli bir etkinlik tarihi ve saati kaydedilmiş olmalı.
4. **Temel davetiye bilgileri:** Etkinlik/ev sahibi adı ve davetiye için gerekli mekân/konum bilgisi kaydedilmiş olmalı. Slogan, hikâye, müzik, sticker ve sergi fotoğrafları isteğe bağlı kalmalı.

İlerleme **etkinlik bazında** ve **davetiye editöründe kaydedilmiş veriye göre** gösterilir; formda henüz kaydedilmemiş değişiklikler geçici önizleme olarak ayrılır. Tarih ve içerik adımları ancak editörden kaydedilmiş dolu alanlarla tamamlanır. Sayfa yenilendiğinde veya başka cihazda açıldığında ilerleme korunur; tarih veya temel bilgi sonradan boşaltılırsa ilgili adım yeniden eksik görünür.

Görsel yaklaşım: sayfanın başında tek satırlık yüzde/`4 adımdan 2'si tamamlandı` metni, ince çubuk ve kısa adım etiketleri. Tamamlanma durumunu yalnızca renkle anlatma; metin ve ikon da kullan. Dar ekranda etiketler alt alta veya yatay kaydırılabilir biçimde yerleşsin. İlerleme çubuğu mevcut formu, kaydetme düğmesini veya mobil önizlemeyi örtmesin. %100 durumunda kısa bir kutlama mesajı olabilir; mevcut düzenleme akışı açık kalır.

- [x] LUMA-21: Adımların son adlarını ve zorunlu alanlarını netleştir; varsayılan görünüm/renk onayının nasıl verileceğini tasarla.
- [x] LUMA-22: Kaydedilmiş etkinlik verisi ile görünüm/renk onay durumundan ilerlemeyi hesapla ve backend'de etkinlik bazında koru.
- [x] LUMA-23: Hafif ilerleme çubuğunu ve adım bağlantılarını ekle; masaüstü/mobil görünümü doğrula.

## Bu çalışma: temel akış ve eksikler
- [x] LUMA-01: Tarih/saat düzenleyicisindeki tekrar kayıtta saat kaymasını düzelt; farklı saat dilimlerinde test et.
- [x] LUMA-02: Misafir bağlantısını yönetici oturumundan bağımsız yükle; yanlış etkinlik/özel kayıt karışmasını önle.
- [x] LUMA-03: Başarısız/eski veri yüklemelerini ayır; geçersiz davetiyede açıklama ve yeniden deneme göster.
- [x] LUMA-04: RSVP gönderimine sunucu tarafında hız sınırı ekle.
- [x] LUMA-05: Yetkili misafir CSV dışa aktarımı ve panel düğmesi ekle.
- [x] LUMA-06: Tam adres, ulaşım, iletişim ve program alanlarını editör/API/veritabanı/davetiye boyunca bağla.
- [x] LUMA-07: Veritabanı geçişi hatalarını gizlemeyi bırak; doğru bağlantı üzerinde geçişleri çalıştır.
- [x] LUMA-08: İlgili testleri ve gerçek tarayıcı akışını doğrula.

- [x] LUMA-20: Davetiye içi bölüm bağlantılarının etkinlik adresinden çıkmasını düzelt.

## Sonraki geliştirmeler
- [x] LUMA-09: RSVP kimliğini doğrulama: ortak davet linkinde aynı e-postayı bilen kişinin başka yanıtı değiştirmesini önle (misafire özel gizli link veya e-posta doğrulaması).
- [x] LUMA-10: Parola sıfırlama ve e-posta doğrulama; tek kullanımlık, süreli ve yalnızca özeti saklanan bağlantılar ile SMTP/console sağlayıcı katmanı.
- [x] LUMA-11: RSVP e-posta onayı ve henüz yanıt vermeyenlere zamanlanmış hatırlatma görevi.
- [x] LUMA-12: Albüm indirme, yükleme sıkıştırma ve yinelenen fotoğraf kontrolü.
- [x] LUMA-13: Etkinlik erişim kodu, albüm gizlilik seçimi ve açık onayla etkinleştirilen anı saklama/otomatik silme politikası.
- [x] LUMA-14: Misafir grupları, masa planı ve sahip/düzenleyici/görüntüleyen ekip rolleri.
- [x] LUMA-15: Türkçe/İngilizce görünüm, romantik/minimal/kutlama temaları ve planlanmış yayın.

## Yayına çıkış öncesi
- [ ] LUMA-16: Seçilen ücretsiz mimariyi bağla: Koyeb Web Service + Neon PostgreSQL + Cloudflare Pages + özel Cloudflare R2. Docker/Koyeb çalışma ayarı, üretim ortam şablonu ve kurulum rehberi hazır; hesaplar, servis adresleri ve gizli anahtarlar bekleniyor.
- [ ] LUMA-17: Üretim domainini bağla. HTTPS/CORS, güçlü sır ve başlangıç ayarlarını zorunlu doğrulayan kod hazır; gerçek domain bekleniyor.
- [ ] LUMA-18: Canlı PostgreSQL üzerinde geçiş ve yedek geri yükleme provasını yap. Sentry, istek kimliği, PostgreSQL ortak hız sınırı ve yedekleme araçları hazır; bu bilgisayarda Docker/PostgreSQL yok.
- [ ] LUMA-19: Gerçek telefonlarla fotoğraf yükleme, özel misafir bağlantıları ve uçtan uca üretim doğrulaması.

Not: Sonraki geliştirmeler ilk belgedeki gelecek önerilerini de içerir; tamamlanmış kabul edilmez. Yerel testlerin geçmesi, canlı dağıtım veya PostgreSQL doğrulaması anlamına gelmez.

## Doğrulama — 12 Eylül 2026
- Sunucu: 55 pytest testi geçti. CSV yetkilendirme/Unicode/formül kaçışı, alan uzunlukları, UTC dönüşümü, RSVP hız sınırı ve geçiş hatası davranışı dahil.
- Ön yüz: 21 Node testi geçti. İstanbul/New York/UTC tekrar kayıtları, eski yanıt yarışı, yükleme hataları ve açık yönetici oturumunda misafir rotası dahil.
- Tarayıcı: Test hesabından adres/ulaşım/iletişim/program kaydedildi; ayrı misafir bağlantısında 20 Haziran 2027 19:30 ve çok satırlı program doğrulandı. Mühür açılışı ve geçersiz bağlantının yeniden deneme ekranı kontrol edildi.
- Yapılandırma tek ve varsayılan olarak mevcut config.runtime.js dosyasından yükleniyor; eksik opsiyonel dosyaların 404 uyarıları giderildi.

## İkinci uygulama adımı — 12 Eylül 2026
- LUMA-09: İlk RSVP sonrası kişisel düzenleme bağlantısı; aynı tarayıcıda güvenli tekrar gönderim; yönetici için bağlantı oluşturma/yenileme. Eski ve yönetici tarafından eklenen kayıtlar kişisel bağlantı gerektirir. Bu, bağlantıya sahip olma yetkisidir; e-posta doğrulaması değildir.
- LUMA-12: Yöneticiye özel ZIP indirme (200 MB sınırı), EXIF yön düzeltme, en uzun kenarı varsayılan 4096 piksele ölçekleme ve sıkıştırma, aynı etkinlikte yinelenen içerikleri atlama. Depolama hatasında kısmi yüklemeler temizlenir.
- Eski fotoğraflar değiştirilmedi; hash alanı olmayan geçmiş yüklemelerde geriye dönük yinelenen görsel kontrolü yapılmaz. Görsel benzerliği değil, işlenmiş dosya içeriği karşılaştırılır.
- Tarayıcıda ilk RSVP, özel bağlantı makbuzu, aynı misafirin güncellemesi ve panelde yeni notun görünmesi doğrulandı.
- İkinci adım doğrulaması: 63 sunucu ve 24 ön yüz testi geçti; eski verileri koruyan migration testi ve yükleme hatasında dosya temizliği dahil.

## Üçüncü uygulama adımı — 12 Eylül 2026
- Erişim kodu ayarı, kod kaldırma/değiştirme, 12 saatlik HttpOnly erişim oturumu ve kod denemesi hız sınırı eklendi. Davetiye/API/kapak/müzik/RSVP/mesaj/yükleme/görsel uçları korunuyor.
- Albümü yalnızca yöneticiye açma ayarı; misafir liste/orijinal/küçük görsel erişimleri kapatılıyor. Yükleme izni bağımsız. Yönetici ZIP indirmesi açık kalıyor.
- Tam sunucu paketi 67 test geçti; ardından eklenen misafir depolama bağlantısı kontrolüyle gizlilik paketi 5 test geçti. Ön yüz 26 test geçti.
- Bu adımda saklama süresi de tamamlandı: varsayılan kapalı; yeni tarih en az 24 saat sonrası; açık silme onayı gerekli; tarih gelmeden iptal edilebilir.

## Saklama süresi doğrulaması
- Fotoğraf/mesaj erişimi süre sonunda kapanır. API çalışırken saatlik görev aktif fotoğraf nesnelerini, küçük görselleri ve fotoğraf/mesaj kayıtlarını temizler; başarısız dosyaları yeniden dener. Davetiye, kapak/müzik, RSVP ve aktivite kayıtları korunur.
- PostgreSQL kilitleri eşzamanlı görev/yüklemeleri koordine eder; SQLite için tek uygulama süreci kullanılmalı. Canlı PostgreSQL, S3 sürümleme ve yedek yaşam döngüsü doğrulaması LUMA-18 kapsamında bekliyor.
- Tam test sonucu: 71 sunucu + 30 ön yüz testi geçti. Yerel test hesabında erişim kodu ekranından zarf ekranına geçiş doğrulandı. Gerçek etkinlikler için silme tarihi ayarlanmadı.

## Dördüncü uygulama adımı — 12 Eylül 2026
- Serbest ve isteğe bağlı imza; doğum günü gibi tek ev sahipli etkinliklerde tek isim desteği; özelleştirilebilir anı başlığı/açıklaması eklendi.
- Anı alanı için doğum günü, konsept parti, söz/nişan ve zarif kutlama hazır görselleri ile özel görsel yükleme eklendi.
- Misafir grup/masa alanları ve CSV çıktısı; etkinlik sahibi, düzenleyici ve görüntüleyen ekip rolleri eklendi.
- Türkçe/İngilizce davetiye etiketleri, romantik/minimal/kutlama tema seçenekleri ve sunucu tarafında zorlanan planlı yayın eklendi.
- Parola sıfırlama, e-posta doğrulama, RSVP onayı ve otomatik hatırlatma akışları sağlayıcıdan bağımsız olarak tamamlandı. Canlı e-posta için SMTP ve domain DNS kayıtları girilmeli.
- Koyeb Docker çalışma ayarları, Neon/R2 üretim şablonu, üretim başlangıç doğrulaması, istek kimliği/Sentry desteği, ortak PostgreSQL hız sınırı ve yedekleme/geri yükleme araçları eklendi.
- Doğrulama: 74 sunucu ve 30 ön yüz testi geçti. Gerçek tarayıcıda tek isimli imza, özel anı başlığı, doğum günü hazır görsel seçimi, kayıt ve davetiye önizlemesi doğrulandı.

- [x] Etkinliğe özel davetiye renk paleti: 13 seçici, tema varsayılanına dönüş, canlı önizleme, API/veritabanı kaydı ve herkese açık davetiyede uygulama.

- [x] Mühürlü zarf: üst kapağı açılan elsiz zarf → ellerin tuttuğu kurdeleli gatefold → davetiye; yerel GSAP/ScrollTrigger, tıklama ve kaydırma akışı, azaltılmış hareket ve temizleme kontrolleri.
- [x] Fiyonk/kurdele rengi ve HEX seçimi; ikinci aşamada ellerin kartı yanlardan kavraması ve kolların kadraj dışına devam etmesi.
- [x] İkinci aşamada alttan kurdele uçlarını çekme, fiyonk çözülmesi ve kurdele parçalarının bağlı oldukları kapaklarla açılması; ikinci aşamada mühür yok, başlık arka plansız.

## Görsel katmanlar ve kurdele — 28 Eylül 2026
- [x] Kapakta arka plan ve şeffaf ön plan görselleri; ön plan konum/boyut ayarları.
- [x] Alt bölümlerde isteğe bağlı fotoğraflar, açıklamalar ve kemer/oval/Polaroid/altın çerçeveler.
- [x] Kaydırmaya bağlı büyüme, küçülme, sallanma ve paralaks; azaltılmış hareket desteği ve tetikleyici temizliği.
- [x] Etkinliğe ait görsel yükleme, şeffaflık koruyan WebP dönüşümü, erişim kontrolü, verileri koruyan migration.
- [x] Fotoğraf dokulu SVG kurdele yüzeyleri, kesintisiz uç hareketi; ikinci aşamada mühürsüz açılış.
- Doğrulama: 83 sunucu, 30 ön yüz testi; katman kaydetme/yeniden yükleme, çerçeve ve kaydırma hareketi tarayıcıda doğrulandı. Gerçek telefon performansı ayrıca gözden geçirilmeli.

- [x] Ön plan görsellerinde dokuz köşe/kenar/orta hizalaması ve serbest konum; mobil/masaüstünde gerçek görsel sınırlarıyla hizalama ve API kayıt/yeniden okuma doğrulandı.

## Kâğıt ve çerçeve sergisi — 28 Eylül 2026
- [x] İsteğe bağlı düz/kemer/dalgalı/doğal kenarlı/oyuklu bilgi kâğıdı; pamuklu ve çiçek kabartmalı doku, HEX kâğıt/yazı rengi ve alan seçimi.
- [x] Aynı bölümde yan yana fotoğraf sergisi, masaüstü iki/üç ve mobil iki sütun, sergiyi gizleme, bağımsız çerçeve/kaldırma seçenekleri.
- [x] Fotoğraf tabanlı şeffaf Barok altın çerçeve; metinler ve fotoğraflar ayrı dinamik katmanlarda kalır.
- [x] Presentation JSON kaydı ve 0021 migration; varsayılan görünüm ve eski etkinlik verileri korunur.
- Doğrulama: tam sunucu paketi 84, ön yüz 30 test geçti; ardından yeni migration koruma testi ve güncel sunum testleri 2/2 geçti. Mobil/masaüstü tarayıcıda kesimler, grid sütunları, sergiyi gizleme ve kâğıdı kaldırma doğrulandı. Yerel sağlık kontrolü ve 0021 migration doğrulandı.

- [x] Davetiyenin tamamı, iki zarf aşaması ve kapak dışındaki bölümler için görsel arka plan; kapla/tamamını göster/tekrarla seçenekleri ve eski görünüme dönüş.
- [x] İsteğe bağlı yırtık/dalgalı bölüm geçişleri, alan ve HEX renk seçimi; tümüne veya belirli bölüm aralarına uygulama.
- Doğrulama: arka plan hedefleri ve geçiş ayarları API kaydından yeniden okundu; 4 ilgili sunucu testi geçti. Tarayıcıda tüm davetiye/bölüm/iki zarf aşaması arka planları, tekrarlanan kapak dokusu ve arka plan/geçiş temizliği doğrulandı.

- [x] Tam davetiye ve bölüm arka planlarında paralaks için ayrı kırpılan hareket yüzeyi; kapak ve ön planın hareket aralığı artırıldı. Kaydırma başlangıcı ve sonu, davetiyenin gerçek kaydırma alanına göre hesaplanır.

- [x] Tam davetiye arka planının kapakta tekrar uygulanması kaldırıldı; ayrı kapak ataması yoksa kapak ortak yüzeyi gösterir. Tek hareket yüzeyi ve kapak görselinin gizlenmesi tarayıcı kontrolüne eklendi.

- [x] İlk zarf ekranının dış zemin rengi: bağımsız renk seçici/HEX, boş alanla varsayılana dönüş; başlangıçta label/div alanı hatası düzeltildi.
- [x] Şeffaf stickerlar, kapak ve alt bölüm konumları, yüzde 5–100 boyut, altı yön/açılma hareketi ve API kaydı.
- [x] Düzenleyicide canlı mobil yerleşim önizlemesi; kaydedilmemiş görselleri ve konumları yanda gösterme, bölüm takibi, küçük ekranlara kompakt görünüm.

- [x] Masaüstü mobil önizlemesi görsel kontrollerine kaydırıldığında sticky kalır; mobilde doğrudan görsel katman düzenleyicisinin üstüne taşınır. Body yatay overflow ayarının sticky bağlamını bozması düzeltildi.

- [x] Buton köşe yarıçapı: hazır ve özel piksel değerleri, etkinliğe kayıt ve canlı önizleme.
- [x] Etkinlik ek bilgileri: kompakt iki sütun, mobil tek sütun.
- [x] Mobil editör önizlemesinde ilk zarf ve kurdeleli kapak seçimi, canlı renkler.
- [x] Mobil açılışın ekranı tamamen kaplaması ve kısa kaydırma ile aşamaların açılması.

- [x] Çerçeve sergisinde mobilde ve masaüstünde dört görseli aynı satırda gösterme; isteğe bağlı iki sütun ve canlı önizleme.

- [x] Asimetrik fotoğraf sergisi: küçük–büyük / büyük–küçük, mobilde korunan oranlar ve canlı önizleme.

- [x] Halloween cadı elleri: kullanıcı görseli, etkinlik bazında seçim, kurdele açılışı ve canlı mobil önizleme.

- [x] Gerçek stamp.png mührü: orijinal veya baş harfli görünüm, kalp atışı, canlı önizleme ve etkinliğe kayıt.

- [x] Dört hazır Halloween stickerı: düzenlenebilir taslak ve etkinliğe kayıt; kaydırmayla dönme, dönerek kaybolma ve opaklık efektleri.
