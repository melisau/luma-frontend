window.LumaEnvelope={
  timer:null,layer:null,
  defaults:{envelope_color:'#e9dcc4',seal_color:'#873f43',paper_color:'#fffdf7',envelope_texture:'linen',envelope_pattern:'plain',seal_motif:'botanical'},
  readEditor(){return Object.fromEntries(Object.entries(this.defaults).map(([key,value])=>[key,document.getElementById(key)?.value||value]));},
  fillEditor(settings){for(const [key,value] of Object.entries(this.defaults)){const input=document.getElementById(key);if(input)input.value=settings[key]||value;}},
  laceArtwork(){
    let stitches='';
    for(let i=0;i<32;i++){
      const x=6+i*12.5,y=8+Math.min(x,400-x)*.72;
      stitches+=`<g transform="translate(${x} ${y}) rotate(${x<200?36:-36})"><path d="M-6 0Q-5 9 0 10Q5 9 6 0M-5 0Q-4 6 0 7Q4 6 5 0"/><path d="M-4 1L0 6L4 1M-2 0L0 3L2 0" stroke-width=".35"/><ellipse cx="0" cy="-2" rx="2" ry="3.5"/><ellipse cx="-2.6" cy="-4" rx="2.4" ry="1.4" transform="rotate(35 -2.6 -4)"/><ellipse cx="2.6" cy="-4" rx="2.4" ry="1.4" transform="rotate(-35 2.6 -4)"/><circle cy="11.5" r=".65"/></g>`;
    }
    return `<svg class="lace-art" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".65" stroke-linecap="round" stroke-linejoin="round">${stitches}<path d="M0 6L200 150L400 6M0 8L200 152L400 8" stroke-width=".5"/><path d="M0 4L200 148L400 4" stroke-width=".35" stroke-dasharray=".6 1.5"/></g></svg>`;
  },
  applyAppearance(layer,settings,name){
    const options={...this.defaults,...settings};
    for(const [key,variable] of [['envelope_color','--paper'],['seal_color','--wax'],['paper_color','--card']]){
      const value=/^#[0-9a-f]{6}$/i.test(options[key])?options[key]:this.defaults[key];
      layer.style.setProperty(variable,value);
    }
    const card=options.paper_color;
    const rgb=/^#[0-9a-f]{6}$/i.test(card)?[1,3,5].map(i=>parseInt(card.slice(i,i+2),16)):[255,253,247];
    layer.style.setProperty('--card-ink',rgb[0]*.299+rgb[1]*.587+rgb[2]*.114<145?'#f5eee2':'#403c35');
    layer.dataset.texture=options.envelope_texture;
    layer.dataset.pattern=options.envelope_pattern;
    if(options.envelope_pattern==='lace'){for(const selector of ['.envelope-flap','.envelope-pocket']){const part=layer.querySelector(selector);if(part)part.innerHTML=this.laceArtwork();}}
    const motif=options.seal_motif==='heart'?'♡':options.seal_motif==='monogram'?String(name||'L').split(/\s*(?:&|ve|and)\s*|\s+/i).filter(Boolean).slice(0,2).map(part=>Array.from(part)[0]).join('').toLocaleUpperCase('tr-TR'):'❦';
    layer.querySelector('.wax-seal>span').textContent=motif;
    layer.querySelector('.wax-seal').dataset.motif=options.seal_motif;
  },
  close(){clearTimeout(this.timer);this.layer?.remove();this.layer=null;document.documentElement.classList.remove('envelope-locked');document.getElementById('invitation').inert=false;},
  show({name,date,appearance,onOpen}){
    this.close();
    const invitation=document.getElementById('invitation');
    invitation.inert=true;
    document.documentElement.classList.add('envelope-locked');
    const layer=document.createElement('section');this.layer=layer;
    layer.className='envelope-intro';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','Davetiyeniz hazır');
    layer.innerHTML='<div class="envelope-heading"><span>SİZİN İÇİN, SEVGİYLE</span><h1>Bir davetiniz var.</h1><p>Bazı anlar, birlikte güzel.</p></div><button type="button" class="envelope-touch" aria-label="Mührü aç ve davetiyeyi görüntüle"><span class="envelope-body"><span class="envelope-letter"><span class="letter-kicker">BİRLİKTE KUTLAYALIM</span><strong class="letter-names"></strong><span class="letter-date"></span><span class="letter-flower">❦</span></span><span class="envelope-pocket"></span><span class="envelope-flap"></span><span class="wax-seal"><span>❦</span></span></span></button><p class="envelope-hint" aria-live="polite">Açmak için mühüre dokunun</p>';
    this.applyAppearance(layer,appearance,name);
    layer.querySelector('.letter-names').textContent=name;
    layer.querySelector('.letter-date').textContent=date&&!Number.isNaN(new Date(date).getTime())?new Date(date).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}):'';
    const finish=()=>{this.close();const heading=invitation.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}};
    let opened=false;
    const open=()=>{if(opened)return;opened=true;onOpen?.();if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}layer.classList.add('is-opening');layer.querySelector('.envelope-touch').disabled=true;layer.querySelector('.envelope-hint').textContent='Davetiyeniz açılıyor…';this.timer=setTimeout(finish,3600)};
    layer.querySelector('.envelope-touch').onclick=e=>{if(e.detail===0||e.target.closest('.wax-seal'))open()};
    layer.onkeydown=e=>{if(['Tab','Escape','PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();}};
    document.body.appendChild(layer);layer.querySelector('.envelope-touch').focus();
  }
};
