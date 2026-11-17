const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function load(file,name){const context={window:{},document:{getElementById:()=>null}};vm.runInNewContext(read(file),context);return context.window[name]}
const plain=value=>JSON.parse(JSON.stringify(value));

test('owner reorders, removes and adds photos',()=>{
 const editor=load('js/slideshow-editor.js','LumaSlideshowEditor');
 assert.deepEqual(plain(editor.move(['a','b','c'],2,-1)),['a','c','b']);
 assert.deepEqual(plain(editor.move(['a','b','c'],0,-1)),['a','b','c']);
 assert.deepEqual(plain(editor.remove(['a','b'],'a')),['b']);
 assert.deepEqual(plain(editor.add(['a'],'a')),['a']);
 assert.deepEqual(plain(editor.add(['a'],'b')),['a','b']);
});
test('player reads its event from the address and mixes transitions',()=>{
 const show=load('js/slideshow.js','LumaSlideshow');
 assert.equal(show.token('/e/abc-123/slayt'),'abc-123');
 assert.equal(show.token('/e/abc-123'),'');
 assert.deepEqual([0,1,2,3].map(i=>show.transitionFor('mix',i)),['fade','zoom','slide','fade']);
 assert.equal(show.transitionFor('zoom',5),'zoom');
});
test('new approvals join without restarting the show',()=>{
 const show=load('js/slideshow.js','LumaSlideshow');
 const slides=['a','b','c','d'].map(id=>({id}));
 assert.equal(show.merge(slides,'c',2).index,2);
 // c was taken out: continue with the photo that took its place.
 assert.equal(show.merge([{id:'a'},{id:'b'},{id:'d'}],'c',2).index,1);
 assert.equal(show.merge([],'c',2).index,-1);
});
test('captions are escaped and optional',()=>{
 const show=load('js/slideshow.js','LumaSlideshow');
 const esc=v=>v.replace(/</g,'&lt;');
 assert.equal(show.captionHtml({uploader_name:'Ayşe',caption:'<b>Dans</b>'},esc),'“&lt;b>Dans&lt;/b>” · <em>Ayşe</em>');
 assert.equal(show.captionHtml({uploader_name:'',caption:''},esc),'');
});
test('slide show is reachable from the panel, the invitation and its own address',()=>{
 const app=read('app.html'),main=read('js/main.js');
 assert.match(app,/id="openSlideshowEditor"/);assert.match(app,/id="watchSlideshowBtn"/);
 assert.ok(app.indexOf('/js/slideshow-editor.js')<app.indexOf('/js/main.js'));
 assert.match(main,/LumaSlideshowEditor\.open\(token\)/);
 assert.match(read('_redirects').split('\n')[0],/^\/e\/\*\/slayt\s+\/slideshow\.html\s+200$/);
 const page=read('slideshow.html');assert.match(page,/\/js\/slideshow\.js/);assert.match(page,/noindex/);
});
