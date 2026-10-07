/* Invitation checklist: saved progress comes from the event, never from browser storage. */
window.LumaInvitationProgress={
  steps:[
    {key:'appearance',title:'Davetiye görünümü',help:'Görünümü incele, bölümün sonundaki “Bu adımı tamamla” düğmesine bas ve davetiyeyi kaydet.',target:'.opening-style-panel'},
    {key:'colors',title:'Davetiye renkleri',help:'Renkleri incele, bölümün sonundaki “Bu adımı tamamla” düğmesine bas ve davetiyeyi kaydet.',target:'.invitation-colors-panel'},
    {key:'date',title:'Tarih ve saat',help:'Etkinlik tarihini ve saatini seç. Bu bilgi geri sayımda ve davetiyede görünür.',target:'#eventDateInput'},
    {key:'details',title:'Temel bilgiler',help:'Etkinlik / ev sahibi adını ve mekân ya da şehir/konum alanlarından en az birini doldur.',target:'.content-editor-panel'}
  ],
  init(){
    const section=document.createElement('section');section.className='invitation-progress';section.setAttribute('aria-labelledby','invitationProgressTitle');
    section.innerHTML='<div class="invitation-progress-head"><div><h2 id="invitationProgressTitle">Davetiyeni adım adım hazırla</h2><p>Bu dört temel adımı tamamla. Müzik, sticker ve sergi fotoğrafları isteğe bağlıdır.</p></div><strong id="invitationProgressCount" aria-live="polite"></strong></div><div class="invitation-progress-track" role="progressbar" aria-label="Davetiye hazırlık ilerlemesi" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0"><span></span></div><div id="invitationProgressSteps" class="invitation-progress-steps"></div><p class="invitation-progress-note">İlerleme, “Değişiklikleri Kaydet” düğmesine bastığında hesabında saklanır.</p>';
    document.querySelector('#inviteEditorView .editor-heading').after(section);this.element=section;
    const rows=section.querySelector('#invitationProgressSteps');
    for(const [index,step] of this.steps.entries()){
      const card=document.createElement('article');card.className='invitation-progress-step';card.dataset.step=step.key;
      card.innerHTML=`<div class="invitation-progress-step-top"><span class="invitation-progress-number">${index+1}</span><strong>${step.title}</strong><small></small></div><p>${step.help}</p><button type="button">Bu adıma git →</button>`;
      card.querySelector('button').onclick=()=>{const target=document.querySelector(step.target)?.closest('.editor-panel')||document.querySelector(step.target);if(!target)return;window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-94,behavior:'smooth'});target.querySelector('select,input,button')?.focus({preventScroll:true})};
      rows.appendChild(card);
    }
    for(const step of this.steps.filter(step=>step.key==='appearance'||step.key==='colors')){
      const panel=document.querySelector(step.target);
      const button=document.createElement('button');button.type='button';button.className='progress-confirm';button.dataset.confirm=step.key;
      button.onclick=()=>{LumaPresentation.confirmations[step.key]=true;this.dirty[step.key]=true;this.render()};
      panel.appendChild(button);
    }
    this.dirty={};
    const form=document.getElementById('inviteEditorForm');
    form.addEventListener('input',event=>this.handleEdit(event));form.addEventListener('change',event=>this.handleEdit(event));
    document.getElementById('contentTheme').addEventListener('change',()=>{LumaPresentation.confirmations.colors=false;this.dirty.colors=true;this.render()});
    document.getElementById('resetInvitationColors').addEventListener('click',()=>{LumaPresentation.confirmations.colors=false;this.dirty.colors=true;this.render()});
    this.render();
  },
  handleEdit(event){
    if(event.target.closest('.opening-style-panel')){LumaPresentation.confirmations.appearance=false;this.dirty.appearance=true}
    if(event.target.closest('.invitation-colors-panel')){LumaPresentation.confirmations.colors=false;this.dirty.colors=true}
    if(event.target.id==='eventDateInput')this.dirty.date=true;
    if(['contentCoupleNames','contentVenue','contentLocation'].includes(event.target.id))this.dirty.details=true;
    this.render();
  },
  markSaved(){this.dirty={};this.render()},
  state(inv,meta){
    const presentation=inv?.presentation||{},saved=presentation.editor_saved===true,date=inv?.event_date;
    const appearance=saved&&(presentation.appearance_confirmed===true||inv.opening_style==='envelope'||presentation.paper_style&&presentation.paper_style!=='none'||presentation.button_radius!=null);
    const colors=saved&&(presentation.colors_confirmed===true||inv.design_theme&&inv.design_theme!=='romantic'||Object.keys(inv.palette||{}).length>0);
    return {appearance:Boolean(appearance),colors:Boolean(colors),date:Boolean(saved&&date&&!Number.isNaN(new Date(date).getTime())),details:Boolean(saved&&(inv?.name||'').trim()&&((inv?.venue||'').trim()||(inv?.city||'').trim()))};
  },
  draftState(){
    const date=document.getElementById('eventDateInput').value,name=document.getElementById('contentCoupleNames').value.trim(),venue=document.getElementById('contentVenue').value.trim(),city=document.getElementById('contentLocation').value.trim();
    return {appearance:Boolean(LumaPresentation.confirmations.appearance||document.getElementById('openingStyle').value==='envelope'||LumaPresentation.readEditor().paper_style!=='none'||LumaPresentation.readEditor().button_radius!=null),colors:Boolean(LumaPresentation.confirmations.colors||document.getElementById('contentTheme').value!=='romantic'||Object.keys(LumaInvitationColors.readEditor()).length),date:Boolean(date&&!Number.isNaN(new Date(date).getTime())),details:Boolean(name&&(venue||city))};
  },
  displayState(saved,draft,dirty){return Object.fromEntries(this.steps.map(step=>[step.key,dirty?.[step.key]?draft[step.key]:saved[step.key]]))},
  render(){
    if(!this.element)return;
    const freshDraft=typeof guestDraftPending!=='undefined'&&guestDraftPending;
    const inv=freshDraft?null:window.LumaEventData?.cache?.invitation,meta=freshDraft?null:typeof currentEventMeta==='function'?currentEventMeta():null,saved=this.state(inv,meta),draft=this.draftState(),display=this.displayState(saved,draft,this.dirty);
    const done=this.steps.filter(step=>display[step.key]).length;
    this.element.querySelector('#invitationProgressCount').textContent=`${done} / ${this.steps.length} tamamlandı`;
    const track=this.element.querySelector('[role=progressbar]');track.setAttribute('aria-valuenow',String(done));track.querySelector('span').style.width=`${done/this.steps.length*100}%`;
    for(const step of this.steps){
      const card=this.element.querySelector(`[data-step=${step.key}]`),status=card.querySelector('small');
      card.classList.toggle('complete',display[step.key]);
      status.textContent=display[step.key]?(this.dirty?.[step.key]||!saved[step.key]?'Tamamlandı · Kaydet':'Tamamlandı'):'Yapılacak';
    }
    for(const key of ['appearance','colors']){
      const button=document.querySelector(`[data-confirm=${key}]`);
      button.textContent=LumaPresentation.confirmations[key]?'Adım tamamlandı ✓':'Bu adımı tamamla';
      button.setAttribute('aria-pressed',String(LumaPresentation.confirmations[key]));
    }
  }
};
