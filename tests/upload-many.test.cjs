const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../js/upload.js'),'utf8');
function load(){const context={window:{}};vm.runInNewContext(source,context);const u=context.window.LumaUpload;u.shrinkImage=async f=>f;return u}
const file=(name,size=1000)=>({name,size,lastModified:1});
const fast=async()=>{};

test('photos go one per request, at most two at a time',async()=>{
 const upload=load();let active=0,peak=0;const sent=[];
 const send=async f=>{active++;peak=Math.max(peak,active);sent.push(f.name);await new Promise(r=>setTimeout(r,5));active--;return {uploaded:[{id:f.name}],duplicates_skipped:0}};
 const files=['a','b','c','d','e'].map(n=>file(n));
 const result=await upload.uploadMany('t',files,'Ada','',{send});
 assert.equal(peak,2);assert.deepEqual([...sent].sort(),['a','b','c','d','e']);
 assert.equal(result.uploaded.length,5);assert.equal(result.failed.length,0);
});
test('a failing photo does not stop the others and stays selected',async()=>{
 const upload=load();upload.uploadWithRetry=async fn=>fn();
 const send=async f=>{if(f.name==='bad'){const e=new Error('too big');e.status=413;throw e}return {uploaded:[{id:f.name}],duplicates_skipped:f.name==='dup'?1:0}};
 const files=[file('a'),file('bad'),file('dup')];
 const result=await upload.uploadMany('t',files,'Ada','',{send});
 assert.equal(result.uploaded.length,2);assert.equal(result.duplicates_skipped,1);
 assert.deepEqual([...result.failed],['bad']);assert.equal(result.failedFiles[0],files[1]);
});
test('if every photo fails, the first error is shown',async()=>{
 const upload=load();upload.uploadWithRetry=async fn=>fn();
 await assert.rejects(upload.uploadMany('t',[file('a'),file('b')],'Ada','',{send:async()=>{throw new Error('Bağlantı hatası')}}),/Bağlantı hatası/);
});
test('progress counts finished photos',async()=>{
 const upload=load();const seen=[];
 await upload.uploadMany('t',[file('a'),file('b')],'Ada','',{concurrency:1,send:async(f,p)=>{p(50);return {uploaded:[1]}},onProgress:(pct,done,total)=>seen.push([pct,done,total])});
 assert.deepEqual(seen.at(-1),[100,2,2]);
});
test('busy server (503) is retried like the per-minute limit',async()=>{
 const upload=load();let calls=0;const waits=[];
 const r=await upload.uploadWithRetry(async()=>{calls++;if(calls<3){const e=new Error('busy');e.status=503;e.retryAfter=5;throw e}return 'ok'},null,async ms=>waits.push(ms));
 assert.equal(r,'ok');assert.deepEqual(waits,[5000,5000]);
});

function env({width,height,blobSize,fail}={}){
 const drawn=[];
 class Canvas{constructor(w,h){this.width=w;this.height=h}getContext(){return {fillRect(){},drawImage:(b,x,y,w,h)=>drawn.push([w,h]),set fillStyle(v){}}}async convertToBlob(o){return {size:blobSize,type:o.type}}}
 class File{constructor(parts,name,o){this.name=name;this.type=o.type;this.size=parts[0].size;this.lastModified=o.lastModified}}
 return {drawn,env:{OffscreenCanvas:Canvas,File,createImageBitmap:async(f,o)=>{if(fail)throw new Error('cannot decode');assert.equal(o.imageOrientation,'from-image');return {width,height,close(){}}}}};
}
test('a 12 MP photo is resized to 2560 px JPEG before sending',async()=>{
 const {window:{}}= {window:{}};const context={window:{}};vm.runInNewContext(source,context);const upload=context.window.LumaUpload;
 const {env:e,drawn}=env({width:4032,height:3024,blobSize:800000});
 const out=await upload.shrinkImage({name:'IMG_1.HEIC',size:4500000,lastModified:7},e);
 assert.deepEqual(drawn[0],[2560,1920]);assert.equal(out.type,'image/jpeg');assert.equal(out.name,'IMG_1.jpg');assert.equal(out.size,800000);
});
test('small photos, undecodable files and bigger results are sent unchanged',async()=>{
 const context={window:{}};vm.runInNewContext(source,context);const upload=context.window.LumaUpload;
 const small={name:'a.jpg',size:500000};assert.equal(await upload.shrinkImage(small,env({width:1200,height:900,blobSize:1}).env),small);
 const heic={name:'b.heic',size:4000000};assert.equal(await upload.shrinkImage(heic,env({fail:true}).env),heic);
 const tight={name:'c.jpg',size:900000};assert.equal(await upload.shrinkImage(tight,env({width:5000,height:4000,blobSize:950000}).env),tight);
 assert.equal(await upload.shrinkImage(small,{}),small);
});
