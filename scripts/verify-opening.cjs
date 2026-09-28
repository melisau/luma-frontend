// Run with Playwright installed, or set PLAYWRIGHT_MODULE to its local module path.
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--disable-gpu'],...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());if(url.hostname!=='luma.test')return route.abort();
   const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
   if(!file.startsWith(root+path.sep))return route.abort();
   try{await route.fulfill({body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});}catch{await route.fulfill({status:404,body:''});}
  });
  await page.goto('http://luma.test');
  const show=()=>page.evaluate(()=>{document.getElementById('invitation').classList.remove('hidden');LumaEnvelope.show({name:'Melisa & Deniz',date:'2027-06-28',appearance:{envelope_color:'#25463B',seal_color:'#C9AA78'},onOpen:()=>window.openCalls=(window.openCalls||0)+1});});
  await show();assert(await page.evaluate(()=>document.getElementById('invitation').inert));
  assert.equal(await page.locator('.s1-stage .opening-hand').count(),0);
  assert.equal(await page.locator('.gatefold-card .opening-hand').count(),2);
  assert((await page.locator('.s1-seal').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('stamp.png'));
  assert.equal(await page.locator('.s1-seal>span').textContent(),'');
  assert(await page.evaluate(()=>LumaCeremony.pulse?.repeat()===-1),'Seal heartbeat runs until opening');
  await page.locator('.s1-seal').click();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  assert(await page.locator('.s2-bow').isVisible());
  assert.equal(await page.locator('.s2-stage .seal-half, .s2-stage .ceremonial-seal').count(),0);
  assert.equal(await page.locator('.gatefold-door .door-ribbon').count(),2);
  const card=await page.locator('.gatefold-card').boundingBox(),bow=await page.locator('.s2-bow').boundingBox();
  assert(Math.abs(card.x-bow.x)<2&&Math.abs(card.width-bow.width)<2);
  assert(await page.locator('.opening-hand-left').isVisible());
  if(process.env.OPENING_SCREENSHOTS){
   await fs.mkdir(process.env.OPENING_SCREENSHOTS,{recursive:true});
   for(const [time,name] of [[1.7,'14-kurdele-tutus'],[2.95,'15-fiyonk-cozuluyor'],[3.6,'16-kurdele-cozuldu'],[4.85,'17-kapaklar-aciliyor']]){
    await page.evaluate(time=>{LumaCeremony.scrubTween?.kill();LumaCeremony.timeline.time(time);},time);
    await page.screenshot({path:path.join(process.env.OPENING_SCREENSHOTS,name+'.png')});
   }
   await page.evaluate(()=>LumaEnvelope.close());
   await show();await page.locator('.s1-seal').click();
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  }
  const beganCalls=await page.evaluate(()=>window.openCalls);
  const knot=await page.locator('.s2-bow').boundingBox();
  await page.locator('.s2-bow').click({position:{x:knot.width*.5,y:knot.height*.75},timeout:5000});await page.waitForSelector('.luxury-opening',{state:'detached',timeout:10000});
  assert.equal(await page.evaluate(()=>window.openCalls),beganCalls);
  assert.equal(await page.evaluate(()=>document.getElementById('invitation').inert),false);
  assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
  console.log('Mobile: seal, bow, reveal and cleanup passed');
  await show();await page.locator('.luxury-opening').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.waitForSelector('.luxury-opening',{state:'detached',timeout:10000});
  console.log('Repeated opening and native scroll reveal passed');
  await page.evaluate(()=>LumaPresentation.apply({opening_hand:'witch'}));await show();
  assert.equal(await page.locator('.luxury-opening').getAttribute('data-hand'),'witch');
  assert((await page.locator('.opening-hand-left').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('witch-hands.png'));
  await page.locator('.s1-seal').click();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  await page.locator('.s2-bow').click();await page.waitForSelector('.luxury-opening',{state:'detached',timeout:10000});
  await page.evaluate(()=>LumaPresentation.apply({}));
  console.log('Halloween hands use the supplied transparent asset and complete the ribbon reveal');
  await show();
  const gesture=()=>page.locator('.luxury-opening').evaluate(el=>{
    el.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:1,target:el,clientX:180,clientY:500})]}));
    el.dispatchEvent(new TouchEvent('touchmove',{cancelable:true,touches:[new Touch({identifier:1,target:el,clientX:180,clientY:470})]}));
  });
  await gesture();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  await page.waitForTimeout(500);
  const scene=await page.locator('.opening-scene').boundingBox();assert.equal(scene.y,0);assert.equal(scene.height,844,'Opening fills the viewport after a short swipe');
  assert(await page.evaluate(()=>document.querySelector('.luxury-opening').scrollHeight-document.querySelector('.luxury-opening').clientHeight<=250));
  await gesture();await page.waitForSelector('.luxury-opening',{state:'detached',timeout:10000});
  console.log('Two short 30px swipes open both stages; scene covers the entire mobile viewport');
  await show();
  await page.locator('.luxury-opening').evaluate(el=>el.scrollTop=(el.scrollHeight-el.clientHeight)*.15);
  await page.waitForFunction(()=>LumaCeremony.timeline.time()>.7);
  const openingTime=await page.evaluate(()=>LumaCeremony.timeline.time());
  await page.locator('.luxury-opening').evaluate(el=>el.scrollTop=0);
  await page.waitForTimeout(450);
  assert(await page.evaluate(time=>LumaCeremony.timeline.time()>=time,openingTime));
  await page.locator('.s1-seal').evaluate(el=>el.click());
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  await page.locator('.luxury-opening').evaluate(el=>el.scrollTop=0);
  await page.waitForSelector('.luxury-opening',{state:'detached',timeout:10000});
  assert.equal(await page.evaluate(()=>document.getElementById('invitation').inert),false);
  console.log('Reverse scroll: first envelope stays open; gatefold reveals invitation');
  await show();await page.evaluate(()=>LumaEnvelope.close());
  assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
  assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('envelope-locked')),false);
  await page.emulateMedia({reducedMotion:'reduce'});await show();
  await page.locator('.s1-seal').press('Enter');await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  await page.locator('.s2-bow').press('Enter');await page.waitForSelector('.luxury-opening',{state:'detached'});
  console.log('Reduced motion keyboard flow and interrupted cleanup passed');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});await show();
  await page.locator('.luxury-opening').evaluate(el=>el.scrollTop=el.scrollHeight*.4);
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.s1-stage')).visibility==='hidden');
  const box=await page.locator('.gatefold-card').boundingBox();assert(box.width>300&&box.width<600);
  await page.evaluate(()=>LumaEnvelope.close());assert.equal(errors.length,0);
  console.log('Desktop gatefold sizing passed; no page errors');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
