const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function load(extra={}){const context={window:{},URLSearchParams,encodeURIComponent,...extra};vm.runInNewContext(read('js/invite-sender.js'),context);return context.window.LumaInviteSender}
const sender=load();

test('phone numbers become wa.me digits like the server stores them',()=>{
 assert.equal(sender.phoneDigits('0532 123 45 67'),'905321234567');
 assert.equal(sender.phoneDigits('532 123 4567'),'905321234567');
 assert.equal(sender.phoneDigits('+90 (532) 123-45-67'),'905321234567');
 assert.equal(sender.phoneDigits('0049 151 2345678'),'491512345678');
 assert.equal(sender.phoneDigits('+447700900123'),'447700900123');
 assert.equal(sender.phoneDigits(''),'');assert.equal(sender.phoneDigits('12'),'');
});
test('message fills name, event and link; the link is never lost',()=>{
 const text=sender.message(sender.DEFAULT_TEMPLATE,{name:'Ayşe',eventName:'Elif & Deniz',url:'https://x/e/t#g=1.a'});
 assert.match(text,/^Merhaba Ayşe, Elif & Deniz davetiyeniz hazır/);assert.ok(text.includes('https://x/e/t#g=1.a'));assert.ok(!text.includes('{'));
 assert.equal(sender.message('Selam {ad}',{name:'Can',url:'https://l'}),'Selam Can\nhttps://l');
});
test('wa.me link encodes the whole message, with or without a phone',()=>{
 const url=sender.waUrl('+905321234567','Merhaba & hoş geldin\nhttps://a/#g=1.b');
 assert.equal(url,'https://wa.me/905321234567?text='+encodeURIComponent('Merhaba & hoş geldin\nhttps://a/#g=1.b'));
 assert.match(sender.waUrl('','x'),/^https:\/\/wa\.me\/\?text=x$/);
});
test('status: not sent, sent, opened, responded',()=>{
 assert.equal(sender.status({status:'pending'}),'not_sent');
 assert.equal(sender.status({status:'pending',invite_sent_at:'2026-11-17T10:00:00Z'}),'sent');
 assert.equal(sender.status({status:'pending',invite_sent_at:'x',opened_at:'y'}),'opened');
 assert.equal(sender.status({status:'pending',device_count:1}),'opened');
 assert.equal(sender.status({status:'attending'}),'responded');assert.equal(sender.status({status:'declined',opened_at:'y'}),'responded');
 assert.ok(sender.needsReminder({status:'pending',invite_sent_at:'x'}));assert.ok(!sender.needsReminder({status:'pending',opened_at:'y'}));
});
test('template is kept per event and storage errors are ignored',()=>{
 const store={};const storage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}};
 sender.saveTemplate('e1','Selam {ad} {bağlantı}',storage);
 assert.equal(sender.template('e1',storage),'Selam {ad} {bağlantı}');assert.equal(sender.template('e2',storage),sender.DEFAULT_TEMPLATE);
 sender.saveTemplate('e1','',storage);assert.equal(sender.template('e1',storage),sender.DEFAULT_TEMPLATE);
 const broken={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')}};
 assert.equal(sender.template('e1',broken),sender.DEFAULT_TEMPLATE);assert.doesNotThrow(()=>sender.saveTemplate('e1','x',broken));
});
test('send opens the tab first, then points it to WhatsApp and records the sending',async()=>{
 const calls=[];const tab={location:{href:''},close(){calls.push('close')}};
 const s=load({LumaConfig:{apiBase:'',adminAuthHeaders:()=>({})},LumaGuestAccess:{adminLink:async()=>{calls.push('link');return{url:'https://l/#g=1.a'}}},
  fetch:async(url,opts)=>{calls.push(`${opts.method} ${url}`);return{ok:true,json:async()=>({})}}});
 const url=await s.send({id:'g1',name:'Ayşe',phone:'+905321234567'},{eventToken:'tok',eventName:'Düğün',template:'Hi {ad} {bağlantı}',open:()=>{calls.push('open');return tab},refresh:async()=>calls.push('refresh')});
 assert.deepEqual(calls,['open','link','POST /api/admin/events/tok/guests/g1/invite-link/sent','refresh']);
 assert.equal(tab.location.href,url);assert.ok(url.startsWith('https://wa.me/905321234567?text=Hi%20Ay'));
});
test('a failed link closes the empty tab',async()=>{
 const tab={closed:false,location:{},close(){this.closed=true}};
 const s=load({LumaConfig:{apiBase:''},LumaGuestAccess:{adminLink:async()=>{throw new Error('Kişisel bağlantı alınamadı.')}}});
 await assert.rejects(s.send({id:'g'},{eventToken:'t',open:()=>tab}),/alınamadı/);assert.ok(tab.closed);
});
test('guest list and forms are wired up',()=>{
 const app=read('app.html'),main=read('js/main.js');
 assert.ok(app.indexOf('/js/invite-sender.js')<app.indexOf('/js/main.js'));
 for(const id of ['guestPhoneInput','filterUnopenedCount','data-filter="unopened"','class="invite-col hidden">DAVET'])assert.ok(app.includes(id),id);
 for(const needle of ["phone:document.getElementById('guestPhoneInput')",'name="phone"','phone:form.elements.phone.value','data-whatsapp','whatsappPersonalLink','inviteMessageTemplate','function sendInviteWhatsApp'])assert.ok(main.includes(needle),needle);
 const lines=main.split(/\r?\n/);assert.ok(lines.some(l=>l.includes("activeGuestFilter==='unopened'&&LumaInviteSender.needsReminder(g)")));
});
