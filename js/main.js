const icons={grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',qr:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',eye:'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',chevron:'<polyline points="6 9 12 15 18 9"/>',menu:'<path d="M3 12h18M3 6h18M3 18h18"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',check:'<path d="m20 6-11 11-5-5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',userplus:'<path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 11a4 4 0 1 0 0-8M19 8v6M22 11h-6"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',sparkle:'<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5zM19 3v4M21 5h-4"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icons[el.dataset.icon]||icons.heart;el.setAttribute('viewBox','0 0 24 24');el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');el.setAttribute('stroke-linecap','round');el.setAttribute('stroke-linejoin','round')});

const { escapeHtml, trDate, toast } = Luma;
const dashboard=document.getElementById('dashboard'), invitation=document.getElementById('invitation'), sidebar=document.querySelector('.sidebar');
function openInvitation(){invitation.classList.remove('hidden');invitation.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';invitation.scrollTop=0;playInvitationMusic()}
function closeInvitation(){invitation.classList.add('hidden');invitation.setAttribute('aria-hidden','true');document.body.style.overflow='';if(typeof invitationAudio!=='undefined')invitationAudio.pause()}
document.getElementById('previewBtn').onclick=openInvitation;document.getElementById('closeInvite').onclick=closeInvitation;document.getElementById('openInvite').onclick=openInvitation;
document.getElementById('menuBtn').onclick=()=>sidebar.classList.toggle('open');

const labels={invite:['Davetiye','Temanızı, içerikleri ve müziği canlı önizleme ile düzenleyin.'],guests:['Misafirler','Katılım cevaplarını ve toplam kişi sayısını tek yerden yönetin.'],gallery:['Galeri','Misafirlerinizin yüklediği fotoğraf ve videolar burada toplanır.'],guestbook:['Anı Defteri','Sevdiklerinizin bıraktığı yazılı, sesli ve görüntülü mesajları okuyun.'],qr:['QR Kodlar','Fotoğraf yükleme QR kodunuzu indirin ve baskıya hazırlayın.'],settings:['Ayarlar','Hesap, etkinlik tercihleri ve planınızı yönetin.']};
function showView(view){
  if(['overview','invite','guests','gallery','guestbook','qr','settings','profile'].includes(view))sessionStorage.setItem('lumaAdminView',view);
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
  document.getElementById('overviewView').classList.toggle('hidden',view!=='overview');
  document.getElementById('inviteEditorView').classList.toggle('hidden',view!=='invite');
  document.getElementById('guestsView').classList.toggle('hidden',view!=='guests');
  document.getElementById('galleryView').classList.toggle('hidden',view!=='gallery');
  document.getElementById('guestbookView').classList.toggle('hidden',view!=='guestbook');
  document.getElementById('qrView').classList.toggle('hidden',view!=='qr');
  document.getElementById('settingsView').classList.toggle('hidden',view!=='settings');
  document.getElementById('profileView').classList.toggle('hidden',view!=='profile');
  document.getElementById('placeholderView').classList.toggle('hidden',['overview','invite','guests','gallery','guestbook','qr','settings','profile'].includes(view));
  if(view==='guests')renderGuestTable();
  if(view==='gallery')LumaGallery.renderAdminGallery();
  if(view==='guestbook')renderAdminMessages();
  if(view==='settings')loadEventSettingsForm();
  if(view==='profile'){renderProfile();loadContacts().catch(()=>{})}
  if(view==='qr')LumaQr.render();
  if(!['overview','invite','guests','gallery','guestbook','settings','profile'].includes(view)){document.getElementById('emptyTitle').textContent=labels[view][0];document.getElementById('emptyText').textContent=labels[view][1];document.getElementById('openInvite').style.display='none'}
  sidebar.classList.remove('open');
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));document.getElementById('backOverview').onclick=()=>showView('overview');

