const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/rsvp-access.js'),'utf8');
function setup(hash=''){
 const storage=new Map(),route={hash};
 const context={window:{},URLSearchParams,appLocation:()=>route,LumaConfig:{publicEventToken:()=>'one',inviteUrl:event=>`https://test/e/${event}`},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}};
 vm.runInNewContext(source,context);return {access:context.window.LumaRsvpAccess,context,route};
}
test('RSVP credentials are scoped by event and email',()=>{
 const {access}=setup();access.save('one','A@example.com','secret');
 assert.equal(access.credential('one','a@example.com'),'secret');assert.equal(access.credential('two','a@example.com'),null);assert.equal(access.credential('one','b@example.com'),null);
});
test('personal link survives navigating to another invitation section',()=>{
 const {access,route}=setup('#rsvp=personal-secret&email=a%40example.com');route.hash='#details';
 assert.equal(access.credential('one','a@example.com'),'personal-secret');assert.equal(access.credential('one','b@example.com'),null);assert.equal(access.credential('two','a@example.com'),null);assert.equal(access.email(),'a@example.com');
});
test('credentials stay in the fragment and storage failures are tolerated',()=>{
 const {access,context}=setup();context.localStorage={getItem(){throw Error('denied')},setItem(){throw Error('denied')}};
 access.save('one','a@example.com','secret');assert.equal(access.credential('one','a@example.com'),null);
 const url=new URL(access.link('one','a@example.com','secret'));assert.equal(url.search,'');assert(url.hash.includes('secret'));
});
