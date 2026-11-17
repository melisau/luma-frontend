const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('no page loads anything from Google Fonts',()=>{
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html')))assert.doesNotMatch(read(file),/fonts\.(googleapis|gstatic)\.com/,file);
 assert.doesNotMatch(read('_headers'),/googleapis|gstatic/);
});
test('pages that use the brand fonts load the local fonts.css',()=>{
 for(const file of ['app.html','index.html','landing.html'])assert.match(read(file),/href="\/css\/fonts\.css\?v=\d+"/,file);
});
test('every font file named in fonts.css exists and is woff2, with Turkish letters covered',()=>{
 const css=read('css/fonts.css');
 const files=[...css.matchAll(/url\(\/assets\/fonts\/([^)]+)\)/g)].map(m=>m[1]);
 assert.ok(files.length>=6);
 for(const file of new Set(files)){const data=fs.readFileSync(path.join(root,'assets/fonts',file));assert.equal(data.subarray(0,4).toString('latin1'),'wOF2',file)}
 // ğ (U+011F), ş (U+015F), ı (U+0131) live in latin-ext.
 for(const family of ['Cormorant Garamond','Manrope']){
  const ranges=[...css.matchAll(new RegExp(`font-family:'${family}'[^}]*unicode-range:([^}]+)}`,'g'))].map(m=>m[1]).join(',');
  for(const cp of [0x11F,0x15F,0x131])assert.ok(ranges.split(',').some(r=>{const m=r.trim().match(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/i);if(!m)return false;const a=parseInt(m[1],16),b=m[2]?parseInt(m[2],16):a;return cp>=a&&cp<=b}),`${family} U+${cp.toString(16)}`);
 }
});
