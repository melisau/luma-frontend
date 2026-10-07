const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/envelope.js'),'utf8');
function setup(){const inputs={};const context={window:{},document:{getElementById:id=>inputs[id]}};vm.runInNewContext(source,context);return {api:context.window.LumaEnvelope,inputs};}
test('appearance settings round-trip through editor controls',()=>{
 const {api,inputs}=setup();for(const key of Object.keys(api.defaults))inputs[key]={value:''};
 api.fillEditor({envelope_color:'#123456',seal_motif:'original'});
 assert.equal(api.readEditor().envelope_color,'#123456');assert.equal(api.readEditor().seal_motif,'original');assert.equal(api.readEditor().paper_color,'#fffdf7');
});
test('unsupported old envelope patterns become the plain option',()=>{
 const {api,inputs}=setup();for(const key of Object.keys(api.defaults))inputs[key]={value:''};
 api.fillEditor({envelope_pattern:'lace'});
 assert.equal(inputs.envelope_pattern.value,'plain');
});
test('hidden envelope texture keeps an existing invitation value',()=>{
 const {api,inputs}=setup();for(const key of Object.keys(api.defaults).filter(key=>key!=='envelope_texture'))inputs[key]={value:''};
 api.fillEditor({envelope_texture:'grain'});
 assert.equal(api.readEditor().envelope_texture,'grain');
 api.fillEditor({});
 assert.equal(api.readEditor().envelope_texture,'linen');
});
test('monogram, dark paper contrast and invalid color fallback',()=>{
 const {api}=setup();const values={};const seal={dataset:{}},text={};
 const layer={dataset:{},style:{setProperty:(key,value)=>values[key]=value},querySelector:selector=>selector==='.wax-seal'?seal:text};
 api.applyAppearance(layer,{paper_color:'#101010',seal_color:'invalid',seal_motif:'monogram',envelope_texture:'grain'},'İpek & Ömer');
 assert.equal(text.textContent,'İÖ');assert.equal(values['--card-ink'],'#f5eee2');assert.equal(values['--wax'],api.defaults.seal_color);assert.equal(layer.dataset.texture,'grain');
});

test('original photograph has no generated motif; legacy motifs fall back to the original',()=>{
 const {api}=setup();const seal={dataset:{}},text={};const layer={dataset:{},style:{setProperty:()=>{}},querySelector:s=>s==='.wax-seal'?seal:text};
 for(const seal_motif of ['original','heart','botanical']){api.applyAppearance(layer,{seal_motif},'Melisa & Deniz');assert.equal(text.textContent,'');assert.equal(seal.dataset.motif,'original')}
});
