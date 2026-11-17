const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('landing has Open Graph tags and the image exists at 1200x630',()=>{
 for(const file of ['index.html','landing.html']){
  const html=read(file);
  for(const prop of ['og:title','og:description','og:url','og:type'])assert.match(html,new RegExp(`property="${prop}" content="[^"]+"`));
  const image=html.match(/property="og:image" content="https:\/\/luma\.melisauyar\.com\/([^"]+)"/);
  assert.ok(image,'absolute og:image');assert.ok(fs.existsSync(path.join(__dirname,'..',image[1])));
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
 }
 const jpg=fs.readFileSync(path.join(__dirname,'../assets/images/og-luma.jpg'));
 // JPEG SOF0/SOF2 marker holds height then width.
 let i=2;while(i<jpg.length){const marker=jpg[i+1],len=jpg.readUInt16BE(i+2);if(marker===0xC0||marker===0xC2){assert.equal(jpg.readUInt16BE(i+5),630);assert.equal(jpg.readUInt16BE(i+7),1200);break}i+=2+len}
 assert.ok(jpg.length<300*1024,'small enough for link previews');
});
test('sitemap lists the public landing and robots points to it',()=>{
 const sitemap=read('sitemap.xml');
 assert.match(sitemap,/<loc>https:\/\/luma\.melisauyar\.com\/<\/loc>/);
 assert.doesNotMatch(sitemap,/\/e\/|app\.html/);
 assert.match(read('robots.txt'),/^Sitemap: https:\/\/luma\.melisauyar\.com\/sitemap\.xml$/m);
});
