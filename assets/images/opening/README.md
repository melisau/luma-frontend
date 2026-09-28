# İki aşamalı davetiye açılışı — görsel katmanlar

Yerleşik imagegen aracıyla, kullanıcının zarf ve gatefold referansları temel alınarak üretildi. Dosyalar uygulama içinde kullanılır; referans görsellerin tarih ve isimleri içeriğe gömülmedi.

- `gloved-hands.png`: şeffaf zeminde iki ayrı beyaz pamuk eldivenli el, siyah takım elbise ve beyaz manşet. Ortası boş. CSS sol/sağ yarıları ayrı katmanlarda gösterir.
- `forest-envelope.png`: önden bakışlı, dikdörtgeni dolduran mat orman yeşili zarf. İnce kâğıt dokusu, katlanmış üçgen kapak ve doğal gölgeler; mühür, metin ve eller yok.
- `embossed-paper.png`: dikdörtgeni dolduran fildişi el yapımı kâğıt; iki yanda ince kabartmalı çiçek ve yapraklar, ortada sakin doku. Metin, kurdele, mühür ve arka plan yok. CSS bu dokuyu iki ayrı 3B kapağa uygular.
- `satin-bow.png`: şeffaf zeminde mavi saten fiyonk, yatay bant, iki ilmek ve aşağı sarkan iki uç; mühür ve kart yok.

Yukarıdaki tarifler görsel istemlerinin özetidir. İsim, tarih ve mühür motifi DOM üzerinden etkinliğe göre değişir. Zarf ve kâğıt dokuları kullanıcının renkleriyle birleştirilir.

İkinci aşamada kurdele, aynı koordinat sisteminde kesintisiz SVG yüzeyleri olarak çizilir. `satin-texture.png` gerçek kumaş dokusu taşıyan, imagegen ile oluşturulmuş bir malzeme görselidir. SVG pattern ve luminosity karışımı dokuyu kullanıcı rengini koruyarak yüzeylere uygular. Uçlar tek parça kavisler olarak hareket eder; raster görseller uzatılmaz veya maskeyle parçalara bölünmez. Eller serbest uçların hareketini takip eder. Çözülmüş uçlar aynı konumda ilgili 3B kapağa aktarılır. İkinci aşamada mühür veya kırılma efekti yoktur. Bu kontrollü görsel animasyon, fiziksel kumaş simülasyonu değildir.

witch-hands.png: Kullanıcının sağladığı witch_hand.png şeffaf PNG görseli, değiştirilmeden kopyalanmıştır. İkinci açılış aşamasında isteğe bağlı Halloween elleri olarak kullanılır.

stamp.png: Kullanıcının sağladığı şeffaf PNG mühür fotoğrafı, değiştirilmeden kopyalanmıştır. Üzerindeki baş harfler ayrı HTML katmanında gösterilir.
