/* Local mobile composition preview. No uploads or API writes. */
window.LumaEditorPreview={
  init(){
    const form=document.getElementById('inviteEditorForm'),layout=document.createElement('div');layout.className='editor-preview-layout';form.before(layout);layout.appendChild(form);
    const aside=document.createElement('aside');aside.className='editor-mobile-preview';aside.innerHTML=`<div class="editor-preview-title"><strong>Mobil önizleme</strong><small>Değişiklikler anında görünür</small><p id="previewStageBadge" class="preview-stage-badge" aria-live="polite"></p></div><label class="editor-field"><span>GÖSTERİLEN ALAN</span><select id="mobilePreviewSection"><option value="opening-envelope">İlk açılış · Mühürlü zarf</option><option value="opening-gatefold">İkinci açılış · Kurdeleli kapak</option><option value="inviteHero" selected>Kapak</option><option value="story">Hikâye</option><option value="inviteCountdown">Geri sayım</option><option value="details">Etkinlik detayları</option><option value="exhibition">Fotoğraf sergisi</option><option value="memories">Anı bölümü</option></select></label><div class="editor-phone"><iframe title="Davetiyenin canlı mobil yerleşim önizlemesi" sandbox="allow-same-origin"></iframe></div><p>Görsellerin konumunu ve boyutunu kaydetmeden incele. Kaydırma animasyonlarını üstteki Canlı önizleme düğmesinden deneyebilirsin.</p>`;
    layout.appendChild(aside);this.layoutQuery=matchMedia('(max-width:850px)');const place=()=>{if(this.layoutQuery.matches)document.querySelector('.visual-editor').before(aside);else layout.appendChild(aside);this.schedule()};this.layoutQuery.addEventListener('change',place);place();this.frame=aside.querySelector('iframe');
    const css=[...document.querySelectorAll('link[rel=stylesheet]')].map(link=>`<link rel="stylesheet" href="${link.href.replaceAll('"','&quot;')}">`).join('');
    this.frame.srcdoc=`<!doctype html><html lang="tr"><head><meta name="viewport" content="width=device-width,initial-scale=1">${css}<style>html,body{margin:0;min-width:0;width:390px;height:780px;overflow:hidden}#invitation{display:block!important;position:relative!important;inset:auto!important;width:390px;height:780px;overflow-y:auto;overflow-x:hidden}#closeInvite,#musicBtn,audio{display:none!important}button,[data-modal]{pointer-events:none}.visual-frame{transform:none!important;opacity:1!important;clip-path:none!important}</style></head><body></body></html>`;
    this.frame.onload=()=>{this.ready=true;this.schedule()};
    for(const event of ['input','change'])form.addEventListener(event,e=>{const row=e.target.closest('.visual-editor-row');if(row){const item=LumaVisualLayers.items[Number(row.dataset.index)];if(item){this.focusedPosition=item.position;const section={'hero-background':'inviteHero','hero-foreground':'inviteHero','invitation-background':'inviteHero','sticker-story':'story','story-background':'story','sticker-details':'details','details-background':'details','sticker-memories':'memories','memories-background':'memories','sticker-exhibition':'exhibition','exhibition-background':'exhibition'}[item.position]||(!LumaVisualLayers.isBackground(item)?'exhibition':null);if(section)document.getElementById('mobilePreviewSection').value=section}}this.schedule()});
    document.getElementById('mobilePreviewSection').onchange=()=>{this.following=true;this.render()};
    // Follow what is being edited: envelope settings show the envelope (ribbon and cover colours the
    // ribbon cover), everything else shows the invitation, at the part a colour belongs to.
    for(const event of ['focusin','input'])form.addEventListener(event,e=>{const section=this.sectionFor(e.target);if(section)this.showSection(section)});
    this.observer=new MutationObserver(()=>this.schedule());this.observer.observe(document.getElementById('inviteEditorView'),{attributes:true,attributeFilter:['class']});
  },
  STAGE_LABELS:{envelope:'1. aşama · Zarf ve açılış',invitation:'2. aşama · Davetiye'},
  COLOR_SECTIONS:{hero_text:'inviteHero',details_background:'details',memory_background:'memories',memory_text:'memories',badge_background:'memories',badge_text:'memories',button_background:'inviteHero',button_text:'inviteHero',countdown_background:'inviteCountdown',countdown_text:'inviteCountdown',heading:'story',text:'story'},
  sectionFor(target){
    if(!target?.closest||target.closest('.visual-editor-row'))return null;
    const current=document.getElementById('mobilePreviewSection').value;
    if(target.closest('.opening-style-panel')){
      if(target.id==='openingStyle'&&target.value!=='envelope')return 'inviteHero';
      if(document.getElementById('openingStyle').value!=='envelope')return null;
      return ['paper_color','paper_color_hex','ribbon_color','ribbon_color_hex'].includes(target.id)||target.matches('[data-presentation=opening_hand]')?'opening-gatefold':'opening-envelope';
    }
    if(target.closest('.invitation-colors-panel')){
      const key=target.dataset.paletteColor||(target.id||'').replace(/^palette_/,'').replace(/_hex$/,'');
      return this.COLOR_SECTIONS[key]||(current.startsWith('opening-')?'inviteHero':null);
    }
    if(target.closest('.editor-panel'))return current.startsWith('opening-')?'inviteHero':null;
    return null;
  },
  showSection(section){
    const select=document.getElementById('mobilePreviewSection');
    if(select.value===section)return;
    select.value=section;this.following=true;this.render();
  },
  updateStageBadge(){
    const badge=document.getElementById('previewStageBadge');if(!badge)return;
    const envelope=document.getElementById('mobilePreviewSection').value.startsWith('opening-');
    badge.textContent=this.STAGE_LABELS[envelope?'envelope':'invitation'];badge.dataset.stage=envelope?'1':'2';
  },
  schedule(){clearTimeout(this.timer);this.timer=setTimeout(()=>this.render(),120)},
  render(){
    this.updateStageBadge();
    if(!this.ready||document.getElementById('inviteEditorView').classList.contains('hidden'))return;
    const original=document.getElementById('invitation');if(!original.classList.contains('hidden'))return;
    const data=invitationContentFromForm();applyInvitationContent(data);
    if(dateInput.value){const date=new Date(dateInput.value);if(!Number.isNaN(date.getTime()))updateDateContent(date)}
    const doc=this.frame.contentDocument,old=doc.getElementById('invitation'),scroll=old?.scrollTop||0,clone=original.cloneNode(true);clone.classList.remove('hidden');clone.removeAttribute('inert');clone.setAttribute('aria-hidden','false');clone.querySelectorAll('audio,#closeInvite,#musicBtn,.background-motion-viewport').forEach(el=>el.remove());
    if(document.body.classList.contains('guest-draft'))clone.querySelectorAll('.rsvp-nav,.hero-rsvp,#calendarBtn,#uploadDisabledNote,#watchSlideshowBtn').forEach(el=>el.remove());
    clone.querySelectorAll('*').forEach(el=>{for(const attribute of [...el.attributes])if(attribute.name.startsWith('on'))el.removeAttribute(attribute.name)});
    const section=document.getElementById('mobilePreviewSection').value;
    if(section.startsWith('opening-')){
      const opening=LumaCeremony.buildLayer({name:data.names,date:dateInput.value,appearance:LumaEnvelope.readEditor()});
      opening.removeAttribute('aria-modal');opening.querySelector('.opening-instruction').remove();
      const first=section==='opening-envelope';opening.querySelector(first?'.s2-stage':'.s1-stage').remove();
      opening.style.position='absolute';opening.style.inset='0';opening.style.overflow='hidden';
      opening.querySelector('.opening-track').style.height='100%';opening.querySelector('.opening-scene').style.cssText='position:absolute;inset:0;width:100%;height:100%';
      opening.querySelectorAll('.door-tail').forEach(el=>el.style.visibility='hidden');
      doc.body.replaceChildren(clone,opening);this.lastSection=section;this.following=false;return;
    }
    doc.body.replaceChildren(clone);clone.scrollTo({top:scroll,behavior:'instant'});
    if(this.following||this.lastSection!==document.getElementById('mobilePreviewSection').value)this.goToSection();
  },
  goToSection(){
    if(!this.ready)return;const doc=this.frame.contentDocument,section=document.getElementById('mobilePreviewSection').value,target=section==='exhibition'?(doc.querySelector(`.visual-slot[data-position="${this.focusedPosition}"]`)||doc.querySelector('.visual-slot')):(doc.getElementById(section)?.classList.contains('hidden')?doc.getElementById('details'):doc.getElementById(section));if(!target)return;
    const scroller=doc.getElementById('invitation');
    scroller.scrollTo({top:scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top,behavior:'instant'});
    this.lastSection=section;this.following=false;
  }
};
