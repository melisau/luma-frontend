# Luma Frontend

Statik davetiye arayüzü ve yönetici paneli. API ayrı **luma-backend** reposunda.

## Yerel geliştirme

```bash
cp js/config.local.example.js js/config.local.js
# config.local.js → window.__LUMA_API_BASE__ = 'http://127.0.0.1:8000'

python3 -m http.server 5500
```

Backend `.env`:

```env
FRONTEND_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
```

Tarayıcı: http://127.0.0.1:5500/

## Production deploy (Cloudflare Pages / Netlify)

1. Repo kökü: `frontend/` klasörü
2. Build command (API ayrı domain'deyse):

```bash
chmod +x scripts/write-config.sh
LUMA_API_BASE=https://api.example.com ./scripts/write-config.sh
```

3. `_redirects` — `/e/*` rotaları `index.html`'e yönlendirilir (SPA)
4. Backend `.env`:

```env
FRONTEND_ORIGINS=https://app.example.com
PUBLIC_BASE_URL=https://app.example.com
SERVE_FRONTEND=false
```

5. HTTPS zorunlu (QR ve clipboard API için)

Manuel alternatif: `js/config.production.example.js` → `js/config.production.js` kopyalayıp API URL'sini yazın.

`index.html` sırası: `config.production.js` → `config.local.js` → `config.js` (local, dev'de override eder).

## Monorepo tek port

Backend `SERVE_FRONTEND=true` ile frontend'i `:8000` üzerinden servis eder; ayrı config gerekmez.

## Yönetici paneli

- **Ayarlar → Görünen ad:** Dashboard karşılama metni (`Günaydın, …`)
- **Ayarlar → Aktif etkinlik:** Fotoğraf yükleme aç/kapa, davetiye aktif/pasif
- **Misafirler → Düzenle:** Katılım durumu ve kişi sayısı
- **Galeri / Anı Defteri:** Onayla veya gizle — yalnızca onaylı içerik davetiyede görünür

Hard refresh: **Ctrl+Shift+R** (önbellek temizliği).
