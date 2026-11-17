const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../js/guest-access.js'),'utf8');
function load(responses){
 const calls=[];
 const context={window:{},URLSearchParams,JSON,LumaConfig:{apiBase:'',inviteUrl:t=>`https://x/e/${t}`,adminAuthHeaders:()=>({Authorization:'Bearer a'})},
  fetch:async(url,options)=>{calls.push({url,options,body:options.body&&JSON.parse(options.body)});const r=responses.shift();return {ok:r.status<300,status:r.status,json:async()=>r.body}}};
 vm.runInNewContext(source,context);return {access:context.window.LumaGuestAccess,calls};
}
function place(hash){const replaced=[];return {location:{hash,pathname:'/e/T',search:''},history:{replaceState:(a,b,url)=>replaced.push(url)},replaced}}

test('personal link is exchanged for a device session and removed from the address bar',async()=>{
 const {access,calls}=load([{status:200,body:{mode:'personal',guest:{name:'Ayşe',email:'a@x.com',people:2}}}]);
 const p=place('#g=gid.tok');
 const result=await access.prepare('T',p.location,p.history);
 assert.equal(result.ok,true);
 assert.equal(calls[0].url,'/api/events/T/guest-session');
 assert.deepEqual({...calls[0].body},{guest_id:'gid',token:'tok'});
 assert.deepEqual([...p.replaced],['/e/T']);
 assert.equal(access.guest.email,'a@x.com');
});
test('a further device is asked for the e-mail code and the link stays for the retry',async()=>{
 const {access,calls}=load([{status:403,body:{code_required:true,email_hint:'a***@x***.com',detail:'Kod gerekli.'}},{status:200,body:{mode:'personal',guest:{name:'A'}}}]);
 const p=place('#g=gid.tok');
 const result=await access.prepare('T',p.location,p.history);
 assert.equal(result.codeRequired,true);assert.equal(result.emailHint,'a***@x***.com');
 assert.deepEqual([...p.replaced],[]);
 const ok=await access.open('T',access.link,'123456');
 assert.equal(ok.ok,true);assert.equal(calls[1].body.code,'123456');
});
test('venue QR key opens an upload session',async()=>{
 const {access,calls}=load([{status:200,body:{mode:'upload'}}]);
 const p=place('#k=KEY');
 assert.equal((await access.prepare('T',p.location,p.history)).ok,true);
 assert.equal(calls[0].url,'/api/events/T/upload-session');assert.equal(calls[0].body.key,'KEY');
 assert.equal(access.uploadOnly,true);assert.deepEqual([...p.replaced],['/e/T']);
});
test('no link: nothing to do; refused link: error shown',async()=>{
 const none=load([]);assert.equal((await none.access.prepare('T',place('').location,place('').history)).ok,true);assert.equal(none.calls.length,0);
 const bad=load([{status:403,body:{detail:'Bu bağlantı geçersiz ya da yenilenmiş.'}}]);
 const r=await bad.access.prepare('T',place('#g=a.b').location,place('#g=a.b').history);
 assert.match(r.error,/geçersiz/);
});
test('owner gets the full personal link',async()=>{
 const {access,calls}=load([{status:200,body:{fragment:'g=gid.tok',device_count:1,device_allowance:2}}]);
 const link=await access.adminLink('T','gid');
 assert.equal(link.url,'https://x/e/T#g=gid.tok');assert.equal(calls[0].options.method,'GET');
});
test('invitation, panel and QR are wired to personal links',()=>{
 const main=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8'),app=fs.readFileSync(path.join(__dirname,'../app.html'),'utf8'),data=fs.readFileSync(path.join(__dirname,'../js/event-data.js'),'utf8'),config=fs.readFileSync(path.join(__dirname,'../js/config.js'),'utf8');
 assert.ok(app.indexOf('/js/guest-access.js')>-1&&app.indexOf('/js/guest-access.js')<app.indexOf('/js/main.js'));
 assert.match(app,/id="guestCodeForm"/);assert.match(app,/name="eventInviteMode" value="personal"/);
 assert.match(main,/await LumaGuestAccess\.prepare\(LumaConfig\.publicEventToken\(\)\)/);
 assert.match(main,/invite_mode==='personal'\)return openPersonalLink\(guest\)/);
 assert.match(data,/X-Luma-Access'\)==='personal'/);
 assert.match(config,/#k=\$\{encodeURIComponent\(meta\.upload_key\)\}/);
});
