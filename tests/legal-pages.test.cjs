const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const main=read('js/main.js'),app=read('app.html');

for(const slug of ['gizlilik','aydinlatma','kosullar']){
 test(`/${slug} page exists, links the others and names the contact`,()=>{
  const html=read(`${slug}.html`);
  assert.match(html,/<html lang="tr">/);
  assert.match(html,/kvkk@melisauyar\.com/);
  for(const other of ['gizlilik','aydinlatma','kosullar'])assert.match(html,new RegExp(`href="/${other}"`));
  assert.match(html,/name="viewport"/);
 });
}
test('legal texts are marked as drafts until the lawyer signs off',()=>{
 for(const slug of ['gizlilik','aydinlatma','kosullar'])assert.match(read(`${slug}.html`),/id="draftNote"/);
});
test('every page has the legal links in its footer',()=>{
 for(const file of ['index.html','landing.html'])assert.match(read(file),/class="legal-links"[^>]*>.*href="\/gizlilik".*href="\/aydinlatma".*href="\/kosullar"/s);
 const footer=app.slice(app.indexOf('<footer class="invite-footer"'),app.indexOf('</footer>',app.indexOf('<footer class="invite-footer"')));
 assert.match(footer,/href="\/aydinlatma"/);
 assert.match(app,/sidebar-legal/);
});
test('sign-up requires the terms box and sends the acceptance',()=>{
 assert.match(app,/id="authTermsWrap" class="auth-terms hidden"><input id="authTerms" type="checkbox">/);
 assert.match(app,/href="\/kosullar"[^>]*>Kullanım Koşulları<\/a>'nı okudum ve kabul ediyorum/);
 assert.match(main,/accept_terms:true/);
 assert.match(main,/isRegister&&!document\.getElementById\('authTerms'\)\.checked/);
});
test('RSVP, photo upload and guestbook show the short notices',()=>{
 const templates=main.slice(main.indexOf('const modalTemplates='),main.indexOf('};',main.indexOf('const modalTemplates=')));
 assert.match(templates,/Yanıtınız ve bilgileriniz bu etkinliğin sahibiyle paylaşılır/);
 assert.match(templates,/Yüklediğiniz fotoğraflar etkinlik sahibine iletilir/);
 assert.match(templates,/Mesajınız ve adınız etkinlik sahibine iletilir/);
 assert.match(read('js/dietary-consent.js'),/href="\/aydinlatma"/);
});
