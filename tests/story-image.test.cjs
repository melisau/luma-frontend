const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const context={window:{}};vm.runInNewContext(read('js/story-image.js'),context);const story=context.window.LumaStoryImage;

test('content comes from the saved invitation',()=>{
 const data=story.content({name:'Elif & Deniz',tagline:'Düğünümüze davetlisiniz',event_date:'2026-09-06T16:00:00Z',venue:'Bahçe Köşk',city:'İstanbul',palette:{background:'#121212',heading:'#D4AF6A',text:'bad'},presentation:{font:'script'},cover_url:'https://x/c.jpg'},{timeZone:'Europe/Istanbul'});
 assert.equal(data.names,'Elif & Deniz');assert.equal(data.kicker,'Düğünümüze davetlisiniz');
 assert.equal(data.date,'6 Eylül 2026');assert.match(data.weekdayTime,/^Pazar · 19:00$/);
 assert.equal(data.place,'Bahçe Köşk · İstanbul');
 assert.equal(data.palette.background,'#121212');assert.equal(data.palette.heading,'#D4AF6A');
 assert.equal(data.palette.text,story.FALLBACK.text,'invalid colours fall back');
 assert.equal(data.font,'script');assert.equal(data.cover,'https://x/c.jpg');
});
test('missing pieces are left out, not shown as blanks',()=>{
 const data=story.content({name:'Ayşe',presentation:{font:'unknown'}});
 assert.equal(data.date,'');assert.equal(data.weekdayTime,'');assert.equal(data.place,'');assert.equal(data.font,'classic');assert.equal(data.kicker,'Davetlisiniz');
 assert.equal(story.content({event_date:'not a date'}).date,'');
});
test('long text wraps and is cut with an ellipsis',()=>{
 const measure=t=>t.length*10;
 assert.deepEqual([...story.wrap('bir iki üç',100,measure)],['bir iki üç']);
 assert.deepEqual([...story.wrap('aaaa bbbb cccc',90,measure)],['aaaa bbbb','cccc']);
 const cut=story.wrap('a b c d e f g h',30,measure,2);assert.equal(cut.length,2);assert.ok(cut[1].endsWith('…'));
});
test('every invitation font has a drawing font and the file name is safe',()=>{
 const schema=path.join(__dirname,'../js/looks.js');const looks={window:{}};vm.runInNewContext(fs.readFileSync(schema,'utf8'),looks);
 assert.deepEqual(Object.keys(story.FONTS).sort(),Object.keys(looks.window.LumaLooks.FONTS).sort());
 assert.equal(story.fileName('Şule & Çağrı Öz'),'sule-cagri-oz-hikaye.png');assert.equal(story.fileName(''),'davetiye-hikaye.png');
 assert.equal(story.alpha('#FF8000',0.5),'rgba(255,128,0,0.5)');
});
test('button and script are on the page',()=>{
 const app=read('app.html');
 assert.ok(app.includes('id="storyImageBtn"'));assert.ok(app.indexOf('/js/story-image.js')<app.indexOf('/js/main.js'));
 assert.ok(read('js/main.js').includes("document.getElementById('storyImageBtn').onclick"));
});
