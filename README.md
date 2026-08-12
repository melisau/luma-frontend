# Luma Frontend

Statik davetiye arayüzü ve yönetici paneli. API ayrı **luma-backend** reposunda.

## Yapı

```text
frontend/
├── index.html
├── css/styles.css
├── js/
│   ├── config.js
│   ├── config.local.example.js  → config.local.js (gitignore)
│   ├── main.js
│   ├── upload.js
│   ├── gallery.js
│   └── qr.js
├── assets/images/
├── _headers          # Cloudflare Pages
└── _redirects        # SPA yönlendirme (/e/*)
```

## Kurulum

```bash
cp js/config.local.example.js js/config.local.js
```

`config.local.js` içinde backend adresini ayarlayın:

```js
window.__LUMA_API_BASE__ = 'http://127.0.0.1:8000';
```

## Yerel geliştirme

Backend ayrı repoda çalışırken frontend için statik sunucu:

```bash
# Python
python3 -m http.server 5500

# veya npx
npx serve -l 5500
```

Tarayıcı: http://127.0.0.1:5500/

Backend `.env` içinde CORS:

```env
FRONTEND_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
```

## Dağıtım

- **Cloudflare Pages / Netlify**: repo kökünü `frontend/` olarak deploy edin
- `_redirects` dosyası `/e/{token}` rotalarını `index.html`'e yönlendirir
- Production `config.local.js` veya build-time env ile API URL'sini ayarlayın

## Eski monorepo notu

Daha önce backend frontend dosyalarını birlikte servis ediyordu. Ayrı repolarda frontend kendi domain'inde, API `config.local.js` üzerinden backend'e bağlanır.
