const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/gallery.js'),'utf8');
function gallery(apiBase,fetchImpl){
 const context={window:{location:{origin:'http://localhost:5500'}},URL,fetch:fetchImpl,
 LumaConfig:{apiBase,adminAuthHeaders:()=>({Authorization:'Bearer test'})}};
 vm.runInNewContext(source,context);
 return context.window.LumaGallery;
}
test('photo URLs use API origin for both thumbnail and viewer',()=>{
 const g=gallery('http://localhost:8000');
 const item=g.normalizePhoto({id:'photo',thumbnail_url:'/api/photos/photo/thumbnail',original_url:'/api/photos/photo'},'event',{admin:true});
 assert.equal(item.thumbPath,'http://localhost:8000/api/photos/photo/thumbnail');
 assert.equal(item.originalPath,'http://localhost:8000/api/photos/photo');
 assert.equal(item.authHeaders.Authorization,'Bearer test');
});
test('same-origin and absolute photo URLs retain their destination',()=>{
 const g=gallery('');
 assert.equal(g.photoUrl('/api/photos/photo?access=event'),'http://localhost:5500/api/photos/photo?access=event');
 assert.equal(g.photoUrl('https://api.example.com/api/photos/photo'),'https://api.example.com/api/photos/photo');
});
test('failed image response is not treated as an image blob',async()=>{
 const g=gallery('http://localhost:8000',async()=>({ok:false,blob(){assert.fail('must not consume error body')}}));
 const img={};
 await g.loadImage(img,'http://localhost:8000/api/photos/photo',{admin:true,authHeaders:{}});
 assert.equal(img.src,undefined);
 assert.match(img.alt,/yüklenemedi/);
});
test('authenticated preview loads the image with authorization',async()=>{
 let received;
 const g=gallery('http://localhost:8000',async(path,options)=>{received={path,options};return {ok:true,blob:async()=>new Blob(['image'])}});
 const img={};
 await g.loadImage(img,'http://localhost:8000/api/photos/photo',{admin:true,authHeaders:{Authorization:'Bearer test'}});
 assert.equal(received.options.headers.Authorization,'Bearer test');
 assert.match(img.src,/^blob:/);
 img.onload();
});
