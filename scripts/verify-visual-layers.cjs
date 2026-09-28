const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const flower=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><radialGradient id="petal"><stop stop-color="#fff"/><stop offset="1" stop-color="#ece9df"/></radialGradient></defs><g transform="translate(150 150)">${Array.from({length:16},(_,i)=>`<ellipse rx="24" ry="95" cy="-65" fill="url(#petal)" transform="rotate(${i*22.5})"/>`).join('')}<circle r="48" fill="#eac434"/><circle r="39" fill="#d9b222" stroke="#f4dd6c" stroke-width="4"/></g></svg>`;
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--disable-gpu'],...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];let uploaded=0;
  page.on('pageerror',error=>(errors.push(error.message),console.error('PAGE ERROR:',error.message)));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());if(url.hostname!=='luma.test')return route.abort();
   if(url.pathname.endsWith('/invitation/visual-assets')){const id=(++uploaded).toString(16).padStart(32,'0');return route.fulfill({json:{id,src:`/api/events/demo/visual-assets/${id}`}})}
   if(url.pathname.startsWith('/api/events/demo/visual-assets/')){const id=Number.parseInt(url.pathname.split('/').pop(),16);return route.fulfill({body:id===2?flower:await fs.readFile(path.join(root,'assets/images/wedding-hero.png')),contentType:id===2?'image/svg+xml':'image/png'})}
   const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep))return route.abort();
   try{await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream'})}catch{await route.fulfill({status:404,body:''})}
  });
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://luma.test');
  await page.evaluate(()=>{document.getElementById('dashboard').classList.remove('hidden');document.getElementById('authScreen').classList.add('hidden');showView('invite');document.getElementById('modal').classList.add('hidden')});
  await page.locator('#visualFiles').setInputFiles([path.join(root,'assets/images/wedding-hero.png'),path.join(root,'assets/images/wedding-hero.png'),path.join(root,'assets/images/wedding-hero.png')]);
  assert.equal(await page.locator('.visual-editor-row').count(),3);
  await page.locator('.visual-editor-row').nth(0).locator('[data-field=position]').selectOption('hero-background');
  await page.locator('.visual-editor-row').nth(0).locator('[data-field=motion]').selectOption('parallax');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=position]').selectOption('hero-foreground');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=frame]').selectOption('none');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=width]').fill('65');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=x]').fill('80');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=y]').fill('95');
  await page.locator('.visual-editor-row').nth(1).locator('[data-field=placement]').selectOption('bottom-right');
  await page.locator('.visual-editor-row').nth(2).locator('[data-field=frame]').selectOption('gold');
  await page.locator('.visual-editor-row').nth(2).locator('[data-field=caption]').fill('Birlikte güzel bir gün');
  const saved=await page.evaluate(async()=>{const layers=await LumaVisualLayers.persist('demo');const payload=LumaEventData.invitationPayloadFromForm({visual_layers:layers});LumaVisualLayers.fillEditor(layers);applyInvitationContent({...invitationContentFromForm(),names:'Melisa & Deniz',tagline:'Birlikte kutlayalım'});openInvitation();return payload.visual_layers});
  assert.equal(saved[1].placement,'bottom-right');assert.equal(uploaded,3);assert.equal(saved.length,3);assert(!saved.some(layer=>layer.src||layer.file));
  assert.equal(await page.locator('.hero-visual-layer').count(),1);assert.equal(await page.locator('.visual-slot .visual-photo').count(),1);
  await page.waitForTimeout(800);
  await fs.mkdir(path.join(root,'../output/brand-concepts'),{recursive:true});
  await page.screenshot({path:path.join(root,'../output/brand-concepts/18-katmanli-kapak-mobil.png')});
  const before=await page.locator('.visual-photo .visual-frame').evaluate(el=>getComputedStyle(el).transform);
  await page.locator('#invitation').evaluate(el=>el.scrollTop=850);await page.waitForTimeout(900);
  const after=await page.locator('.visual-photo .visual-frame').evaluate(el=>getComputedStyle(el).transform);assert.notEqual(after,before);
  await page.screenshot({path:path.join(root,'../output/brand-concepts/19-cerceveli-fotograf-mobil.png')});
  await page.evaluate(()=>closeInvitation());assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{LumaVisualLayers.apply(LumaVisualLayers.readEditor());openInvitation()});
  assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
  await page.evaluate(()=>{closeInvitation();LumaVisualLayers.apply([])});assert.equal(await page.locator('.visual-slot,.hero-visual-layer').count(),0);
  // Compare actual image bounds against each hero edge on mobile and desktop.
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:844});
   for(const placement of ['top-left','top-center','top-right','center-left','center','center-right','bottom-left','bottom-center','bottom-right']){
    await page.evaluate(placement=>{const layer=LumaVisualLayers.readEditor().find(item=>item.position==='hero-foreground');LumaVisualLayers.apply([{...layer,placement,width:40,motion:'none',frame:'none'}]);openInvitation();document.getElementById('invitation').scrollTop=0},placement);
    await page.locator('.hero-visual-layer img').evaluate(img=>img.complete?Promise.resolve():new Promise(resolve=>img.onload=resolve));
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const {bounds,hero}=await page.evaluate(()=>({bounds:document.querySelector('.hero-visual-layer').getBoundingClientRect().toJSON(),hero:document.getElementById('inviteHero').getBoundingClientRect().toJSON()}));
    const [x,y]=await page.evaluate(placement=>LumaVisualLayers.anchors[placement],placement);
    assert(Math.abs((bounds.x+bounds.width*x/100)-(hero.x+hero.width*x/100))<2,`${width} ${placement} horizontal alignment`);
    assert(Math.abs((bounds.y+bounds.height*y/100)-(hero.y+hero.height*y/100))<2,`${width} ${placement} vertical alignment ${JSON.stringify({bounds,hero})}`);
   }
  }
  await page.evaluate(()=>{closeInvitation();LumaVisualLayers.apply([])});
  console.log('All nine foreground edge/corner/center placements align on mobile and desktop');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{
   LumaPresentation.fillEditor({paper_style:'ticket',paper_texture:'floral',paper_target:'hero',photo_layout:'grid',photo_columns:3});
   const settings=LumaPresentation.readEditor();
   const layers=LumaVisualLayers.readEditor().map((item,index)=>({...item,position:'before-memories',src:LumaVisualLayers.readEditor()[0].src,frame:['baroque','gold','baroque'][index],motion:'none',caption:'Birlikte bir anı'}));
   applyInvitationContent({...invitationContentFromForm(),visual_layers:layers,presentation:settings,names:'Melisa & Deniz',tagline:'Birlikte kutlayalım',venue:'Bahçe',location:'İstanbul'});openInvitation();
  });
  assert.equal(await page.locator('.hero-copy.invitation-paper').getAttribute('data-paper'),'ticket');
  await page.locator('.hero-copy').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({path:path.join(root,'../output/brand-concepts/20-davet-bilgi-kagidi.png')});
  await page.locator('.visual-slot').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const columns=await page.locator('.visual-slot').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);assert.equal(columns,3);
  assert.equal(await page.locator('.visual-frame[data-frame=baroque]').count(),2);
  await page.screenshot({path:path.join(root,'../output/brand-concepts/21-cerceve-sergisi.png')});
  await page.setViewportSize({width:1280,height:844});
  assert.equal(await page.locator('.visual-slot').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),3);
  await page.evaluate(()=>{const layers=LumaVisualLayers.readEditor().map(item=>({...item,position:'before-memories',frame:'baroque',motion:'none',caption:'Bir anı'}));layers.push({...layers[0]});applyInvitationContent({...invitationContentFromForm(),visual_layers:layers,presentation:{photo_layout:'grid',photo_columns:4}})});
  for(const width of [1280,390]){
    await page.setViewportSize({width,height:844});
    const photos=page.locator('.visual-slot .visual-photo');assert.equal(await photos.count(),4);
    const bounds=await photos.evaluateAll(nodes=>nodes.map(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right}}));
    assert(bounds.every(b=>Math.abs(b.y-bounds[0].y)<1&&b.right<=width),'Four framed photos share one row without horizontal overflow');
    await page.evaluate(()=>LumaPresentation.apply({photo_layout:'grid',photo_columns:2}));
    const pairs=await photos.evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().y));assert.equal(pairs[0],pairs[1]);assert.equal(pairs[2],pairs[3]);assert(pairs[2]>pairs[0]);
    await page.evaluate(()=>LumaPresentation.apply({photo_layout:'grid',photo_columns:4}));
  }
  await page.locator('.visual-slot').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'../output/brand-concepts/27-dortlu-sergi-mobil.png')});
  await page.evaluate(()=>{LumaPresentation.fillEditor({photo_layout:'grid',photo_columns:4});showView('invite');closeInvitation()});
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.visual-slot')?.dataset.columns==='4');
  assert.equal(await page.locator('[data-presentation=photo_columns]').inputValue(),'4');
  console.log('Four photos in one row and optional two-column layout passed on desktop, mobile and live preview');
  await page.evaluate(()=>openInvitation());
  await page.setViewportSize({width:1280,height:844});
  await page.evaluate(()=>{const layers=LumaVisualLayers.readEditor().map(item=>({...item,position:'before-memories',frame:'baroque',motion:'none'}));layers.push({...layers[0]});applyInvitationContent({...invitationContentFromForm(),visual_layers:layers,presentation:{photo_layout:'asymmetric'}})});
  for(const width of [1280,390]){
    await page.setViewportSize({width,height:844});
    const boxes=await page.locator('.visual-slot .visual-photo').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,right:b.right,bottom:b.bottom}}));
    assert.equal(boxes.length,4);assert(Math.abs(boxes[0].w-boxes[3].w)<1);assert(Math.abs(boxes[1].w-boxes[2].w)<1);
    assert(boxes[1].w>boxes[0].w*3);assert(boxes[2].x<boxes[3].x);assert(boxes[0].x<boxes[1].x);assert(boxes[2].y>=boxes[1].bottom);
    assert(boxes.every(b=>b.right<=width),'Asymmetric exhibition stays within the mobile viewport');
  }
  await page.locator('.visual-slot').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'../output/brand-concepts/28-asimetrik-sergi-mobil.png')});
  await page.evaluate(()=>{closeInvitation();showView('invite');LumaPresentation.fillEditor({photo_layout:'asymmetric'})});
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.visual-slot')?.dataset.layout==='asymmetric');
  assert(await page.locator('[data-presentation=photo_columns]').isDisabled());
  console.log('Asymmetric 1/4–3/4, 3/4–1/4 exhibition passed on desktop, mobile and live preview');
  await page.evaluate(()=>openInvitation());await page.setViewportSize({width:1280,height:844});
  for(const style of ['straight','arch','wave','deckle','ticket']){
   await page.evaluate(style=>LumaPresentation.apply({paper_style:style,paper_target:'all'}),style);
   assert.equal(await page.locator('#details').getAttribute('data-paper'),style);
  }
  await page.evaluate(()=>LumaPresentation.apply({photo_layout:'hidden'}));assert.equal(await page.locator('.visual-slot').isVisible(),false);
  await page.evaluate(()=>LumaPresentation.apply({}));assert.equal(await page.locator('#invitation .invitation-paper').count(),0);
  assert.equal(await page.locator('.visual-slot').getAttribute('data-layout'),'stacked');

  const backgroundLayer=await page.evaluate(()=>({...LumaVisualLayers.readEditor()[0],motion:'none',background_fit:'repeat'}));
  for(const [position,selector] of [['invitation-background','#invitation'],['story-background','#story'],['details-background','#details'],['memories-background','#memories'],['exhibition-background','.visual-slot'],['countdown-background','.invite-countdown'],['footer-background','.invite-footer']]){
   await page.evaluate(({layer,position})=>{const photo={...LumaVisualLayers.readEditor()[2],position:'before-memories',motion:'none'};LumaVisualLayers.apply([{...layer,position},photo]);LumaPresentation.apply({});openInvitation()}, {layer:backgroundLayer,position});
   assert((await page.locator(selector).evaluate(el=>getComputedStyle(el).backgroundImage)).includes('/visual-assets/'),position);
  }
  await page.evaluate(layer=>{LumaVisualLayers.apply([{...layer,position:'hero-background'},{...layer,position:'opening-background'}]);openInvitation();LumaEnvelope.show({name:'Melisa & Deniz',date:'2027-06-28',appearance:LumaEnvelope.readEditor()})},backgroundLayer);
  assert.equal(await page.locator('.hero-background-surface').count(),1);
  assert.equal(await page.locator('.opening-stage').evaluateAll(stages=>stages.filter(stage=>stage.style.backgroundImage.includes('/visual-assets/')).length),2);
  await page.evaluate(()=>{LumaEnvelope.close();LumaVisualLayers.apply([]);LumaPresentation.apply({opening_background_color:'#B97978'});LumaEnvelope.show({name:'Melisa',date:'2027-06-28',appearance:LumaEnvelope.readEditor()})});
  assert.equal(await page.locator('.s1-stage').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(185, 121, 120)');
  await page.evaluate(()=>{LumaEnvelope.close();LumaPresentation.apply({section_transition:'torn',transition_target:'hero'})});
  assert.equal(await page.locator('.section-paper-transition[data-cut=torn]').count(),1);
  await page.locator('.section-paper-transition').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'../output/brand-concepts/22-yirtik-kagit-gecisi.png')});
  await page.evaluate(()=>LumaPresentation.apply({section_transition:'wave',transition_target:'details'}));
  assert.equal(await page.locator('.section-paper-transition[data-cut=wave]').count(),1);
  await page.evaluate(()=>{LumaPresentation.apply({});LumaVisualLayers.apply([]);closeInvitation()});
  assert.equal(await page.locator('.section-paper-transition,.hero-background-surface,.has-visual-background').count(),0);
  assert.equal(await page.locator('#invitation').getAttribute('data-full-background'),null);

  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const position of ['invitation-background','details-background','hero-background','hero-foreground','before-memories']){
   await page.evaluate(({layer,position})=>{closeInvitation();LumaVisualLayers.apply([{...layer,position,placement:'center',frame:'none',motion:'parallax',background_fit:'cover'}]);LumaPresentation.apply({});openInvitation();document.getElementById('invitation').scrollTo({top:0,behavior:'instant'})},{layer:backgroundLayer,position});
   const selector=position==='invitation-background'||position==='details-background'?'.background-motion-surface':position==='hero-background'?'#inviteCoverImage':'.visual-frame';
   if(position==='invitation-background'){assert.equal(await page.locator('#inviteHero').getAttribute('data-shared-background'),'true');assert.equal(await page.locator('#inviteCoverImage').isVisible(),false);assert.equal(await page.locator('.background-motion-surface').count(),1)}
   if(position==='before-memories')await page.locator('#invitation').evaluate(root=>root.scrollTo({top:Math.max(0,root.querySelector('.visual-photo').getBoundingClientRect().top+root.scrollTop-root.clientHeight),behavior:'instant'}));
   await page.waitForTimeout(600);
   if(position==='invitation-background')await page.screenshot({path:path.join(root,'../output/brand-concepts/23-ortak-arkaplan.png')});
   const start=await page.locator(selector).first().evaluate(el=>getComputedStyle(el).transform);
   await page.locator('#invitation').evaluate(el=>el.scrollTo({top:el.scrollTop+900,behavior:'instant'}));
   await page.waitForTimeout(800);
   const end=await page.locator(selector).first().evaluate(el=>getComputedStyle(el).transform);
   if(start===end)console.log(await page.evaluate(()=>({scroll:document.getElementById("invitation").scrollTop,triggers:ScrollTrigger.getAll().map(trigger=>({start:trigger.start,end:trigger.end,progress:trigger.progress}))})));
   assert.notEqual(start,end,`${position} parallax must move while scrolling`);
  }
  await page.evaluate(()=>{LumaVisualLayers.apply([]);closeInvitation()});
  assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);

  for(const motion of ['slide-right','slide-left','across-right','across-left','unfold-right','unfold-left']){
   await page.evaluate(motion=>{closeInvitation();const layer=LumaVisualLayers.readEditor()[1];LumaVisualLayers.apply([{...layer,position:'sticker-details',frame:'none',placement:'center',width:25,motion}]);LumaPresentation.apply({});openInvitation();const root=document.getElementById('invitation'),sticker=root.querySelector('.section-sticker');root.scrollTo({top:Math.max(0,sticker.getBoundingClientRect().top+root.scrollTop-root.clientHeight),behavior:'instant'})},motion);
   await page.waitForTimeout(650);
   const start=await page.locator('.section-sticker .visual-frame').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
   await page.locator('#invitation').evaluate(el=>el.scrollTo({top:el.scrollTop+900,behavior:'instant'}));await page.waitForTimeout(800);
   const end=await page.locator('.section-sticker .visual-frame').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
   assert(motion.endsWith('right')?end>start:end<start,`${motion} sticker should slide in the selected direction`);
  }
  await page.evaluate(()=>{LumaVisualLayers.apply([]);closeInvitation()});
  assert.equal(await page.locator('.section-sticker,.has-section-sticker').count(),0);
  for(const motion of ['spin','spin-away','fade-away']){
    await page.evaluate(motion=>{closeInvitation();const layer=LumaVisualLayers.readEditor()[1];LumaVisualLayers.apply([{...layer,position:'sticker-details',frame:'none',placement:'center',width:25,motion}]);openInvitation();const root=document.getElementById('invitation'),sticker=root.querySelector('.section-sticker');root.scrollTo({top:Math.max(0,sticker.getBoundingClientRect().top+root.scrollTop-root.clientHeight),behavior:'instant'})},motion);
    await page.waitForTimeout(650);
    const read=()=>page.locator('.section-sticker .visual-frame').evaluate(el=>({rotation:Number(gsap.getProperty(el,'rotation')),opacity:Number(getComputedStyle(el).opacity)}));const before=await read();
    await page.locator('#invitation').evaluate(el=>el.scrollTo({top:el.scrollTop+900,behavior:'instant'}));await page.waitForTimeout(800);const after=await read();
    if(motion!=='fade-away')assert(after.rotation>before.rotation+100,'Sticker rotates with scroll');
    if(motion!=='spin')assert(after.opacity<before.opacity-.4,'Sticker fades with scroll');
  }
  await page.evaluate(()=>{closeInvitation();LumaVisualLayers.apply([])});
  console.log('Sticker rotation, rotating disappearance and opacity fade follow scroll');
  console.log('Transparent sticker sections and all six scroll directions passed');
  console.log('Parallax movement measured for whole invitation, section, hero background, foreground and framed photo');
  console.log('Whole invitation, section and opening backgrounds, texture repetition, paper transitions and removal passed');
  console.log('Paper styles, optional removal, grid exhibition and responsive columns passed');

  await page.setViewportSize({width:1280,height:844});
  await page.evaluate(()=>{closeInvitation();showView('invite')});
  const editorSticker=page.locator('.visual-editor-row').nth(1);
  await editorSticker.locator('[data-field=position]').selectOption('hero-foreground');
  await editorSticker.locator('[data-field=width]').fill('30');
  await editorSticker.locator('[data-field=placement]').selectOption('top-right');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.hero-visual-layer')?.style.getPropertyValue('--visual-anchor-x')==='100%');
  const frame=page.frameLocator('.editor-phone iframe');
  const bounds=await frame.locator('.hero-visual-layer').boundingBox();assert(bounds.width>0);
  await editorSticker.locator('[data-field=placement]').selectOption('bottom-left');
  await page.waitForFunction(()=>{const layer=LumaEditorPreview.frame.contentDocument?.querySelector('.hero-visual-layer');return layer?.style.getPropertyValue('--visual-anchor-x')==='0%'&&layer.style.getPropertyValue('--visual-anchor-y')==='100%'});
  assert.equal(uploaded,3,'Mobile composition preview must not upload files');
  await editorSticker.scrollIntoViewIfNeeded();await page.waitForTimeout(250);
  const panel=await page.locator('.editor-mobile-preview').boundingBox(),form=await page.locator('#inviteEditorForm').boundingBox();assert(panel.x>=form.x+form.width,'Desktop preview sits next to the editor');assert(panel.y>=70&&panel.y<150,'Desktop preview stays visible after scrolling to image controls');
  await page.screenshot({path:path.join(root,'../output/brand-concepts/25-admin-mobil-onizleme.png')});
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.locator('.editor-mobile-preview').boundingBox();assert(mobile.width<=390&&mobile.height<360);assert(await page.evaluate(()=>document.querySelector('.visual-editor').previousElementSibling.classList.contains('editor-mobile-preview')),'Mobile preview sits immediately before image layers');
  console.log('Live mobile preview follows unsaved placement changes without uploading; desktop sidebar and compact mobile layout passed');
  await page.setViewportSize({width:1280,height:844});
  await page.evaluate(()=>{closeInvitation();LumaVisualLayers.apply([]);applyInvitationContent({names:'Etkinlik',address:'Tam adres',transport_notes:'Ulaşım ve otopark',contact_info:'İletişim bilgileri',schedule:'Karşılama\nKutlama',presentation:{paper_style:'deckle',button_radius:16}});openInvitation()});
  const cards=page.locator('.logistics-section article:not(.hidden)');assert.equal(await cards.count(),4);
  const boxes=await cards.evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width}}));
  assert.equal(boxes[0].y,boxes[1].y);assert.equal(boxes[2].y,boxes[3].y);assert(boxes[1].x>boxes[0].x);assert(boxes[2].y>boxes[0].y);
  assert.equal(await page.locator('.hero-rsvp').evaluate(el=>getComputedStyle(el).borderRadius),'16px');
  await page.locator('.logistics-section').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'../output/brand-concepts/26-kompakt-etkinlik-bilgileri.png')});
  await page.setViewportSize({width:390,height:844});
  const mobileCards=await cards.evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right}}));
  assert(mobileCards.every(b=>b.x===mobileCards[0].x&&b.right<=390));assert(mobileCards[3].y>mobileCards[2].y);
  await page.evaluate(()=>{closeInvitation();showView('invite')});
  for(const value of ['0','8','16','999','']){
    await page.locator('#buttonRadiusPreset').selectOption(value);
    await page.waitForFunction(v=>LumaEditorPreview.frame.contentDocument?.getElementById('invitation')?.style.getPropertyValue('--invite-button-radius')===(v?v+'px':''),value);
    assert.equal(await page.evaluate(()=>LumaPresentation.readEditor().button_radius),value?Number(value):null);
  }
  await page.locator('[data-presentation=button_radius]').fill('23');assert.equal(await page.locator('#buttonRadiusPreset').inputValue(),'custom');
  assert.equal(await page.evaluate(()=>LumaPresentation.readEditor().button_radius),23);
  console.log('Compact two-column logistics, mobile single column and button radius presets/custom live preview passed');
  await page.locator('#mobilePreviewSection').selectOption('opening-envelope');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.s1-stage'));
  assert((await page.frameLocator('.editor-phone iframe').locator('.s1-seal').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('stamp.png'));
  assert.equal(await page.frameLocator('.editor-phone iframe').locator('.s1-seal>span').textContent(),'');
  await page.locator('#contentCoupleNames').fill('Melisa & Deniz');await page.locator('#seal_motif').selectOption('monogram');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.s1-seal>span')?.textContent==='MD');
  await page.locator('#seal_motif').selectOption('original');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.s1-seal>span')?.textContent==='');
  await page.locator('#envelope_color').fill('#B97978');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.luxury-opening')?.style.getPropertyValue('--paper').toUpperCase()==='#B97978');
  assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('envelope-locked')),false,'Static opening preview must not lock the editor');
  await page.locator('#mobilePreviewSection').selectOption('opening-gatefold');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.s2-stage'));
  await page.locator('[data-presentation=opening_hand]').selectOption('witch');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.luxury-opening')?.dataset.hand==='witch');
  assert((await page.frameLocator('.editor-phone iframe').locator('.opening-hand-left').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('witch-hands.png'));
  assert.equal(await page.evaluate(()=>LumaPresentation.readEditor().opening_hand),'witch');
  await page.screenshot({path:path.join(root,'../output/brand-concepts/29-halloween-eller-onizleme.png')});
  await page.locator('[data-presentation=opening_hand]').selectOption('gloved');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.luxury-opening')?.dataset.hand==='gloved');
  await page.locator('#ribbon_color').fill('#25463B');
  await page.waitForFunction(()=>LumaEditorPreview.frame.contentDocument?.querySelector('.luxury-opening')?.style.getPropertyValue('--ribbon').toUpperCase()==='#25463B');
  assert.equal(await page.evaluate(()=>LumaEditorPreview.frame.contentDocument.querySelectorAll('.s2-stage .wax-seal').length),0);
  await page.locator('#mobilePreviewSection').selectOption('inviteHero');
  await page.waitForFunction(()=>!LumaEditorPreview.frame.contentDocument?.querySelector('.luxury-opening'));
  console.log('First envelope and gatefold previews follow live colors without locking or animating the editor');
  const previousCount=await page.locator('.visual-editor-row').count();
  assert.equal(await page.locator('[data-sticker]').count(),4);
  for(const key of ['bats','skeleton','witch-ghost','glowing-ghost'])await page.locator(`[data-sticker="${key}"]`).click();
  await page.waitForFunction(count=>LumaVisualLayers.items.length===count+4,previousCount);
  assert(await page.evaluate(()=>LumaVisualLayers.items.slice(-4).every(item=>item.file?.type==='image/png'&&item.position==='hero-foreground'&&item.frame==='none')));
  const newDrafts=await page.evaluate(async()=>{const saved=await LumaVisualLayers.persist('demo');return saved.slice(-4)});
  assert(newDrafts.every(item=>!item.file&&!item.src.startsWith('blob:')));assert.equal(uploaded,7);
  console.log('All four bundled Halloween stickers add editable drafts and save as event-owned assets');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('Image upload drafts, layer metadata, foreground/background, frames, scroll motion, reduced motion and cleanup passed');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
