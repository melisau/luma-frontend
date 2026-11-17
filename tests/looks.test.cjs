const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function load(file,name,extra={}){const context={window:{},...extra};vm.runInNewContext(read(file),context);return context.window[name]}
const looks=load('js/looks.js','LumaLooks');
const PALETTE_KEYS=['background','text','heading','hero_text','details_background','memory_background','memory_text','badge_background','badge_text','button_background','button_text','countdown_background','countdown_text'];
const hex=/^#[0-9A-F]{6}$/i;

test('every look sets a full, valid palette, envelope and a known font',()=>{
 const ids=new Set();
 for(const look of looks.LOOKS){
  assert.ok(!ids.has(look.id),look.id);ids.add(look.id);
  assert.ok(look.id.length<=40);
  for(const key of PALETTE_KEYS)assert.match(look.palette[key],hex,`${look.id}.${key}`);
  assert.deepEqual(Object.keys(look.palette).sort(),[...PALETTE_KEYS].sort());
  for(const key of ['envelope_color','paper_color','ribbon_color'])assert.match(look.envelope[key],hex,`${look.id}.${key}`);
  assert.ok(Object.hasOwn(looks.FONTS,look.font),look.id);
  for(const type of look.types)assert.ok(Object.hasOwn(looks.EVENT_TYPES,type),`${look.id}:${type}`);
 }
});
test('every event type has at least one recommended look, shown first',()=>{
 for(const type of Object.keys(looks.EVENT_TYPES)){
  const ordered=looks.ordered(type);
  assert.equal(ordered.length,looks.LOOKS.length);
  assert.ok(ordered[0].recommended,type);
  const firstOther=ordered.findIndex(look=>!look.recommended);
  if(firstOther>=0)assert.ok(ordered.slice(firstOther).every(look=>!look.recommended),type);
 }
});
test('event types and fonts match what the server accepts',t=>{
 // Only when the backend checkout sits next to this one (local work); CI checks out one repo.
 const file=path.join(__dirname,'../../luma-backend/app/schemas/invitation.py');
 if(!fs.existsSync(file))return t.skip('backend checkout not found');
 const schema=fs.readFileSync(file,'utf8');
 const literal=name=>{const line=schema.split('\n').find(l=>l.startsWith(name+' = Literal['));return [...line.matchAll(/"([^"]+)"/g)].map(m=>m[1])};
 assert.deepEqual(Object.keys(looks.EVENT_TYPES).sort(),literal('EventType').sort());
 assert.deepEqual(Object.keys(looks.FONTS).sort(),literal('FontPair').sort());
});
test('ready-made wording exists for every event type',()=>{
 const wording=load('js/wording.js','LumaWording');
 for(const type of Object.keys(looks.EVENT_TYPES)){
  const entries=wording.forType(type);
  assert.ok(entries.length>=2,type);
  for(const entry of entries){assert.ok(entry.tagline&&entry.title&&entry.story,type);assert.ok(entry.title.length<=120)}
 }
 assert.equal(wording.forType('unknown'),wording.TEXTS.other);
});
test('wording asks before replacing what the owner wrote',()=>{
 const inputs={contentTagline:{value:'Benim sloganım',dispatchEvent(){}},contentStoryTitle:{value:'',dispatchEvent(){}},contentStoryText:{value:'',dispatchEvent(){}}};
 const wording=load('js/wording.js','LumaWording',{document:{getElementById:id=>inputs[id]},Event:class{constructor(t){this.type=t}}});
 const entry={tagline:'A',title:'B',story:'C'};
 assert.equal(wording.fill(entry,{confirmFn:()=>false}),false);
 assert.equal(inputs.contentTagline.value,'Benim sloganım');
 assert.equal(wording.fill(entry,{confirmFn:()=>true}),true);
 assert.deepEqual([inputs.contentTagline.value,inputs.contentStoryTitle.value,inputs.contentStoryText.value],['A','B','C']);
});
test('fonts, looks and colour scheme are wired into the pages',()=>{
 const app=read('app.html'),css=read('css/looks.css'),fonts=read('css/fonts.css');
 for(const family of ['Playfair Display','Great Vibes'])assert.match(fonts,new RegExp(`font-family:'${family}'`));
 assert.match(css,/\.invitation\[data-font=modern\]/);assert.match(css,/\.invitation\[data-font=script\]/);
 assert.ok(app.indexOf('/js/looks.js')<app.indexOf('/js/main.js')&&app.indexOf('/js/wording.js')<app.indexOf('/js/main.js'));
 assert.match(app,/name="color-scheme" content="light only"/);
 assert.match(read('js/main.js'),/LumaLooks\.init\(\);\nLumaWording\.init\(\);/);
});
