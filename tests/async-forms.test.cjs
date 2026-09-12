const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/main.js'),'utf8');
for(const id of ['addGuestForm','contactForm','passwordChangeForm']){
  test(`${id} preserves the form after asynchronous submission`,async()=>{
    let resets=0;
    const form={currentPassword:{value:'Previous123!'},newPassword:{value:'NextPass123!'},confirmPassword:{value:'NextPass123!'},reset(){resets++},querySelector(){return {disabled:false,textContent:''}}};
    const event={currentTarget:form,preventDefault(){}};
    const elements=new Proxy({}, {get:(_,key)=>key===id?form:{value:'test@example.com'}});
    const context={document:{getElementById:key=>elements[key]},normalizedEmail:value=>value,
      ensureEventToken:async()=> 'test-token',LumaEventData:{changePassword:async()=>{},createGuest:async()=>({}),createContact:async()=>({})},
      changeAdminPassword:async()=>{},refreshGuestViews:async()=>{},refreshActivities:async()=>{},
      upsertContact(){},toast(message){assert(!/null|reset/.test(message),message)}};
    const line=source.split('\n').find(line=>line.startsWith(`document.getElementById('${id}').onsubmit=`));
    vm.runInNewContext(line,context);
    const pending=form.onsubmit(event);
    event.currentTarget=null;
    await pending;
    assert.equal(resets,1);
  });
}
for(const scenario of ['recover','empty','expired','unavailable']){
 test(`invitation save: ${scenario}`,async()=>{
  const messages=[],saved=[];
  const button={disabled:false,textContent:'Kaydet'},form={querySelector:()=>button};
  const start=source.indexOf("document.getElementById('inviteEditorForm').onsubmit=");
  const handler=source.slice(start,source.indexOf('\nfunction eventDateFor',start));
  const context={document:{getElementById:()=>form},sessionStorage:{getItem:()=>scenario==='expired'?null:'jwt',setItem(){}},window:{},eventList:()=>[],setupEventSwitcher(){},
   invitationContentFromForm:()=>({names:'Test',location:'İstanbul'}),dateInput:{value:'2026-10-01T18:00'},
   pendingCover:'cover-url',pendingMusicFile:undefined,removePendingMusic:false,defaultCover:'default',
   ensureEventToken:async()=>['empty','unavailable'].includes(scenario)?'':'recovered-token',currentEventMeta:()=>({name:'Test'}),
   eventSyncError:scenario==='unavailable'?'Bağlantı kurulamadı':'',LumaEventData:{createEvent:async()=>({id:'new',private_token:'created-token'}),saveInvitation:async(...args)=>saved.push(args)},
   loadSavedMusic:async()=>{},updateDateContent(){},applyInvitationContent(){},updateStorageCard(){},updateDashboard(){},toast:m=>messages.push(m)};
  vm.runInNewContext(handler,context);
  await form.onsubmit({preventDefault(){},currentTarget:form});
  assert.equal(button.disabled,false);
  if(['recover','empty'].includes(scenario)){assert.equal(saved[0][0],scenario==='empty'?'created-token':'recovered-token');assert.equal(saved[0][1].names,'Test')}
  else{assert.equal(saved.length,0);assert.match(messages[0],scenario==='unavailable'?/Bağlantı/:/giriş/)}
 });
}
