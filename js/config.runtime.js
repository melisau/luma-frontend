// Local Luma serves the frontend and API together on port 5500.
if (location.port === '5500') window.__LUMA_API_BASE__ = '';
// Cloudflare Pages builds generate this file via scripts/write-config.sh.
