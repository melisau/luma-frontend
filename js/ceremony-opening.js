/* Two-stage invitation opening. GSAP and ScrollTrigger are bundled locally. */
window.LumaCeremony={
  close(){
    this.controller?.abort();this.trigger?.kill();this.scrubTween?.kill();this.timeline?.kill();this.pulse?.kill();this.scrollTween?.kill();this.finishCall?.kill();
    this.layer?.remove();this.layer=null;this.finishCall=null;this.scrollTween=null;this.trigger=null;this.timeline=null;this.pulse=null;
  },
  buildLayer({name,date,appearance}){
    const layer=document.createElement('section');
    layer.className='luxury-opening';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','Davetiyeyi aç');
    // Continuous satin paths keep the knot and held ends connected throughout the pull.
    const tailClosed='M485 215 C450 300 355 455 250 580 L240 535 L185 535 C315 390 400 280 460 215 Z';
    const tailPulled='M485 215 C390 280 225 410 70 600 L60 555 L5 555 C205 350 365 250 460 215 Z';
    const loopClosed='M490 215 C430 100 285 5 200 45 C155 80 160 180 245 220 C330 255 435 225 490 215 Z';
    const loopLoose='M490 215 C410 180 300 175 200 190 C160 193 165 215 245 225 C335 236 435 225 490 215 Z';
    const satin=(id,content,fold="")=>`<svg viewBox="0 0 1000 667" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="satin-light"/><stop offset=".28" class="satin-base"/><stop offset=".5" class="satin-light"/><stop offset=".7" class="satin-base"/><stop offset="1" class="satin-shade"/></linearGradient><pattern id="${id}-weave" width="800" height="800" patternUnits="userSpaceOnUse"><image href="/assets/images/opening/satin-texture.webp" width="800" height="800" preserveAspectRatio="xMidYMid slice"/></pattern></defs><g fill="url(#${id})" stroke="color-mix(in srgb,var(--ribbon),white 28%)" stroke-width="1.5">${content}</g><g fill="url(#${id}-weave)" opacity=".75" style="mix-blend-mode:luminosity">${content}</g>${fold}</svg>`;
    const tail=(side,id,d)=>satin(id,`<g ${side==='right'?'transform="translate(1000 0) scale(-1 1)"':''}><path class="ribbon-strip" d="${d}"/></g>`);
    const bow=satin('satin-knot',`<path class="bow-loop bow-loop-left" d="${loopClosed}"/><g transform="translate(1000 0) scale(-1 1)"><path class="bow-loop bow-loop-right" d="${loopClosed}"/></g><path class="bow-center" d="M465 174 Q500 164 535 174 Q526 211 535 244 Q500 255 465 244 Q474 209 465 174Z"/>`, `<defs><clipPath id="bow-fold-clip"><path class="bow-loop" d="${loopClosed}"/></clipPath></defs><g class="bow-fold"><g clip-path="url(#bow-fold-clip)"><path d="M160 170 C255 235 385 254 490 215 C378 211 290 179 160 170Z" fill="#071b2b" opacity=".38"/><path d="M185 170 C265 225 386 244 480 217" fill="none" stroke="#fff" stroke-width="3" opacity=".38"/></g><g transform="translate(1000 0) scale(-1 1)" clip-path="url(#bow-fold-clip)"><path d="M160 170 C255 235 385 254 490 215 C378 211 290 179 160 170Z" fill="#071b2b" opacity=".38"/><path d="M185 170 C265 225 386 244 480 217" fill="none" stroke="#fff" stroke-width="3" opacity=".38"/></g></g>`);
    const door=side=>`<div class="gatefold-door gatefold-${side}"><div class="door-ribbon"></div><div class="door-tail door-tail-${side} ribbon-art">${tail(side,'satin-door-'+side,tailPulled)}</div></div>`;
    layer.innerHTML=`<div class="opening-track"><div class="opening-scene">
      <section class="opening-stage s2-stage" aria-label="Kurdeleli davetiye kapağı">
        <div class="gatefold-card"><div class="gatefold-inside"><span>SİZİN İÇİN, SEVGİYLE</span><strong class="opening-name"></strong><p class="opening-date"></p></div>
          ${door('left')}${door('right')}
          <div class="s2-plaque"><span>BİRLİKTE KUTLAYALIM</span><strong class="opening-name"></strong></div>
          <button class="s2-bow bow-knot ribbon-art" type="button" aria-label="Fiyongu çöz ve davetiyeyi aç" tabindex="-1">${bow}</button>
          <div class="ribbon-tail ribbon-tail-left ribbon-art">${tail('left','satin-tail-left',tailClosed)}</div><div class="ribbon-pull ribbon-pull-left"><div class="opening-hand opening-hand-left"></div></div>
          <div class="ribbon-tail ribbon-tail-right ribbon-art">${tail('right','satin-tail-right',tailClosed)}</div><div class="ribbon-pull ribbon-pull-right"><div class="opening-hand opening-hand-right"></div></div>
        </div>
      </section>
      <section class="opening-stage s1-stage" aria-label="Mühürlü zarf">
        <header class="s1-heading"><p class="opening-date"></p><span>❦</span><h1>Bir davetiniz var.</h1><p class="opening-name"></p></header>
        <div class="s1-stationery"><div class="s1-envelope"><div class="s1-flap"></div><div class="s1-folds"></div>
          <button class="s1-seal wax-seal ceremonial-seal" type="button" aria-label="Mührü aç ve kurdeleli kapağa geç"><span>❦</span></button>
        </div></div>
      </section>
      <p class="opening-instruction" aria-live="polite">Mühüre dokunun veya yukarı kaydırın</p>
    </div></div>`;
    LumaEnvelope.applyAppearance(layer,appearance,name);
    layer.dataset.hand=window.LumaPresentation?.current?.opening_hand==='witch'?'witch':'gloved';
    const backdropColor=window.LumaPresentation?.current?.opening_background_color;
    if(/^#[0-9a-f]{6}$/i.test(backdropColor||""))layer.querySelector(".s1-stage").style.background=backdropColor;
    const openingBackground=window.LumaVisualLayers?.openingBackground;
    if(openingBackground){const src=LumaEventData.coverFullUrl(openingBackground.src);layer.querySelectorAll('.opening-stage').forEach(stage=>{stage.style.backgroundImage=`url(${JSON.stringify(src)})`;stage.style.backgroundPosition='center';stage.style.backgroundSize=openingBackground.background_fit==='repeat'?'420px auto':openingBackground.background_fit||'cover';stage.style.backgroundRepeat=openingBackground.background_fit==='repeat'?'repeat':'no-repeat'})}

    layer.querySelectorAll('.opening-name').forEach(el=>el.textContent=name||'Birlikte güzel bir gün');
    const parsed=new Date(date);const dateText=date&&!Number.isNaN(parsed.getTime())?parsed.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}):'';
    layer.querySelectorAll('.opening-date').forEach(el=>el.textContent=dateText);
    layer.ribbonGeometry={tailClosed,tailPulled,loopClosed,loopLoose};
    return layer;
  },
  show(owner,{name,date,appearance,onOpen}){
    owner.close();
    const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    const invitation=document.getElementById('invitation');
    invitation.inert=true;document.documentElement.classList.add('envelope-locked');
    const layer=this.buildLayer({name,date,appearance});this.layer=layer;owner.layer=layer;
    const {tailClosed,tailPulled,loopClosed,loopLoose}=layer.ribbonGeometry;
    document.body.appendChild(layer);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s1=layer.querySelector('.s1-seal'),s2=layer.querySelector('.s2-bow'),hint=layer.querySelector('.opening-instruction');
    let begun=false,finished=false,currentStage=1,furthestProgress=0,revealing=false,advancing=false,advancingFrom=1;
    const begin=()=>{if(!begun){begun=true;this.pulse?.kill();onOpen?.();}};
    const finish=()=>{
      if(finished)return;finished=true;owner.close();
      const heading=invitation.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
    };
    const q=selector=>layer.querySelector(selector);
    gsap.set(q('.s2-stage'),{autoAlpha:0});
    gsap.set(layer.querySelectorAll('.door-tail'),{autoAlpha:0});
    this.timeline=gsap.timeline({paused:true});
    this.timeline
      .to(s1,{scale:reduced?1:.8,autoAlpha:0,duration:.35},0)
      .to(q('.s1-flap'),{rotationX:reduced?0:-170,autoAlpha:reduced?0:1,duration:.8,ease:'power2.inOut'},.2)
      .to(q('.s1-envelope'),{scale:reduced?1:1.03,autoAlpha:0,duration:.65,ease:'power2.inOut'},.85)
      .to(q('.s1-heading'),{autoAlpha:0,duration:.65},.55)
      .to(q('.s1-stage'),{autoAlpha:0,duration:.65},1)
      .to(q('.s2-stage'),{autoAlpha:1,duration:.7,ease:'power2.inOut'},1)
      .addLabel('gatefold',1.7)
      .addLabel('pullRibbon',2.15)
      .to(q('.ribbon-pull-left'),{xPercent:reduced?0:-18,yPercent:reduced?0:3,duration:1.2,ease:'sine.inOut'},2.15)
      .to(q('.ribbon-pull-right'),{xPercent:reduced?0:18,yPercent:reduced?0:3,duration:1.2,ease:'sine.inOut'},2.15)
      .to(layer.querySelectorAll('.ribbon-tail .ribbon-strip'),{attr:{d:reduced?tailClosed:tailPulled},duration:1.2,ease:'sine.inOut'},2.15)
      .to(layer.querySelectorAll('.bow-loop'),{attr:{d:reduced?loopClosed:loopLoose},duration:.9,ease:'sine.inOut'},2.3)
      .to(layer.querySelectorAll('.bow-loop,.bow-fold'),{autoAlpha:0,duration:.35},2.95)
      .to(layer.querySelectorAll('.bow-center'),{scaleX:reduced?1:.7,autoAlpha:0,transformOrigin:'50% 50%',duration:.45,ease:'sine.inOut'},2.85)
      .to(q('.s2-bow'),{autoAlpha:0,duration:.15},3.25)
      .addLabel('releaseRibbon',3.4)
      .set(layer.querySelectorAll('.door-tail'),{autoAlpha:1},3.4)
      .set(layer.querySelectorAll('.ribbon-tail'),{autoAlpha:0},3.4)
      .to(q('.opening-hand-left'),{xPercent:reduced?0:-140,yPercent:reduced?0:35,autoAlpha:0,duration:.7,ease:'power2.inOut'},3.5)
      .to(q('.opening-hand-right'),{xPercent:reduced?0:140,yPercent:reduced?0:35,autoAlpha:0,duration:.7,ease:'power2.inOut'},3.5)
      .to(q('.s2-plaque'),{autoAlpha:0,duration:.5},3.65)
      .addLabel('openDoors',4.15)
      .to(q('.gatefold-left'),{rotationY:reduced?0:-110,autoAlpha:reduced?0:1,duration:1.5,ease:'power2.inOut'},4.15)
      .to(q('.gatefold-right'),{rotationY:reduced?0:110,autoAlpha:reduced?0:1,duration:1.5,ease:'power2.inOut'},4.15)
      .to(q('.opening-instruction'),{autoAlpha:0,duration:.5},4.3)
      .to(layer,{autoAlpha:0,duration:.65},5.65);
    const range=()=>Math.max(1,layer.scrollHeight-layer.clientHeight);
    const gateProgress=this.timeline.labels.gatefold/this.timeline.duration();
    this.trigger=ScrollTrigger.create({scroller:layer,trigger:layer.querySelector('.opening-track'),start:'top top',end:'bottom bottom',
      onUpdate:self=>{
        if(self.progress<furthestProgress-.005&&currentStage===2&&!revealing){revealing=true;advance(true);return;}
        furthestProgress=Math.max(furthestProgress,self.progress);
        this.scrubTween?.kill();
        if(reduced)this.timeline.time(furthestProgress*this.timeline.duration());
        else this.scrubTween=gsap.to(this.timeline,{time:furthestProgress*this.timeline.duration(),duration:.35,ease:'power1.out'});
        if(self.progress>.01)begin();
        const stage=furthestProgress>=gateProgress-.015?2:1;
        if(stage!==currentStage){currentStage=stage;s1.tabIndex=stage===1?0:-1;s2.tabIndex=stage===2?0:-1;hint.style.color=stage===1?'#E0C998':'var(--card-ink)';hint.style.textShadow=stage===1?'0 1px 5px #0005':'none';hint.textContent=stage===1?'Mühüre dokunun veya yukarı kaydırın':'Fiyonka dokunun veya kaydırmaya devam edin';(stage===1?s1:s2).focus({preventScroll:true});}
        if(!advancing&&self.progress>.04&&currentStage===1){advance();}
        else if(!advancing&&currentStage===2&&self.progress>gateProgress+.04){advance();}
        if(furthestProgress>=.999&&!this.finishCall){this.finishCall=gsap.delayedCall(reduced?.01:.45,finish);}
      }
    });
    if(!reduced)this.pulse=gsap.timeline({repeat:-1,repeatDelay:.75})
      .to(s1,{scale:1.055,duration:.24,ease:'sine.out'})
      .to(s1,{scale:1,duration:.22,ease:'sine.inOut'})
      .to(s1,{scale:1.035,duration:.2,ease:'sine.out'})
      .to(s1,{scale:1,duration:.4,ease:'sine.inOut'});
    this.controller=new AbortController();const options={signal:this.controller.signal};
    const advance=(requested=false)=>{if(finished||(advancing&&(!requested||currentStage===advancingFrom)))return;advancingFrom=currentStage;advancing=true;begin();this.scrollTween?.kill();const scrollTop=currentStage===1?range()*gateProgress:range();if(reduced){layer.scrollTop=scrollTop;ScrollTrigger.update();advancing=false;}else{this.scrollTween=gsap.to(layer,{scrollTop,duration:currentStage===1?1.9:4.2,ease:'power2.inOut',overwrite:'auto',onComplete:()=>{advancing=false}});}};
    s1.addEventListener('click',()=>advance(true),options);s2.addEventListener('click',()=>advance(true),options);
    let wheelDistance=0,touchY=0,touchHandled=false;
    layer.addEventListener('wheel',event=>{event.preventDefault();if(advancing)return;wheelDistance+=event.deltaY;if(Math.abs(wheelDistance)>=24){wheelDistance=0;advance()}},{...options,passive:false});
    layer.addEventListener('touchstart',event=>{touchY=event.touches[0]?.clientY||0;touchHandled=false},{...options,passive:true});
    layer.addEventListener('touchmove',event=>{event.preventDefault();if(advancing||touchHandled)return;if(Math.abs(touchY-(event.touches[0]?.clientY||touchY))>=24){touchHandled=true;advance()}},{...options,passive:false});
    layer.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();(currentStage===1?s1:s2).focus({preventScroll:true});}if(event.key==='Escape'){event.preventDefault();advance(true);}},options);
    ScrollTrigger.refresh();s1.focus({preventScroll:true});
  }
};
