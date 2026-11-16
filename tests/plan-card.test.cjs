const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../app.html'),'utf8');
const main=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8');

test('settings do not offer a Premium plan that does not exist',()=>{
 const start=app.indexOf('<section class="settings-card plan-settings">'),card=app.slice(start,app.indexOf('</section>',start));
 assert.ok(start>0);
 assert.doesNotMatch(card,/data-plan|Premium|10 GB|Planı Seç/);
 assert.match(card,/ücretsiz/i);
 assert.doesNotMatch(app,/Premium Plan|Free Plan/);
});
test('plan is no longer switched in the browser',()=>{
 assert.doesNotMatch(main,/lumaPlan|data-plan|updatePlanUI/);
});
