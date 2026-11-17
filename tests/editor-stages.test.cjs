const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function previewWith(current,openingStyle='envelope'){
 const context={window:{},document:{getElementById:id=>({mobilePreviewSection:{value:current},openingStyle:{value:openingStyle}})[id]}};
 vm.runInNewContext(read('js/editor-preview.js'),context);return context.window.LumaEditorPreview;
}
function field({id='',panel,palette,presentation,value}={}){
 return {id,value,dataset:palette?{paletteColor:palette}:{},closest:sel=>sel==='.visual-editor-row'?null:sel===panel||(sel==='.editor-panel'&&panel)?{}:null,matches:sel=>presentation?sel===`[data-presentation=${presentation}]`:false};
}
test('envelope settings show the envelope, ribbon and cover colours show the ribbon cover',()=>{
 const preview=previewWith('inviteHero');
 assert.equal(preview.sectionFor(field({id:'envelope_color',panel:'.opening-style-panel'})),'opening-envelope');
 assert.equal(preview.sectionFor(field({id:'seal_motif',panel:'.opening-style-panel'})),'opening-envelope');
 assert.equal(preview.sectionFor(field({id:'ribbon_color',panel:'.opening-style-panel'})),'opening-gatefold');
 assert.equal(preview.sectionFor(field({id:'paper_color_hex',panel:'.opening-style-panel'})),'opening-gatefold');
 assert.equal(preview.sectionFor(field({panel:'.opening-style-panel',presentation:'opening_hand'})),'opening-gatefold');
});
test('without the envelope opening there is no envelope to show',()=>{
 const preview=previewWith('inviteHero','classic');
 assert.equal(preview.sectionFor(field({id:'envelope_color',panel:'.opening-style-panel'})),null);
 assert.equal(preview.sectionFor(field({id:'openingStyle',value:'classic',panel:'.opening-style-panel'})),'inviteHero');
});
test('invitation settings move the preview from the envelope to the invitation part they change',()=>{
 const preview=previewWith('opening-envelope');
 assert.equal(preview.sectionFor(field({panel:'.invitation-colors-panel',palette:'background'})),'inviteHero');
 assert.equal(preview.sectionFor(field({panel:'.invitation-colors-panel',palette:'memory_background'})),'memories');
 assert.equal(preview.sectionFor(field({id:'palette_countdown_text_hex',panel:'.invitation-colors-panel'})),'inviteCountdown');
 assert.equal(preview.sectionFor(field({id:'eventDateInput',panel:'.editor-panel'})),'inviteHero');
 assert.equal(previewWith('details').sectionFor(field({id:'eventDateInput',panel:'.editor-panel'})),null);
});
test('the editor names the two stages and drops settings that change nothing',()=>{
 const app=read('app.html'),colors=read('js/invitation-colors.js'),progress=read('js/invitation-progress.js'),presentation=read('js/presentation.js');
 assert.match(app,/class="editor-stage-divider" data-stage="1"><span>1\. AŞAMA<\/span><strong>Zarf ve açılış/);
 assert.match(colors,/<span>2\. AŞAMA<\/span><strong>Davetiyenin kendisi/);
 assert.match(progress,/title:'1\. aşama · Zarf ve açılış'/);
 assert.doesNotMatch(app,/id="envelope_pattern"/);
 assert.match(app,/seal-color-field"><span>MÜHÜR YAZISI RENGİ/);
 assert.match(app,/id="inviteCountdown"/);
 assert.match(presentation,/invitation-colors-panel \.invitation-color-grid/);
});
