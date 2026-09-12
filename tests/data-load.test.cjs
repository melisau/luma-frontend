const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/event-data.js'),'utf8');
function setup(fetch){
 const context={window:{},LumaConfig:{apiBase:'http://api',adminAuthHeaders:()=>({Authorization:'Bearer private'})},fetch};
 vm.runInNewContext(source,context);return context.window.LumaEventData;
}
const ok=data=>({ok:true,json:async()=>data});
test('public load never requests private guest data or sends admin credentials',async()=>{
 const requests=[];
 const data=setup(async(url,options)=>{requests.push([url,options]);return ok(url.endsWith('/messages')?[]:{name:'Public',slug:'public'});});
 assert.equal(await data.load('public-token'),true);
 assert.equal(requests.length,3);
 for(const [url,options] of requests){assert(!url.includes('/admin/'));assert.equal(options.headers.Authorization,undefined);}
 assert.equal(data.cache.guests.length,0);
});
test('failed invitation clears previous private data',async()=>{
 const data=setup(async()=>({ok:false,status:404}));data.cache.guests=[{email:'private@example.com'}];
 assert.equal(await data.load('missing'),false);assert.equal(data.cache.guests.length,0);assert(data.lastError);
});
test('late responses cannot replace a newer event',async()=>{
 const pending=[];
 const data=setup(url=>url.includes('/old')?new Promise(resolve=>pending.push(resolve)):Promise.resolve(ok(url.endsWith('/messages')?[]:{name:'New',slug:'new'})));
 const old=data.load('old');await data.load('new');
 pending.forEach(resolve=>resolve(ok({name:'Old',slug:'old'})));await old;
 assert.equal(data.cache.invitation.name,'New');
});
test('partial admin failures expose an error and clear stale rows',async()=>{
 const data=setup(async url=>url.endsWith('/guests')?{ok:false,status:500}:ok(url.endsWith('/invitation')?{name:'Event'}:[]));
 data.cache.guests=[{email:'old@example.com'}];assert.equal(await data.load('event',{admin:true}),true);
 assert.equal(data.cache.guests.length,0);assert.equal(data.loadErrors.length,1);
});

test('public route wins even while an administrator session exists',async()=>{
 const main=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8');
 const snippet=main.slice(main.indexOf('async function ensureEventToken(){'),main.indexOf('window.ensureEventToken='));
 const context={LumaConfig:{publicEventToken:()=> 'invited-event'},sessionStorage:{getItem:()=> 'admin-jwt'},currentEventToken:()=> 'admin-event'};
 vm.runInNewContext(snippet,context);
 assert.equal(await context.ensureEventToken(),'invited-event');
 let options;
 const load=main.slice(main.indexOf('async function refreshEventData(){'),main.indexOf('window.refreshEventData='));
 Object.assign(context,{currentEventToken:()=> 'invited-event',isAdminPanelRoute:()=>false,document:{getElementById:()=>null},LumaEventData:{load:async(token,settings)=>{options=settings;return true;}}});
 vm.runInNewContext(load,context);assert.equal(await context.refreshEventData(),true);assert.equal(options.admin,false);
});