const modal=document.getElementById('modal'), content=document.getElementById('modalContent');
const modalTemplates={rsvp:`<p class="invite-kicker">KATILIM BİLDİR</p><h2>Sizi aramızda görecek miyiz?</h2><p>Yanıtınız hazırlıklarımızı kusursuzlaştırmamıza yardımcı olacak.</p><form id="rsvpForm" class="form-grid"><div class="field full"><label>AD SOYAD</label><input required placeholder="Adınız ve soyadınız"></div><div class="field full"><label>KATILIM DURUMU</label><div class="choice-row"><label><input type="radio" name="status" checked>Katılacağım</label><label><input type="radio" name="status">Katılamayacağım</label><label><input type="radio" name="status">Henüz emin değilim</label></div></div><div class="field"><label>KİŞİ SAYISI</label><select><option>1 kişi</option><option>2 kişi</option><option>3 kişi</option><option>4+ kişi</option></select></div><div class="field"><label>E-POSTA (İSTEĞE BAĞLI)</label><input type="email" placeholder="ornek@email.com"></div><div class="field full"><label>EK NOT</label><textarea placeholder="Alerji, ulaşım veya bize iletmek istediğiniz bir not..."></textarea></div><button class="submit-btn">Yanıtımı Gönder</button></form>`,upload:`<p class="invite-kicker">ANI PAYLAŞ</p><h2>Fotoğraflarını bizimle paylaş 💌</h2><p>Etkinlikte çektiğin fotoğrafları güvenle yükleyebilirsin. Aynı anda birden fazla fotoğraf seçebilir veya tek tek ekleyebilirsin.</p><form id="uploadForm" class="form-grid"><label class="dropzone field full"><i data-icon="upload"></i><p>Fotoğraf ekle</p><small>Birden fazla seçilebilir · JPG, PNG, WebP, HEIC · Her biri en fazla 15 MB</small><input id="fileInput" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif" hidden></label><div class="field full"><label>AÇIKLAMA (İSTEĞE BAĞLI)</label><textarea placeholder="Bu güzel an hakkında birkaç kelime..."></textarea></div><button class="submit-btn">Gönder</button></form>`,message:`<p class="invite-kicker">ANI DEFTERİ</p><h2>Bize bir not bırak.</h2><p>Yıllar sonra yeniden okumaktan mutluluk duyacağımız birkaç güzel kelime...</p><form id="messageForm" class="form-grid"><div class="field full"><label>AD SOYAD</label><input required placeholder="Adınız ve soyadınız"></div><div class="field full"><label>MESAJINIZ</label><textarea required placeholder="Bir ömür boyu mutluluklar..." style="min-height:130px"></textarea></div><button class="submit-btn">Mesajı Bırak ♡</button></form>`};
modalTemplates.event=`<p class="invite-kicker">YENİ ETKİNLİK</p><h2>Yeni bir etkinlik oluştur.</h2><p>Temel bilgileri girin. Etkinlik oluşturulduğunda aktif olarak seçilecektir.</p><form id="eventForm" class="form-grid"><div class="field full"><label>ETKİNLİK ADI</label><input name="eventName" required placeholder="Örn. Melisa & Berk Düğünü"></div><div class="field"><label>TARİH VE SAAT</label><input name="eventDate" type="datetime-local" required></div><div class="field"><label>MEKÂN</label><input name="eventVenue" required placeholder="Örn. Esma Sultan Yalısı"></div><div class="field full"><label>ŞEHİR</label><input name="eventCity" required placeholder="Örn. İstanbul"></div><button class="submit-btn">Etkinliği Oluştur</button></form>`;
const defaultEvent={id:'',slug:'',private_token:'',name:'Etkinlik yükleniyor...',date:null,venue:'',city:''};
function eventList(){return window._lumaEvents||[]}
function isAdminPanelRoute(){return !LumaConfig.publicEventToken()}
function currentEventId(){
  if(sessionStorage.getItem('lumaAdminJwt')&&isAdminPanelRoute())return sessionStorage.getItem('lumaActiveEventSlug')||eventList()[0]?.id||'';
  const publicToken=LumaConfig.publicEventToken();
  if(publicToken){const match=eventList().find(item=>item.private_token===publicToken);if(match)return match.id}
  return sessionStorage.getItem('lumaActiveEventSlug')||eventList()[0]?.id||'';
}
function currentEventMeta(){return eventList().find(item=>item.id===currentEventId())||defaultEvent}
function currentEventToken(){
  if(sessionStorage.getItem('lumaAdminJwt')&&isAdminPanelRoute())return currentEventMeta().private_token||'';
  const publicToken=LumaConfig.publicEventToken();
  if(publicToken)return publicToken;
  return currentEventMeta().private_token||'';
}
async function switchActiveEvent(eventId,{toastMessage=''}={}){
  const events=eventList(),selected=events.find(item=>item.id===eventId);
  if(!selected)return false;
  sessionStorage.setItem('lumaActiveEventSlug',selected.id);
  await refreshEventData();
  hydrateEventUI();
  updateDashboard();
  renderGuestTable();
  if(!document.getElementById('galleryView').classList.contains('hidden'))LumaGallery.renderAdminGallery();
  if(!document.getElementById('qrView').classList.contains('hidden'))LumaQr.render();
  if(!document.getElementById('profileView').classList.contains('hidden'))renderProfile();
  toast(toastMessage||`"${selected.name}" etkinliğine geçildi.`);
  return true;
}
window.switchActiveEvent=switchActiveEvent;
window.currentEventMeta=currentEventMeta;
LumaConfig.getEventToken=currentEventToken;
let _eventsSyncPromise=null;
async function syncBackendEvents(){
  if(_eventsSyncPromise)return _eventsSyncPromise;
  _eventsSyncPromise=_syncBackendEventsImpl().finally(()=>{_eventsSyncPromise=null});
  return _eventsSyncPromise;
}
async function _syncBackendEventsImpl(){
  try{
    await LumaEventData.migrateLegacyEventsOnce();
    const mapped=await LumaEventData.listEvents();
    if(!mapped.length)return false;
    window._lumaEvents=mapped;
    const activeSlug=sessionStorage.getItem('lumaActiveEventSlug');
    const matched=activeSlug?mapped.find(item=>item.id===activeSlug):null;
    const active=matched||mapped[0];
    if(!matched)sessionStorage.setItem('lumaActiveEventSlug',active.id);
    await refreshEventData();
    hydrateEventUI();
    if(!document.getElementById('qrView').classList.contains('hidden'))LumaQr.render();
    return Boolean(active?.private_token);
  }catch{return false}
}
window.syncBackendEvents=syncBackendEvents;
async function loginBackendAdmin(email,password){
  try{
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    if(response.status===401)return {ok:false,reason:'invalid'};
    if(response.status===429)return {ok:false,reason:'rate_limit'};
    if(!response.ok)return {ok:false,reason:'server'};
    const data=await response.json();
    sessionStorage.setItem('lumaAdminJwt',data.access_token);
    sessionStorage.setItem('lumaAdminSession',data.email||email);
    applyAdminProfile({email:data.email||email,display_name:data.display_name});
    const synced=await syncBackendEvents();
    return {ok:true,synced,profile:data};
  }catch{return {ok:false,reason:'network'}}
}
async function ensureEventToken(){
  const token=currentEventToken();
  if(token)return token;
  if(sessionStorage.getItem('lumaAdminJwt')){await syncBackendEvents();return currentEventToken()}
  return '';
}
window.ensureEventToken=ensureEventToken;
function scopedKey(base,id=currentEventId()){return `${base}:${id}`}
const emptyData={guests:[],uploads:0,messages:[],activities:[]};
function readData(){const data=LumaEventData.getData();data.uploads=readData._uploads||0;return {...emptyData,...data}}
async function refreshActivities(){const token=currentEventToken();if(!token||!sessionStorage.getItem('lumaAdminJwt'))return;await LumaEventData.fetchActivities(token);updateDashboard()}
async function refreshEventData(){
  const token=currentEventToken()||LumaConfig.publicEventToken();
  if(!token)return false;
  return LumaEventData.load(token,{admin:Boolean(sessionStorage.getItem('lumaAdminJwt'))});
}
window.refreshEventData=refreshEventData;
async function refreshGuestViews(){
  await refreshEventData();
  await syncPhotoCount();
  updateDashboard();
  renderGuestTable();
}
window.refreshGuestViews=refreshGuestViews;
async function syncPhotoCounts(){
  const token=currentEventToken()||LumaConfig.publicEventToken();
  if(!token)return readData._uploads||0;
  const isAdmin=Boolean(sessionStorage.getItem('lumaAdminJwt'))&&isAdminPanelRoute();
  try{
    if(isAdmin){
      const all=await LumaGallery.fetchPhotos(token,{admin:true});
      readData._uploads=all.length;
      readData._approvedUploads=all.filter(item=>item.status==='approved').length;
    }else{
      const approved=await LumaGallery.fetchPhotos(token,{admin:false});
      readData._approvedUploads=approved.length;
      readData._uploads=approved.length;
    }
    return readData._uploads;
  }catch{return readData._uploads||0}
}
async function syncPhotoCount(){return syncPhotoCounts()}
async function refreshPublicMemories(){
  await syncPhotoCounts();
  const token=currentEventToken()||LumaConfig.publicEventToken();
  if(token)await LumaGallery.renderPublicCollage(token);
  applyUploadVisibility();
  updateDashboard();
}
function applyUploadVisibility(){
  const enabled=LumaEventData.uploadsEnabled()&&currentEventMeta().uploads_enabled!==false;
  document.querySelectorAll('[data-upload-action]').forEach(button=>{
    button.classList.toggle('hidden',!enabled);
    button.disabled=!enabled;
  });
  const note=document.getElementById('uploadDisabledNote');
  if(note)note.classList.toggle('hidden',enabled);
}
function updateDashboard(){
  const data=readData(),groups={attending:0,declined:0,pending:0};
  data.guests.forEach(item=>groups[item.status]+=item.people||1);
  const total=groups.attending+groups.declined+groups.pending,percent=value=>total?Math.round(value/total*100):0,messageCount=data.messages.length;
  const adminPhotoCount=data.uploads,publicPhotoCount=readData._approvedUploads??adminPhotoCount;
  const adminMemories=adminPhotoCount+messageCount,publicMemories=publicPhotoCount+approvedMessageCount(data.messages);
  document.getElementById('totalGuestsStat').textContent=total;document.getElementById('attendingStat').textContent=groups.attending;document.getElementById('pendingStat').textContent=groups.pending;document.getElementById('memoriesStat').textContent=adminMemories;
  document.getElementById('totalGuestsNote').textContent=total?'Katılım formuna kaydedilen kişi sayısı':'Henüz davetli kaydı yok';document.getElementById('attendingNote').textContent=total?`Kayıtlı kişilerin %${percent(groups.attending)}'i`:'Henüz katılım yanıtı yok';document.getElementById('memoriesNote').textContent=adminMemories?`${adminPhotoCount} dosya · ${messageCount} mesaj`:'Henüz anı paylaşılmadı';
  document.getElementById('guestNavCount').textContent=total;document.getElementById('galleryNavCount').textContent=adminPhotoCount;document.getElementById('guestbookNavCount').textContent=messageCount;document.getElementById('publicMemoryCount').textContent=publicMemories;document.getElementById('albumSummary').textContent=adminPhotoCount?`${adminPhotoCount} gerçek dosya kaydı`:'Henüz yükleme yok';
  document.getElementById('rsvpTotalLabel').textContent=`Toplam ${total} kayıtlı kişi`;document.getElementById('totalPeopleLabel').textContent=`${total} kişi`;document.getElementById('companionLabel').textContent=total?'Katılım formlarındaki kişi sayısı dahil':'Kayıtlı refakatçi yok';document.getElementById('rsvpPercent').textContent=`${percent(groups.attending)}%`;
  [['Attending','attending'],['Declined','declined'],['Pending','pending']].forEach(([id,key])=>{document.getElementById(`legend${id}`).textContent=groups[key];document.getElementById(`legend${id}Percent`).textContent=`${percent(groups[key])}%`});
  const donut=document.getElementById('rsvpDonut'),a=percent(groups.attending),d=percent(groups.declined);donut.style.background=`conic-gradient(#628d72 0 ${a}%,#ae6d70 ${a}% ${a+d}%,#d5ae74 ${a+d}% 100%)`;donut.setAttribute('aria-label',`Yüzde ${a} katılım`);
  const list=document.getElementById('activityList');list.innerHTML=data.activities.length?data.activities.map(item=>`<div class="activity"><span class="activity-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${icons[item.kind]||icons.check}</svg></span><div><p>${escapeHtml(item.text)}</p><small>${trDate(new Date(item.created_at||item.time),{dateStyle:'short',timeStyle:'short'})}</small></div></div>`).join(''):'<div class="activity-empty">Henüz gerçek bir etkinlik hareketi yok.</div>';
  updateStorageCard();
}
function formatBytes(bytes){if(!bytes)return '0 KB';const units=['B','KB','MB','GB','TB'],index=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1),value=bytes/1024**index;return `${value.toLocaleString('tr-TR',{maximumFractionDigits:index>1?2:0})} ${units[index]}`}
async function updateStorageCard(){
  const label=document.getElementById('storageUsageLabel'),bar=document.getElementById('storageProgress');try{let usage=0,quota=0;if(navigator.storage?.estimate){const estimate=await navigator.storage.estimate();usage=estimate.usage||0;quota=estimate.quota||0}label.textContent=quota?`${formatBytes(usage)} / ${formatBytes(quota)} kullanılıyor`:`${formatBytes(usage)} uygulama verisi`;bar.style.width=`${quota?Math.min(100,usage/quota*100):0}%`}catch{label.textContent='Depolama bilgisi alınamadı';bar.style.width='0%'}
}
let activeGuestFilter='all';
const statusLabels={attending:'Gelecek',declined:'Gelmeyecek',pending:'Cevap bekleniyor'};
const messageStatusLabels={pending:'Onay bekliyor',approved:'Yayında',hidden:'Gizli'};
function approvedMessageCount(messages){return messages.filter(item=>!item.status||item.status==='approved').length}
function normalizedEmail(value){return value.trim().toLocaleLowerCase('tr-TR')}
function renderGuestTable(){
  const data=readData(),query=(document.getElementById('guestSearchInput').value||'').trim().toLocaleLowerCase('tr-TR');
  const counts={all:data.guests.length,attending:0,declined:0,pending:0,external:0};data.guests.forEach(g=>{counts[g.status]++;if(g.source==='external')counts.external++});
  ['All','Attending','Declined','Pending','External'].forEach(key=>document.getElementById(`filter${key}Count`).textContent=counts[key.toLowerCase()]);
  const visible=data.guests.filter(g=>(activeGuestFilter==='all'||g.status===activeGuestFilter||activeGuestFilter==='external'&&g.source==='external')&&(!query||`${g.name} ${g.email}`.toLocaleLowerCase('tr-TR').includes(query)));
  const body=document.getElementById('guestTableBody'),empty=document.getElementById('guestEmptyState');body.innerHTML=visible.map(g=>`<tr><td><div class="guest-identity"><strong>${escapeHtml(g.name)}</strong><small>${escapeHtml(g.email)}</small></div></td><td><span class="status-badge status-${g.status}">${statusLabels[g.status]}</span></td><td><span class="source-badge source-${g.source}">${g.source==='external'?'Davet linkinden':'Yönetici ekledi'}</span></td><td>${g.people||1}</td><td><div class="guest-row-actions"><button type="button" class="guest-edit" data-edit-guest="${g.id}">Düzenle</button><button type="button" class="guest-delete" data-delete-guest="${g.id}" aria-label="Misafiri sil">×</button></div></td></tr>`).join('');empty.classList.toggle('hidden',visible.length>0);
  body.querySelectorAll('[data-edit-guest]').forEach(button=>button.onclick=()=>openGuestEditor(readData().guests.find(guest=>guest.id===button.dataset.editGuest)));
  body.querySelectorAll('[data-delete-guest]').forEach(button=>button.onclick=async()=>{try{await LumaEventData.deleteGuest(currentEventToken(),button.dataset.deleteGuest);await refreshGuestViews();toast('Misafir listeden kaldırıldı.')}catch{toast('Misafir silinemedi.')}});
}
function openGuestEditor(guest){
  if(!guest)return;
  document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;
  content.innerHTML=`<p class="invite-kicker">MİSAFİR DÜZENLE</p><h2 id="guestEditTitle">Misafir</h2><p>Katılım durumunu, kişi sayısını veya iletişim bilgilerini güncelleyin.</p><form id="guestEditForm" class="form-grid"><div class="field full"><label>AD SOYAD</label><input name="guestName" required></div><div class="field full"><label>E-POSTA</label><input name="guestEmail" type="email" required></div><div class="field"><label>DURUM</label><select name="guestStatus"><option value="attending">Gelecek</option><option value="declined">Gelmeyecek</option><option value="pending">Cevap bekleniyor</option></select></div><div class="field"><label>KİŞİ SAYISI</label><input name="guestPeople" type="number" min="1" max="20" required></div><button class="submit-btn" type="submit">Kaydet</button></form>`;
  document.getElementById('guestEditTitle').textContent=guest.name;
  const form=document.getElementById('guestEditForm');
  form.guestName.value=guest.name;
  form.guestEmail.value=guest.email;
  form.guestStatus.value=guest.status;
  form.guestPeople.value=guest.people||1;
  modal.classList.remove('hidden');
  form.onsubmit=async e=>{
    e.preventDefault();
    const form=e.currentTarget;
    const token=currentEventToken();
    if(!token){toast('Etkinlik seçilmedi.');return}
    try{
      await LumaEventData.updateGuest(token,guest.id,{
        name:form.guestName.value.trim(),
        email:normalizedEmail(form.guestEmail.value),
        status:form.guestStatus.value,
        people:Number(form.guestPeople.value),
      });
      await refreshGuestViews();
      modal.classList.add('hidden');
      toast('Misafir bilgileri güncellendi.');
    }catch(err){toast(err?.message||'Misafir güncellenemedi.')}
  };
}
function loadEventSettingsForm(){
  const meta=currentEventMeta();
  const nameEl=document.getElementById('eventSettingsName');
  const activeEl=document.getElementById('eventSettingsActive');
  const uploadsEl=document.getElementById('eventSettingsUploads');
  const slugEl=document.getElementById('eventSettingsSlug');
  if(!nameEl||!meta?.private_token)return;
  nameEl.textContent=meta.name||'Etkinlik';
  activeEl.checked=meta.is_active!==false;
  uploadsEl.checked=meta.uploads_enabled!==false;
  slugEl.value=meta.slug||meta.id||'';
}
function formatIcsDate(date){
  return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
}
function escapeIcsText(value){
  return String(value||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
}
function downloadCalendarEvent(){
  const inv=LumaEventData.cache.invitation;
  const meta=currentEventMeta();
  const raw=inv?.event_date||meta.date;
  if(!raw){toast('Etkinlik tarihi ayarlanmamış. Davetiye editöründen tarih ekleyin.');return}
  const start=new Date(raw);
  if(Number.isNaN(start.getTime())){toast('Geçerli bir etkinlik tarihi bulunamadı.');return}
  const end=new Date(start.getTime()+3*3600000);
  const title=inv?.name||meta.name||'Etkinlik';
  const venue=inv?.venue||meta.venue||'';
  const city=inv?.city||meta.city||'';
  const location=[venue,city].filter(Boolean).join(', ');
  const token=currentEventToken()||LumaConfig.publicEventToken();
  const description=token?`Davetiye: ${LumaConfig.inviteUrl(token)}`:'';
  const uid=`luma-${meta.slug||meta.id||'event'}-${start.getTime()}@luma.planner`;
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Luma Planner//TR','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${formatIcsDate(new Date())}`,`DTSTART:${formatIcsDate(start)}`,`DTEND:${formatIcsDate(end)}`,`SUMMARY:${escapeIcsText(title)}`,location?`LOCATION:${escapeIcsText(location)}`:null,description?`DESCRIPTION:${escapeIcsText(description)}`:null,'END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n');
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download=`${(meta.slug||'etkinlik').replace(/[^a-z0-9-]+/gi,'-')}.ics`;
  link.click();
  URL.revokeObjectURL(url);
  toast('Takvim dosyası indirildi.');
}
document.getElementById('addGuestForm').onsubmit=async e=>{e.preventDefault();const name=document.getElementById('guestNameInput').value.trim(),email=normalizedEmail(document.getElementById('guestEmailInput').value);const token=await ensureEventToken();if(!token){toast('Misafir eklemek için önce giriş yapın ve üstten bir etkinlik seçin.');return}try{await LumaEventData.createGuest(token,{name,email,status:'pending',people:1,source:'admin'});e.currentTarget.reset();await refreshGuestViews();await refreshActivities();toast('Misafir eklendi ve cevap bekleniyor listesine alındı.')}catch(err){toast(err.message||'Misafir eklenemedi.')}};
document.querySelectorAll('#guestFilters [data-filter]').forEach(button=>button.onclick=()=>{activeGuestFilter=button.dataset.filter;document.querySelectorAll('#guestFilters button').forEach(x=>x.classList.toggle('active',x===button));renderGuestTable()});
document.getElementById('guestSearchInput').addEventListener('input',renderGuestTable);
document.getElementById('copyInviteLinkBtn').onclick=async()=>{const link=LumaConfig.inviteUrl(currentEventToken());try{await navigator.clipboard.writeText(link);toast('Bu etkinliğe özel davet bağlantısı kopyalandı.')}catch{window.prompt('Etkinliğe özel davet bağlantısını kopyalayın:',link)}};
window.onGalleryPhotoDeleted=async()=>{readData._uploads=Math.max(0,(readData._uploads||0)-1);readData._approvedUploads=Math.max(0,(readData._approvedUploads||0)-1);updateDashboard();if(!invitation.classList.contains('hidden'))await LumaGallery.renderPublicCollage(currentEventToken()||LumaConfig.publicEventToken())};
window.onGalleryPhotoUpdated=async()=>{await syncPhotoCounts();updateDashboard();if(!invitation.classList.contains('hidden'))await LumaGallery.renderPublicCollage(currentEventToken()||LumaConfig.publicEventToken())};
function openMessageDetail(id){const item=readData().messages.find(message=>message.id===id);if(!item)return;document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;content.innerHTML=`<div class="message-detail"><div class="message-detail-mark">“</div><blockquote>${escapeHtml(item.message)}</blockquote><div class="message-detail-meta"><strong>${escapeHtml(item.name)}</strong><small>${trDate(new Date(item.created_at||item.createdAt),{dateStyle:'long',timeStyle:'short'})}</small></div></div>`;modal.classList.remove('hidden')}
function renderAdminMessages(){
  const data=readData(),list=document.getElementById('adminMessageList'),empty=document.getElementById('adminMessageEmpty');
  list.innerHTML=data.messages.slice().reverse().map(item=>{
    const status=item.status||'approved';
    return `<article class="admin-message-card" data-view-message="${item.id}" tabindex="0" role="button" aria-label="${escapeHtml(item.name)} tarafından bırakılan mesajı aç"><blockquote>“${escapeHtml(item.message)}”</blockquote><div class="admin-message-meta"><div><strong>${escapeHtml(item.name)}</strong><small><span class="photo-status-badge status-${escapeHtml(status)}">${messageStatusLabels[status]||status}</span> · ${trDate(new Date(item.created_at||item.createdAt),{dateStyle:'short',timeStyle:'short'})}</small></div><div class="message-actions">${status!=='approved'?`<button type="button" class="photo-action approve" data-approve-message="${item.id}">Onayla</button>`:''}${status!=='hidden'?`<button type="button" class="photo-action hide" data-hide-message="${item.id}">Gizle</button>`:''}<button type="button" class="manager-delete" data-delete-message="${item.id}">Sil</button></div></div></article>`;
  }).join('');
  empty.classList.toggle('hidden',data.messages.length>0);
  list.querySelectorAll('[data-view-message]').forEach(card=>{card.onclick=e=>{if(e.target.closest('button'))return;openMessageDetail(card.dataset.viewMessage)};card.onkeydown=e=>{if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openMessageDetail(card.dataset.viewMessage)}}});
  list.querySelectorAll('[data-approve-message]').forEach(button=>button.onclick=async e=>{e.stopPropagation();try{await LumaEventData.updateMessage(currentEventToken(),button.dataset.approveMessage,{status:'approved'});await refreshEventData();await refreshPublicMemories();renderAdminMessages();toast('Mesaj onaylandı.')}catch{toast('Mesaj onaylanamadı.')}});
  list.querySelectorAll('[data-hide-message]').forEach(button=>button.onclick=async e=>{e.stopPropagation();try{await LumaEventData.updateMessage(currentEventToken(),button.dataset.hideMessage,{status:'hidden'});await refreshEventData();await refreshPublicMemories();renderAdminMessages();toast('Mesaj gizlendi.')}catch{toast('Mesaj gizlenemedi.')}});
  list.querySelectorAll('[data-delete-message]').forEach(button=>button.onclick=e=>{e.stopPropagation();const item=readData().messages.find(message=>message.id===button.dataset.deleteMessage);LumaGallery.openDeleteConfirmation('Mesaj silinsin mi?',`${item?.name||'Bu misafir'} tarafından bırakılan mesaj kalıcı olarak kaldırılacak.`,async()=>{try{await LumaEventData.deleteMessage(currentEventToken(),button.dataset.deleteMessage);await refreshPublicMemories();renderAdminMessages();toast('Mesaj anı defterinden silindi.')}catch{toast('Mesaj silinemedi.')}})});
}
function openGuestUploadEntry(){
  if(!LumaConfig.publicEventToken()||!LumaConfig.shouldOpenUploadModal())return;
  if(!LumaEventData.uploadsEnabled()){toast('Bu etkinlik için fotoğraf yükleme kapalı.');document.getElementById('closeInvite')?.classList.add('hidden');loadSavedMusic().finally(()=>openInvitation());return}
  document.getElementById('authScreen')?.classList.add('hidden');
  document.getElementById('dashboard')?.classList.add('hidden');
  document.getElementById('closeInvite')?.classList.add('hidden');
  document.body.classList.add('guest-upload-entry');
  document.body.style.overflow='hidden';
  openModal('upload');
}
function openModal(type){
  if(type==='upload'&&!LumaEventData.uploadsEnabled()){toast('Bu etkinlik için fotoğraf yükleme kapalı.');return}
  document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;content.innerHTML=modalTemplates[type];content.querySelectorAll('[data-icon]').forEach(el=>{el.outerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[el.dataset.icon]}</svg>`});modal.classList.remove('hidden');
  const form=content.querySelector('form');if(type==='rsvp'){const email=form.querySelector('input[type="email"]');email.required=true;email.previousElementSibling.textContent='E-POSTA';}
  if(type==='event')form.querySelector('[name="eventDate"]').value=new Date(Date.now()+30*864e5).toISOString().slice(0,16);
  if(type==='upload'){
    form.insertAdjacentHTML('afterbegin','<div class="field full"><label>AD SOYAD</label><input name="uploaderName" required placeholder="Adınız ve soyadınız"></div>');
    LumaUpload.bindUploadForm(form,async(result,uploaderName)=>{if(sessionStorage.getItem('lumaAdminJwt')){readData._uploads=(readData._uploads||0)+result.uploaded.length;await refreshEventData();await refreshActivities()}else{toast('Fotoğraflarınız alındı. Onaylandıktan sonra davetiyede görünecek.')}updateDashboard();renderGuestTable()});
  }
  if(form&&type!=='upload')form.onsubmit=async e=>{e.preventDefault();const data=readData();const token=currentEventToken()||LumaConfig.publicEventToken();
    if(type==='event'){
      const value=name=>form.querySelector(`[name="${name}"]`).value.trim(),eventName=value('eventName');
      if(!sessionStorage.getItem('lumaAdminJwt')){toast('Oturum bulunamadı. Lütfen tekrar giriş yapın.');logout();return}
      const dateRaw=value('eventDate'),parsed=dateRaw?new Date(dateRaw):null;
      if(!parsed||Number.isNaN(parsed.getTime())){toast('Geçerli bir tarih seçin.');return}
      const submitBtn=form.querySelector('.submit-btn');
      if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Oluşturuluyor...'}
      try{
        const created=await LumaEventData.createEvent({name:eventName,event_date:parsed.toISOString(),venue:value('eventVenue'),city:value('eventCity'),tagline:invitationContentDefaults.tagline,story_title:invitationContentDefaults.storyTitle,story_text:invitationContentDefaults.storyText,guest_note:invitationContentDefaults.guestNote});
        sessionStorage.setItem('lumaActiveEventSlug',created.id);
        window._lumaEvents=await LumaEventData.listEvents();
        await refreshEventData();
        hydrateEventUI();
        modal.classList.add('hidden');
        toast('Yeni etkinlik oluşturuldu ve aktif edildi.');
        updateDashboard();
        renderGuestTable();
      }catch(err){
        const msg=err?.message||'Etkinlik oluşturulamadı.';
        toast(msg);
        if(msg.includes('Oturum'))logout();
      }finally{if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Etkinliği Oluştur'}}
      return;
    }else if(type==='rsvp'){
      const name=form.querySelector('input[required]:not([type="email"])').value.trim(),email=normalizedEmail(form.querySelector('input[type="email"]').value),statusIndex=[...form.querySelectorAll('input[name="status"]')].findIndex(x=>x.checked),status=['attending','declined','pending'][statusIndex],people=form.querySelector('select').selectedIndex+1;
      try{await LumaEventData.submitRsvp(token,{name,email,status,people});if(sessionStorage.getItem('lumaAdminJwt')){await refreshGuestViews();await refreshActivities()}else{updateDashboard();renderGuestTable()}modal.classList.add('hidden');toast('Katılım yanıtınız kaydedildi.')}catch(err){toast(err.message||'Katılım yanıtı gönderilemedi.')}
      return;
    }else{
      const name=form.querySelector('input[required]').value.trim(),message=form.querySelector('textarea[required]').value.trim();
      try{await LumaEventData.submitMessage(token,{name,message});if(sessionStorage.getItem('lumaAdminJwt')){await refreshEventData();await refreshActivities();await refreshPublicMemories()}else{await refreshPublicMemories()}updateDashboard();modal.classList.add('hidden');toast(sessionStorage.getItem('lumaAdminJwt')?'Mesaj anı defterine eklendi.':'Mesajınız alındı. Onaylandıktan sonra davetiyede görünecek.')}catch(err){toast(err.message||'Mesaj gönderilemedi.')}
      return;
    }
    if(type!=='event'){updateDashboard();renderGuestTable()}modal.classList.add('hidden');
  }
}
window.closeModal=function(){const wasMediaViewer=modal.dataset.viewer==='media';modal.classList.add('hidden');document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;if(wasMediaViewer&&!document.getElementById('galleryView').classList.contains('hidden'))LumaGallery.renderAdminGallery()};
document.querySelectorAll('[data-modal]').forEach(b=>b.onclick=()=>openModal(b.dataset.modal));document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=closeModal);
document.getElementById('newEventBtn').onclick=()=>openModal('event');
function adminAccount(){return sessionStorage.getItem('lumaAdminSession')?{email:sessionStorage.getItem('lumaAdminSession')}:null}
function formatNameFromEmail(email){if(!email)return 'Yönetici';const local=email.split('@')[0].replace(/[._-]+/g,' ').trim();if(!local)return 'Yönetici';return local.split(/\s+/).map(part=>part.charAt(0).toLocaleUpperCase('tr-TR')+part.slice(1).toLocaleLowerCase('tr-TR')).join(' ')}
function adminInitials(name){const parts=String(name||'').trim().split(/\s+/).filter(Boolean);if(parts.length>=2)return (parts[0][0]+parts[1][0]).toLocaleUpperCase('tr-TR');const compact=String(name||'LU').replace(/\s+/g,'');return (compact.slice(0,2)||'LU').toLocaleUpperCase('tr-TR')}
function applyAdminProfile(profile){const email=profile?.email||sessionStorage.getItem('lumaAdminSession')||'';const name=(profile?.display_name||'').trim()||formatNameFromEmail(email);if(email)sessionStorage.setItem('lumaAdminSession',email);if(profile?.display_name)sessionStorage.setItem('lumaAdminDisplayName',profile.display_name);else sessionStorage.removeItem('lumaAdminDisplayName');const greeting=document.getElementById('dashboardGreetingName');if(greeting)greeting.textContent=name;const sidebarName=document.getElementById('sidebarUserName');if(sidebarName)sidebarName.textContent=name;const settingsEmail=document.getElementById('settingsEmail');if(settingsEmail)settingsEmail.textContent=email;const settingsEmailDisplay=document.getElementById('settingsEmailDisplay');if(settingsEmailDisplay)settingsEmailDisplay.value=email;const settingsDisplayName=document.getElementById('settingsDisplayName');if(settingsDisplayName)settingsDisplayName.value=profile?.display_name||'';const initials=adminInitials(name);const sidebarAvatar=document.getElementById('sidebarAvatar');if(sidebarAvatar)sidebarAvatar.textContent=initials;const settingsAvatar=document.getElementById('settingsAvatar');if(settingsAvatar)settingsAvatar.textContent=initials}
async function refreshAdminProfile(){if(!sessionStorage.getItem('lumaAdminJwt'))return;try{applyAdminProfile(await LumaEventData.fetchAdminProfile())}catch{applyAdminProfile({email:sessionStorage.getItem('lumaAdminSession')||''})}}
function updatePlanUI(){const plan=localStorage.getItem('lumaPlan')||'free';document.getElementById('sidebarPlanName').textContent=plan==='premium'?'Premium Plan':'Free Plan';document.querySelectorAll('[data-plan]').forEach(button=>button.classList.toggle('active',button.dataset.plan===plan))}
function showAuthFeedback(message){const box=document.getElementById('authFeedback');box.textContent=message;box.classList.toggle('hidden',!message)}
function initializeAccess(){
  const publicToken=LumaConfig.publicEventToken();
  const loggedIn=Boolean(sessionStorage.getItem('lumaAdminJwt'));
  if(publicToken){document.getElementById('authScreen').classList.add('hidden');dashboard.classList.add('hidden');return}
  document.getElementById('authScreen').classList.toggle('hidden',loggedIn);
  dashboard.classList.toggle('hidden',!loggedIn);
  if(loggedIn)applyAdminProfile({email:sessionStorage.getItem('lumaAdminSession')||'',display_name:sessionStorage.getItem('lumaAdminDisplayName')||''});
  if(loggedIn){window._lumaPendingView=sessionStorage.getItem('lumaAdminView')||'overview'}
}
document.getElementById('authForm').onsubmit=async e=>{
  e.preventDefault();showAuthFeedback('');
  const emailInput=document.getElementById('authEmail'),passwordInput=document.getElementById('authPassword');
  const email=emailInput.value.trim().toLocaleLowerCase('tr-TR'),password=passwordInput.value,button=document.getElementById('authSubmitBtn');
  if(!emailInput.validity.valid){showAuthFeedback('Lütfen geçerli bir e-posta adresi girin.');emailInput.focus();return}
  if(password.length<8){showAuthFeedback('Şifre en az 8 karakter olmalıdır.');passwordInput.focus();return}
  button.disabled=true;button.textContent='Giriş yapılıyor...';
  try{
    const result=await loginBackendAdmin(email,password);
    if(!result.ok){
      if(result.reason==='invalid')showAuthFeedback('E-posta veya şifre hatalı.');
      else if(result.reason==='rate_limit')showAuthFeedback('Çok fazla giriş denemesi. Lütfen bir dakika bekleyin.');
      else if(result.reason==='network')showAuthFeedback('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
      else showAuthFeedback('Giriş şu an tamamlanamadı. Lütfen tekrar deneyin.');
      return;
    }
    initializeAccess();
    await refreshAdminProfile();
    await loadContacts();
    showView(window._lumaPendingView||'overview');
    await syncPhotoCount();
    updateDashboard();
    renderGuestTable();
    toast('Yönetici paneline giriş yapıldı.');
  }catch{showAuthFeedback('Giriş işlenemedi. Tarayıcı depolama iznini kontrol edin.')}
  finally{button.disabled=false;button.textContent='Giriş Yap'}
};
document.getElementById('passwordChangeForm').onsubmit=async e=>{e.preventDefault();const current=e.currentTarget.currentPassword.value,next=e.currentTarget.newPassword.value,confirm=e.currentTarget.confirmPassword.value;if(next!==confirm){toast('Yeni şifreler eşleşmiyor.');return}if(next.length<8){toast('Yeni şifre en az 8 karakter olmalı.');return}try{await LumaEventData.changePassword(current,next);e.currentTarget.reset();toast('Şifreniz başarıyla güncellendi.')}catch(err){toast(typeof err.message==='string'?err.message:'Şifre güncellenemedi.')}};
function logout(){sessionStorage.removeItem('lumaAdminSession');sessionStorage.removeItem('lumaAdminJwt');sessionStorage.removeItem('lumaAdminDisplayName');location.reload()}
document.getElementById('logoutBtn').onclick=logout;
document.getElementById('adminProfileForm').onsubmit=async e=>{e.preventDefault();const displayName=document.getElementById('settingsDisplayName').value.trim();if(!displayName){toast('Görünen ad boş bırakılamaz.');return}try{const profile=await LumaEventData.updateAdminProfile({display_name:displayName});applyAdminProfile(profile);toast('Profiliniz kaydedildi.');}catch(err){toast(err?.message||'Profil kaydedilemedi.')}};
const userPopup=document.getElementById('userPopupMenu'),userMenuButton=document.getElementById('userMenuBtn');userMenuButton.onclick=e=>{e.stopPropagation();userPopup.classList.toggle('hidden');userMenuButton.setAttribute('aria-expanded',!userPopup.classList.contains('hidden'))};document.getElementById('profileBtn').onclick=()=>showView('profile');document.querySelector('[data-profile-action]').onclick=()=>{userPopup.classList.add('hidden');showView('profile')};document.querySelector('[data-logout-action]').onclick=logout;document.addEventListener('click',e=>{if(!document.getElementById('userCard').contains(e.target)){userPopup.classList.add('hidden');userMenuButton.setAttribute('aria-expanded','false')}});
document.querySelectorAll('[data-plan]').forEach(button=>button.onclick=()=>{localStorage.setItem('lumaPlan',button.dataset.plan);updatePlanUI();toast(`${button.dataset.plan==='premium'?'Premium':'Free'} plan seçildi.`)});
const invitationAudio=document.getElementById('invitationAudio'),musicButton=document.getElementById('musicBtn');
async function playInvitationMusic(){if(!invitationAudio.src){musicButton.classList.add('hidden');return}musicButton.classList.remove('hidden');try{await invitationAudio.play();musicButton.classList.add('playing');musicButton.classList.remove('needs-interaction');musicButton.querySelector('small').textContent='Çalıyor'}catch{musicButton.classList.add('needs-interaction');musicButton.querySelector('small').textContent='Müziği başlat'}}
musicButton.onclick=async()=>{if(!invitationAudio.src){toast('Bu davetiye için müzik seçilmemiş.');return}if(invitationAudio.paused){await playInvitationMusic()}else{invitationAudio.pause();musicButton.classList.remove('playing','needs-interaction');musicButton.querySelector('small').textContent='Müzik';toast('Müzik durduruldu')}};
document.getElementById('calendarBtn').onclick=()=>downloadCalendarEvent();
document.getElementById('eventSettingsForm').onsubmit=async e=>{
  e.preventDefault();
  const token=currentEventToken();
  if(!token){toast('Aktif etkinlik bulunamadı.');return}
  const slug=document.getElementById('eventSettingsSlug').value.trim().toLocaleLowerCase('tr-TR');
  if(slug&&!/^[a-z0-9-]+$/.test(slug)){toast('Slug yalnızca küçük harf, rakam ve tire içerebilir.');return}
  const button=e.currentTarget.querySelector('button[type="submit"]');
  if(button){button.disabled=true;button.textContent='Kaydediliyor...'}
  try{
    await LumaEventData.updateEvent(token,{
      is_active:document.getElementById('eventSettingsActive').checked,
      uploads_enabled:document.getElementById('eventSettingsUploads').checked,
      ...(slug?{slug}:{}),
    });
    window._lumaEvents=await LumaEventData.listEvents();
    loadEventSettingsForm();
    setupEventSwitcher();
    applyUploadVisibility();
    await refreshPublicMemories();
    toast('Etkinlik ayarları kaydedildi.');
  }catch(err){toast(err?.message||'Etkinlik ayarları kaydedilemedi.')}
  finally{if(button){button.disabled=false;button.textContent='Etkinlik Ayarlarını Kaydet'}}
};
document.addEventListener('keydown',e=>{if(!modal.classList.contains('hidden')&&modal.dataset.viewer==='media'&&e.key==='ArrowLeft')LumaGallery.showMediaAt(LumaGallery.activeMediaIndex-1);if(!modal.classList.contains('hidden')&&modal.dataset.viewer==='media'&&e.key==='ArrowRight')LumaGallery.showMediaAt(LumaGallery.activeMediaIndex+1);if(e.key==='Escape'){if(!modal.classList.contains('hidden'))closeModal();else if(!invitation.classList.contains('hidden'))closeInvitation()}});

const defaultCover=LumaConfig.defaultCover;
let eventDate=new Date(),pendingCover=defaultCover;
const dateInput=document.getElementById('eventDateInput'),coverInput=document.getElementById('coverImageInput'),coverPreview=document.getElementById('coverPreview'),dropzone=document.getElementById('coverDropzone');
function hydrateEventUI(){
  const meta=currentEventMeta();
  applyEventMeta(meta);
  setupEventSwitcher();
  const inv=LumaEventData.cache.invitation;
  const dateSource=inv?.event_date||meta.date;
  if(dateSource){eventDate=new Date(dateSource);if(dateInput)dateInput.value=eventDate.toISOString().slice(0,16);updateDateContent(eventDate)}
  const cover=inv?.cover_url||defaultCover;
  pendingCover=cover;
  if(coverPreview)coverPreview.src=cover;
  const inviteCover=document.getElementById('inviteCoverImage');if(inviteCover)inviteCover.src=cover;
  const thumb=document.querySelector('.event-thumb');if(thumb)thumb.style.backgroundImage=`url("${cover}")`;
  loadInvitationContentEditor();
  loadSavedMusic();
  applyUploadVisibility();
  void refreshPublicMemories();
  if(!document.getElementById('qrView').classList.contains('hidden'))LumaQr.render();
}
function applyEventMeta(meta){
  if(!meta)return;document.querySelector('.hero-copy h1').textContent=meta.name;document.querySelector('.hero-place').textContent=`${meta.venue} · ${meta.city}`.toLocaleUpperCase('tr-TR');const venueText=document.querySelector('.detail-grid article:nth-child(2) p');venueText.replaceChildren(document.createTextNode(meta.venue),document.createElement('br'),document.createTextNode(meta.city));const footer=document.querySelector('.invite-footer p'),footerDate=document.createElement('span');footerDate.id='footerDate';footer.replaceChildren(document.createTextNode(`${meta.name} · `),footerDate);
}
function setupEventSwitcher(){const select=document.getElementById('eventSelect'),events=eventList();if(!select)return;if(!events.length){select.innerHTML='<option value="">Etkinlik yok</option>';return}select.innerHTML=events.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('');const activeId=currentEventId();select.value=events.some(item=>item.id===activeId)?activeId:events[0].id;select.disabled=Boolean(LumaConfig.publicEventToken());select.onchange=async()=>{const selected=events.find(item=>item.id===select.value);if(!selected||selected.id===currentEventId())return;select.disabled=true;try{await switchActiveEvent(selected.id)}finally{select.disabled=Boolean(LumaConfig.publicEventToken())}}}
function contactList(){return window._lumaContacts||[]}
let _contactsLoadSeq=0;
function upsertContact(contact){_contactsLoadSeq++;window._lumaContacts=[contact,...contactList().filter(item=>item.id!==contact.id)];renderContactList();renderSavedContactSelect()}
async function loadContacts(){
  const seq=++_contactsLoadSeq;
  const contacts=await LumaEventData.loadContacts();
  if(seq!==_contactsLoadSeq)return window._lumaContacts||[];
  window._lumaContacts=contacts;
  renderContactList();
  renderSavedContactSelect();
  return contacts;
}
function saveContacts(contacts){window._lumaContacts=contacts;renderSavedContactSelect()}
function renderSavedContactSelect(){const select=document.getElementById('savedContactSelect'),contacts=contactList();select.innerHTML='<option value="">Kişi seçin (isteğe bağlı)</option>'+contacts.map(contact=>`<option value="${contact.id}">${escapeHtml(contact.name)} · ${escapeHtml(contact.email)}</option>`).join('')}
function renderContactList(){
  const contacts=contactList(),container=document.getElementById('contactList');
  if(!container)return;
  container.innerHTML=contacts.map(contact=>`<div class="contact-row"><div><strong>${escapeHtml(contact.name)}</strong><small>${escapeHtml(contact.email)}</small></div><button data-select-events="${contact.id}">Etkinlik seç</button><button class="contact-delete" data-delete-contact="${contact.id}">Sil</button></div>`).join('');
  document.getElementById('contactEmpty')?.classList.toggle('hidden',contacts.length>0);
  container.querySelectorAll('[data-select-events]').forEach(button=>button.onclick=()=>openContactEventPicker(contacts.find(contact=>contact.id===button.dataset.selectEvents)));
  container.querySelectorAll('[data-delete-contact]').forEach(button=>button.onclick=async()=>{try{await LumaEventData.deleteContact(button.dataset.deleteContact);window._lumaContacts=contactList().filter(contact=>contact.id!==button.dataset.deleteContact);renderContactList();renderSavedContactSelect();toast('Kişi rehberden kaldırıldı.')}catch(err){toast(err?.message||'Kişi silinemedi.')}});
}
async function guestMembershipForEvents(email){
  const events=eventList(),membership={};
  await Promise.all(events.map(async event=>{
    if(!event.private_token){membership[event.id]=false;return}
    try{
      const guests=event.id===currentEventId()?readData().guests:await LumaEventData.fetchGuests(event.private_token);
      membership[event.id]=guests.some(guest=>normalizedEmail(guest.email)===email);
    }catch{membership[event.id]=false}
  }));
  return membership;
}
async function openContactEventPicker(contact){
  const events=eventList(),email=normalizedEmail(contact.email),membership=await guestMembershipForEvents(email);
  document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;
  content.innerHTML=`<p class="invite-kicker">KİŞİNİN ETKİNLİKLERİ</p><h2>Etkinlik seç</h2><p><strong>${escapeHtml(contact.name)}</strong> kişisinin katılabileceği etkinlikleri işaretleyin. İşareti kaldırılan etkinliklerden kişi çıkarılır.</p><div class="event-picker-list">${events.map(event=>{const exists=membership[event.id];return `<label class="event-picker-option"><input type="checkbox" value="${event.id}" ${exists?'checked':''}><span><strong>${escapeHtml(event.name)}</strong><small>${exists?'Şu anda misafir listesinde':trDate(eventDateFor(event),{day:'numeric',month:'long',year:'numeric'})}</small></span></label>`}).join('')}</div><div class="event-picker-actions"><button id="cancelEventPicker" class="confirm-cancel">Vazgeç</button><button id="confirmEventPicker" class="confirm-delete">Seçimleri Kaydet</button></div>`;
  modal.classList.remove('hidden');document.getElementById('cancelEventPicker').onclick=closeModal;document.getElementById('confirmEventPicker').onclick=async()=>{let added=0,removed=0;for(const event of events){const selected=content.querySelector(`.event-picker-option input[value="${event.id}"]`).checked,token=event.private_token;if(!token)continue;const existing=membership[event.id];if(selected&&!existing){try{await LumaEventData.createGuest(token,{name:contact.name,email,status:'pending',people:1,source:'admin'});added++}catch{}}else if(!selected&&existing){try{const guests=event.id===currentEventId()?readData().guests:await LumaEventData.fetchGuests(token);const guest=guests.find(g=>normalizedEmail(g.email)===email);if(guest){await LumaEventData.deleteGuest(token,guest.id);removed++}}catch{}}}await refreshGuestViews();await refreshActivities();closeModal();toast(added||removed?`${added} etkinliğe eklendi, ${removed} etkinlikten çıkarıldı.`:'Etkinlik seçimlerinde değişiklik yapılmadı.')}}
function renderProfile(){
  const events=eventList(),eventContainer=document.getElementById('profileEventList');
  eventContainer.innerHTML=events.length?events.map(event=>`<div class="profile-event-row"><button class="profile-event ${event.id===currentEventId()?'active':''}" data-profile-event="${event.id}"><strong>${escapeHtml(event.name)}</strong><small>${trDate(eventDateFor(event),{day:'numeric',month:'long',year:'numeric'})} · ${escapeHtml(event.venue||'Mekân belirtilmedi')}</small><small class="profile-event-link">${event.private_token?`Davet: ${escapeHtml(LumaConfig.inviteUrl(event.private_token))}`:'Davet bağlantısı senkronize ediliyor...'}</small><small class="profile-event-link">${event.private_token?`Fotoğraf yükleme: ${escapeHtml(LumaConfig.uploadUrl(event.private_token))}`:''}</small></button><div class="profile-event-actions"><button class="profile-event-qr" data-open-event-qr="${event.id}" ${event.private_token?'':'disabled'}>QR kodu</button><button class="profile-event-delete" data-delete-event="${event.id}" aria-label="${escapeHtml(event.name)} etkinliğini sil">Sil</button></div></div>`).join(''):'<div class="guest-empty">Henüz etkinlik yok.</div>';
  eventContainer.querySelectorAll('[data-profile-event]').forEach(button=>button.onclick=async()=>{await switchActiveEvent(button.dataset.profileEvent)});
  eventContainer.querySelectorAll('[data-open-event-qr]').forEach(button=>button.onclick=async()=>{await switchActiveEvent(button.dataset.openEventQr);showView('qr')});
  eventContainer.querySelectorAll('[data-delete-event]').forEach(button=>button.onclick=()=>{const event=events.find(item=>item.id===button.dataset.deleteEvent);if(!event?.private_token)return;LumaGallery.openDeleteConfirmation('Etkinlik silinsin mi?',`"${event.name}" ve bağlı tüm misafir, fotoğraf ve anı defteri verileri kalıcı olarak silinecek.`,async()=>{try{await LumaEventData.deleteEvent(event.private_token);const wasActive=event.id===currentEventId();window._lumaEvents=await LumaEventData.listEvents();if(!window._lumaEvents.length)sessionStorage.removeItem('lumaActiveEventSlug');else if(wasActive)sessionStorage.setItem('lumaActiveEventSlug',window._lumaEvents[0].id);await syncBackendEvents();renderProfile();updateDashboard();renderGuestTable();toast('Etkinlik silindi.')}catch(err){toast(err?.message||'Etkinlik silinemedi.');throw err}})});
  renderContactList();
}
document.getElementById('savedContactSelect').onchange=e=>{const contact=contactList().find(item=>item.id===e.currentTarget.value);if(!contact)return;document.getElementById('guestNameInput').value=contact.name;document.getElementById('guestEmailInput').value=contact.email};
document.getElementById('contactForm').onsubmit=async e=>{e.preventDefault();const name=document.getElementById('contactName').value.trim(),email=normalizedEmail(document.getElementById('contactEmail').value);const button=e.currentTarget.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent='Kaydediliyor...'}try{const created=await LumaEventData.createContact({name,email});upsertContact(created);e.currentTarget.reset();toast('Kişi rehbere kaydedildi.')}catch(err){toast(err.message||'Kişi kaydedilemedi.')}finally{if(button){button.disabled=false;button.textContent='Kişiyi Kaydet'}}};
const invitationContentDefaults={names:'Melisa & Berk',tagline:'Birlikte, sonsuza...',storyTitle:'Hayat, seninle daha güzel.',storyText:'Bir kahveyle başlayan hikâyemiz, şimdi en güzel “evet”e hazırlanıyor. Bu özel günümüzde sevincimizi sizinle paylaşmak için sabırsızlanıyoruz.',venue:'The Marmara Esma Sultan',location:'Ortaköy, Beşiktaş · İstanbul',guestNote:'Şıklığınızı yansıtan kokteyl veya gece kıyafeti.'};
function invitationContentFromForm(){return {names:document.getElementById('contentCoupleNames').value.trim(),tagline:document.getElementById('contentTagline').value.trim(),storyTitle:document.getElementById('contentStoryTitle').value.trim(),storyText:document.getElementById('contentStoryText').value.trim(),venue:document.getElementById('contentVenue').value.trim(),location:document.getElementById('contentLocation').value.trim(),guestNote:document.getElementById('contentGuestNote').value.trim()}}
function applyInvitationContent(data){const contentData={...invitationContentDefaults,...data};document.getElementById('inviteNames').textContent=contentData.names;document.getElementById('inviteTagline').textContent=contentData.tagline;document.getElementById('inviteStoryTitle').textContent=contentData.storyTitle;document.getElementById('inviteStoryText').textContent=contentData.storyText;document.getElementById('inviteHeroPlace').textContent=`${contentData.venue} · ${contentData.location}`.toLocaleUpperCase('tr-TR');const venueText=document.querySelector('.detail-grid article:nth-child(2) p');venueText.replaceChildren(document.createTextNode(contentData.venue),document.createElement('br'),document.createTextNode(contentData.location));document.querySelector('.detail-grid article:nth-child(3) p').textContent=contentData.guestNote;document.querySelector('.signature').textContent=contentData.names.split(/\s*&\s*|\s+/).filter(Boolean).slice(0,2).map(part=>part[0].toLocaleUpperCase('tr-TR')).join(' & ');const footer=document.querySelector('.invite-footer p'),dateSpan=document.getElementById('footerDate')||document.createElement('span');dateSpan.id='footerDate';footer.replaceChildren(document.createTextNode(`${contentData.names} · `),dateSpan)}
function loadInvitationContentEditor(){const meta=currentEventMeta(),inv=LumaEventData.cache.invitation;if(!inv&&!meta.id)return;const data={names:inv?.name||meta.name,tagline:inv?.tagline||invitationContentDefaults.tagline,storyTitle:inv?.story_title||invitationContentDefaults.storyTitle,storyText:inv?.story_text||invitationContentDefaults.storyText,venue:inv?.venue||meta.venue,location:inv?.city||meta.city,guestNote:inv?.guest_note||invitationContentDefaults.guestNote};document.getElementById('contentCoupleNames').value=data.names;document.getElementById('contentTagline').value=data.tagline;document.getElementById('contentStoryTitle').value=data.storyTitle;document.getElementById('contentStoryText').value=data.storyText;document.getElementById('contentVenue').value=data.venue;document.getElementById('contentLocation').value=data.location;document.getElementById('contentGuestNote').value=data.guestNote;applyInvitationContent(data);if(inv?.event_date){dateInput.value=inv.event_date.slice(0,16);eventDate=new Date(inv.event_date);updateDateContent(eventDate)}if(inv?.cover_url){pendingCover=inv.cover_url;coverPreview.src=pendingCover;document.getElementById('inviteCoverImage').src=pendingCover;document.querySelector('.event-thumb').style.backgroundImage=`url("${pendingCover}")`}}
function updateDateContent(date){
  if(Number.isNaN(date.getTime()))return;
  const dayMonthYear=trDate(date,{day:'numeric',month:'long',year:'numeric'}),weekday=trDate(date,{weekday:'long'}),time=trDate(date,{hour:'2-digit',minute:'2-digit'}),capitalWeekday=weekday.charAt(0).toUpperCase()+weekday.slice(1);
  document.getElementById('selectedDatePreview').textContent=`${dayMonthYear}, ${capitalWeekday} · ${time}`;
  document.getElementById('dashboardDate').textContent=`${dayMonthYear} · ${capitalWeekday}`;
  document.getElementById('heroDate').textContent=[date.getDate(),date.getMonth()+1,date.getFullYear()].map((x,i)=>i<2?String(x).padStart(2,'0'):x).join(' · ');
  document.getElementById('detailDate').textContent=`${dayMonthYear}, ${capitalWeekday}`;
  document.getElementById('detailTime').textContent=`Kokteyl ${time} · Davet ${trDate(new Date(date.getTime()+36e5),{hour:'2-digit',minute:'2-digit'})}`;
  document.getElementById('footerDate').textContent=dayMonthYear;
  tick();
}
function setCover(src){pendingCover=src;coverPreview.src=src}
function readCover(file){
  if(!file)return;if(!file.type.startsWith('image/')){toast('Lütfen bir görsel dosyası seçin.');return}if(file.size>3*1024*1024){toast('Görsel en fazla 3 MB olabilir.');return}
  const reader=new FileReader();reader.onload=()=>setCover(reader.result);reader.readAsDataURL(file);
}
dateInput.addEventListener('input',()=>updateDateContent(new Date(dateInput.value)));
coverInput.addEventListener('change',()=>readCover(coverInput.files[0]));
['dragenter','dragover'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.add('dragging')}));
['dragleave','drop'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.remove('dragging')}));
dropzone.addEventListener('drop',e=>readCover(e.dataTransfer.files[0]));
document.getElementById('resetCoverBtn').onclick=()=>setCover(defaultCover);
const musicInput=document.getElementById('musicFileInput'),musicFileName=document.getElementById('musicFileName'),musicAdminPreview=document.getElementById('musicAdminPreview'),musicPreviewAudio=document.getElementById('musicPreviewAudio');let pendingMusicFile,removePendingMusic=false,pendingMusicPreviewUrl='';
function clearMusicPreviewUrl(){if(pendingMusicPreviewUrl){URL.revokeObjectURL(pendingMusicPreviewUrl);pendingMusicPreviewUrl=''}}
function showMusicPreview(file,fileName){clearMusicPreviewUrl();pendingMusicPreviewUrl=URL.createObjectURL(file);musicFileName.textContent=fileName;musicPreviewAudio.src=pendingMusicPreviewUrl;invitationAudio.src=pendingMusicPreviewUrl;musicAdminPreview.classList.remove('hidden');musicButton.classList.remove('hidden')}
function showMusicFromUrl(url,fileName){clearMusicPreviewUrl();musicFileName.textContent=fileName||'Davetiye müziği';musicPreviewAudio.src=url;invitationAudio.src=url;musicAdminPreview.classList.remove('hidden');musicButton.classList.remove('hidden')}
function hideMusicPreview(){clearMusicPreviewUrl();musicFileName.textContent='Müzik dosyası seç';musicPreviewAudio.removeAttribute('src');musicPreviewAudio.load();invitationAudio.removeAttribute('src');invitationAudio.load();musicAdminPreview.classList.add('hidden');musicButton.classList.add('hidden')}
async function loadSavedMusic(){const inv=LumaEventData.cache.invitation;if(inv?.music_url)showMusicFromUrl(inv.music_url,inv.music_filename||'Davetiye müziği');else hideMusicPreview()}
musicInput.onchange=()=>{const file=musicInput.files[0];if(!file)return;if(file.size>15*1024*1024){toast('Müzik dosyası en fazla 15 MB olabilir.');musicInput.value='';return}pendingMusicFile=file;removePendingMusic=false;showMusicPreview(file,file.name)};
document.getElementById('removeMusicBtn').onclick=()=>{pendingMusicFile=undefined;removePendingMusic=true;musicInput.value='';hideMusicPreview();toast('Müzik kaldırılmak üzere işaretlendi.')};
document.getElementById('editorPreviewBtn').onclick=async()=>{document.getElementById('inviteCoverImage').src=pendingCover;updateDateContent(new Date(dateInput.value));applyInvitationContent(invitationContentFromForm());await refreshPublicMemories();openInvitation()};
document.getElementById('inviteEditorForm').onsubmit=async e=>{
  e.preventDefault();eventDate=new Date(dateInput.value);updateDateContent(eventDate);document.getElementById('inviteCoverImage').src=pendingCover;document.querySelector('.event-thumb').style.backgroundImage=`url("${pendingCover}")`;
  const contentData=invitationContentFromForm(),token=currentEventToken();
  if(!token){toast('Etkinlik token bulunamadı.');return}
  try{
    await LumaEventData.saveInvitation(token,{...contentData,event_date:new Date(dateInput.value).toISOString(),city:contentData.location});
    if(pendingCover===defaultCover)await LumaEventData.removeCover(token);
    else if(typeof pendingCover==='string'&&(pendingCover.startsWith('data:')||pendingCover.startsWith('blob:')))await LumaEventData.uploadCover(token,pendingCover);
    if(removePendingMusic)await LumaEventData.removeMusic(token);else if(pendingMusicFile)await LumaEventData.uploadMusic(token,pendingMusicFile);
    await loadSavedMusic();
    applyInvitationContent(contentData);
    pendingMusicFile=undefined;removePendingMusic=false;updateStorageCard();updateDashboard();toast('Davetiye içeriği ve görünümü kaydedildi.');
  }catch{toast('Davetiye ayarları kaydedilemedi.')}
};
function eventDateFor(meta){return new Date(meta.date||LumaEventData.cache.invitation?.event_date||Date.now())}
function tick(){const meta=currentEventMeta(),date=Number.isNaN(eventDate.getTime())?eventDateFor(meta):eventDate,countdown=countdownValues(date);document.getElementById('daysRemaining').textContent=countdown.diff?`${countdown.days} gün kaldı`:'Etkinlik tarihi geldi';document.getElementById('dashboardDateTime').textContent=`${meta.name||'Etkinlik'} · ${trDate(date,{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}`;document.getElementById('sidebarDaysRemaining').textContent=countdown.diff?`Etkinliğinize ${countdown.days} gün kaldı.`:'Etkinlik tarihi geldi.';document.querySelectorAll('.mini-countdown b').forEach((el,i)=>el.childNodes[0].nodeValue=countdown.nums[i]);document.querySelectorAll('#publicCountdown b').forEach((el,i)=>el.textContent=countdown.nums[i])}
function countdownValues(date){const diff=Math.max(0,date-new Date()),values=[Math.floor(diff/864e5),Math.floor(diff/36e5)%24,Math.floor(diff/6e4)%60,Math.floor(diff/1e3)%60];return {diff,days:values[0],nums:values.map(value=>String(value).padStart(2,'0'))}}
LumaGallery.bindFavoriteFilter();
LumaGallery.bindStatusFilters();
if(sessionStorage.getItem('lumaAdminJwt'))document.documentElement.classList.add('luma-booting');
initializeAccess();updatePlanUI();
(async()=>{
  try{
  if(sessionStorage.getItem('lumaAdminJwt')){
    await syncBackendEvents();
    await refreshAdminProfile();
    await loadContacts();
    showView(window._lumaPendingView||'overview');
  }else if(LumaConfig.publicEventToken()){
    const loaded=await refreshEventData();
    if(!loaded){toast('Davetiye bulunamadı veya artık aktif değil.');return}
    hydrateEventUI();
  }else{
    setupEventSwitcher();
  }
  await syncPhotoCounts();
  updateDashboard();
  renderGuestTable();
  tick();
  setInterval(tick,1000);
  if(LumaConfig.publicEventToken()){
    if(LumaConfig.shouldOpenUploadModal()){
      if(LumaEventData.uploadsEnabled())openGuestUploadEntry();
      else{document.getElementById('closeInvite')?.classList.add('hidden');toast('Bu etkinlik için fotoğraf yükleme kapalı.');loadSavedMusic().finally(()=>openInvitation())}
    }else{document.getElementById('closeInvite').classList.add('hidden');loadSavedMusic().finally(()=>openInvitation())}
  }
  else loadSavedMusic();
  }finally{document.documentElement.classList.remove('luma-booting')}
})();
