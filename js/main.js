const icons={grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',qr:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',eye:'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',chevron:'<polyline points="6 9 12 15 18 9"/>',menu:'<path d="M3 12h18M3 6h18M3 18h18"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',check:'<path d="m20 6-11 11-5-5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',userplus:'<path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 11a4 4 0 1 0 0-8M19 8v6M22 11h-6"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',sparkle:'<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5zM19 3v4M21 5h-4"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'};
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icons[el.dataset.icon]||icons.heart;el.setAttribute('viewBox','0 0 24 24');el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');el.setAttribute('stroke-linecap','round');el.setAttribute('stroke-linejoin','round')});

const { escapeHtml, trDate, toast } = Luma;
const dashboard=document.getElementById('dashboard'), invitation=document.getElementById('invitation'), sidebar=document.querySelector('.sidebar');
function openInvitation(){invitation.classList.remove('hidden');invitation.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';invitation.scrollTop=0;playInvitationMusic()}
function closeInvitation(){invitation.classList.add('hidden');invitation.setAttribute('aria-hidden','true');document.body.style.overflow='';if(typeof invitationAudio!=='undefined')invitationAudio.pause()}
document.getElementById('previewBtn').onclick=openInvitation;document.getElementById('closeInvite').onclick=closeInvitation;document.getElementById('openInvite').onclick=openInvitation;
document.getElementById('menuBtn').onclick=()=>sidebar.classList.toggle('open');

const labels={invite:['Davetiye','Temanızı, içerikleri ve müziği canlı önizleme ile düzenleyin.'],guests:['Misafirler','Katılım cevaplarını ve toplam kişi sayısını tek yerden yönetin.'],gallery:['Galeri','Misafirlerinizin yüklediği fotoğraf ve videolar burada toplanır.'],guestbook:['Anı Defteri','Sevdiklerinizin bıraktığı yazılı, sesli ve görüntülü mesajları okuyun.'],qr:['QR Kodlar','Fotoğraf yükleme QR kodunuzu indirin ve baskıya hazırlayın.'],settings:['Ayarlar','Etkinlik bilgileri, görünürlük ve bildirim tercihlerini yönetin.']};
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
  if(view==='profile')renderProfile();
  if(view==='qr')LumaQr.render();
  if(!['overview','invite','guests','gallery','guestbook','settings','profile'].includes(view)){document.getElementById('emptyTitle').textContent=labels[view][0];document.getElementById('emptyText').textContent=labels[view][1];document.getElementById('openInvite').style.display='none'}
  sidebar.classList.remove('open');
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));document.getElementById('backOverview').onclick=()=>showView('overview');

const modal=document.getElementById('modal'), content=document.getElementById('modalContent');
const modalTemplates={rsvp:`<p class="invite-kicker">KATILIM BİLDİR</p><h2>Sizi aramızda görecek miyiz?</h2><p>Yanıtınız hazırlıklarımızı kusursuzlaştırmamıza yardımcı olacak.</p><form id="rsvpForm" class="form-grid"><div class="field full"><label>AD SOYAD</label><input required placeholder="Adınız ve soyadınız"></div><div class="field full"><label>KATILIM DURUMU</label><div class="choice-row"><label><input type="radio" name="status" checked>Katılacağım</label><label><input type="radio" name="status">Katılamayacağım</label><label><input type="radio" name="status">Henüz emin değilim</label></div></div><div class="field"><label>KİŞİ SAYISI</label><select><option>1 kişi</option><option>2 kişi</option><option>3 kişi</option><option>4+ kişi</option></select></div><div class="field"><label>E-POSTA (İSTEĞE BAĞLI)</label><input type="email" placeholder="ornek@email.com"></div><div class="field full"><label>EK NOT</label><textarea placeholder="Alerji, ulaşım veya bize iletmek istediğiniz bir not..."></textarea></div><button class="submit-btn">Yanıtımı Gönder</button></form>`,upload:`<p class="invite-kicker">ANI PAYLAŞ</p><h2>Fotoğraflarını bizimle paylaş 💌</h2><p>Etkinlikte çektiğin fotoğrafları güvenle yükleyebilirsin. Aynı anda birden fazla fotoğraf seçebilir veya tek tek ekleyebilirsin.</p><form id="uploadForm" class="form-grid"><label class="dropzone field full"><i data-icon="upload"></i><p>Fotoğraf ekle</p><small>Birden fazla seçilebilir · JPG, PNG, WebP, HEIC · Her biri en fazla 15 MB</small><input id="fileInput" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif" hidden></label><div class="field full"><label>AÇIKLAMA (İSTEĞE BAĞLI)</label><textarea placeholder="Bu güzel an hakkında birkaç kelime..."></textarea></div><button class="submit-btn">Gönder</button></form>`,message:`<p class="invite-kicker">ANI DEFTERİ</p><h2>Bize bir not bırak.</h2><p>Yıllar sonra yeniden okumaktan mutluluk duyacağımız birkaç güzel kelime...</p><form id="messageForm" class="form-grid"><div class="field full"><label>AD SOYAD</label><input required placeholder="Adınız ve soyadınız"></div><div class="field full"><label>MESAJINIZ</label><textarea required placeholder="Bir ömür boyu mutluluklar..." style="min-height:130px"></textarea></div><button class="submit-btn">Mesajı Bırak ♡</button></form>`};
modalTemplates.event=`<p class="invite-kicker">YENİ ETKİNLİK</p><h2>Yeni bir etkinlik oluştur.</h2><p>Temel bilgileri girin. Etkinlik oluşturulduğunda aktif olarak seçilecektir.</p><form id="eventForm" class="form-grid"><div class="field full"><label>ETKİNLİK ADI</label><input name="eventName" required placeholder="Örn. Melisa & Berk Düğünü"></div><div class="field"><label>TARİH VE SAAT</label><input name="eventDate" type="datetime-local" required></div><div class="field"><label>MEKÂN</label><input name="eventVenue" required placeholder="Örn. Esma Sultan Yalısı"></div><div class="field full"><label>ŞEHİR</label><input name="eventCity" required placeholder="Örn. İstanbul"></div><button class="submit-btn">Etkinliği Oluştur</button></form>`;
const defaultEvent={id:'default',slug:'melisa-berk',private_token:'',name:'Melisa & Berk',date:'2026-09-06T18:30',venue:'The Marmara Esma Sultan',city:'İstanbul'};
function eventList(){try{const list=JSON.parse(localStorage.getItem('lumaEvents')||'[]');return list.some(item=>item.id==='default')?list:[defaultEvent,...list]}catch{return [defaultEvent]}}
function currentEventId(){const publicToken=LumaConfig.publicEventToken();if(publicToken){const match=eventList().find(item=>item.private_token===publicToken);if(match)return match.id}try{return JSON.parse(localStorage.getItem('lumaActiveEvent')||'null')?.id||'default'}catch{return 'default'}}
function currentEventMeta(){return eventList().find(item=>item.id===currentEventId())||defaultEvent}
function currentEventToken(){const publicToken=LumaConfig.publicEventToken();if(publicToken)return publicToken;const meta=currentEventMeta();return meta.private_token||''}
LumaConfig.getEventToken=currentEventToken;
async function syncBackendEvents(){
  try{
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/events`,{headers:LumaConfig.adminAuthHeaders()});
    if(!response.ok)return false;
    const events=await response.json();
    const mapped=events.map(event=>({id:event.slug==='melisa-berk'?'default':event.slug,slug:event.slug,private_token:event.private_token,name:event.name,date:'2026-09-06T18:30',venue:'The Marmara Esma Sultan',city:'İstanbul',uploads_enabled:event.uploads_enabled,is_active:event.is_active}));
    if(!mapped.length)return false;
    localStorage.setItem('lumaEvents',JSON.stringify(mapped));
    const active=mapped.find(item=>item.id===currentEventId()&&item.private_token)||mapped.find(item=>item.private_token)||mapped[0];
    localStorage.setItem('lumaActiveEvent',JSON.stringify(active));
    const select=document.getElementById('eventSelect');
    if(select)select.value=active.id;
    if(!document.getElementById('qrView').classList.contains('hidden'))LumaQr.render();
    return Boolean(active?.private_token);
  }catch{return false}
}
window.syncBackendEvents=syncBackendEvents;
async function loginBackendAdmin(email,password){
  try{
    const response=await fetch(`${LumaConfig.apiBase}/api/admin/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    if(response.status===401)return {ok:false,reason:'invalid'};
    if(!response.ok)return {ok:false,reason:'server'};
    const data=await response.json();
    sessionStorage.setItem('lumaAdminJwt',data.access_token);
    const synced=await syncBackendEvents();
    return {ok:true,synced};
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
function readData(eventId=currentEventId()){try{const legacy=eventId==='default'?localStorage.getItem('lumaRealData'):null,data={...emptyData,...JSON.parse(localStorage.getItem(scopedKey('lumaRealData',eventId))||legacy||'{}')};if(!Array.isArray(data.messages))data.messages=[];return data}catch{return {...emptyData}}}
function saveData(data,eventId=currentEventId()){try{localStorage.setItem(scopedKey('lumaRealData',eventId),JSON.stringify(data))}catch{toast('Veri bu tarayıcıda kaydedilemedi.')}}
function addActivity(data,text,kind='check'){data.activities.unshift({text,kind,time:new Date().toISOString()});data.activities=data.activities.slice(0,6)}
async function syncPhotoCount(){try{const photos=await LumaGallery.fetchPhotos(currentEventToken(),{admin:Boolean(sessionStorage.getItem('lumaAdminJwt'))});const data=readData();data.uploads=photos.length;saveData(data);return photos.length}catch{return readData().uploads}}
function updateDashboard(){
  const data=readData(),groups={attending:0,declined:0,pending:0};
  data.guests.forEach(item=>groups[item.status]+=item.people||1);
  const total=groups.attending+groups.declined+groups.pending,percent=value=>total?Math.round(value/total*100):0,messageCount=data.messages.length,memories=data.uploads+messageCount;
  document.getElementById('totalGuestsStat').textContent=total;document.getElementById('attendingStat').textContent=groups.attending;document.getElementById('pendingStat').textContent=groups.pending;document.getElementById('memoriesStat').textContent=memories;
  document.getElementById('totalGuestsNote').textContent=total?'Katılım formuna kaydedilen kişi sayısı':'Henüz davetli kaydı yok';document.getElementById('attendingNote').textContent=total?`Kayıtlı kişilerin %${percent(groups.attending)}'i`:'Henüz katılım yanıtı yok';document.getElementById('memoriesNote').textContent=memories?`${data.uploads} dosya · ${messageCount} mesaj`:'Henüz anı paylaşılmadı';
  document.getElementById('guestNavCount').textContent=total;document.getElementById('galleryNavCount').textContent=data.uploads;document.getElementById('guestbookNavCount').textContent=messageCount;document.getElementById('publicMemoryCount').textContent=memories;document.getElementById('albumSummary').textContent=data.uploads?`${data.uploads} gerçek dosya kaydı`:'Henüz yükleme yok';
  document.getElementById('rsvpTotalLabel').textContent=`Toplam ${total} kayıtlı kişi`;document.getElementById('totalPeopleLabel').textContent=`${total} kişi`;document.getElementById('companionLabel').textContent=total?'Katılım formlarındaki kişi sayısı dahil':'Kayıtlı refakatçi yok';document.getElementById('rsvpPercent').textContent=`${percent(groups.attending)}%`;
  [['Attending','attending'],['Declined','declined'],['Pending','pending']].forEach(([id,key])=>{document.getElementById(`legend${id}`).textContent=groups[key];document.getElementById(`legend${id}Percent`).textContent=`${percent(groups[key])}%`});
  const donut=document.getElementById('rsvpDonut'),a=percent(groups.attending),d=percent(groups.declined);donut.style.background=`conic-gradient(#628d72 0 ${a}%,#ae6d70 ${a}% ${a+d}%,#d5ae74 ${a+d}% 100%)`;donut.setAttribute('aria-label',`Yüzde ${a} katılım`);
  const list=document.getElementById('activityList');list.innerHTML=data.activities.length?data.activities.map(item=>`<div class="activity"><span class="activity-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${icons[item.kind]||icons.check}</svg></span><div><p>${escapeHtml(item.text)}</p><small>${trDate(new Date(item.time),{dateStyle:'short',timeStyle:'short'})}</small></div></div>`).join(''):'<div class="activity-empty">Henüz gerçek bir etkinlik hareketi yok.</div>';
  updateStorageCard();
}
function formatBytes(bytes){if(!bytes)return '0 KB';const units=['B','KB','MB','GB','TB'],index=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1),value=bytes/1024**index;return `${value.toLocaleString('tr-TR',{maximumFractionDigits:index>1?2:0})} ${units[index]}`}
async function updateStorageCard(){
  const label=document.getElementById('storageUsageLabel'),bar=document.getElementById('storageProgress');try{let usage=0,quota=0;if(navigator.storage?.estimate){const estimate=await navigator.storage.estimate();usage=estimate.usage||0;quota=estimate.quota||0}else{const music=await getMusicFile();usage=(music?.file?.size||0)+new Blob([localStorage.getItem(scopedKey('lumaRealData'))||'',localStorage.getItem(scopedKey('lumaCoverImage'))||'']).size}label.textContent=quota?`${formatBytes(usage)} / ${formatBytes(quota)} kullanılıyor`:`${formatBytes(usage)} uygulama verisi`;bar.style.width=`${quota?Math.min(100,usage/quota*100):0}%`}catch{label.textContent='Depolama bilgisi alınamadı';bar.style.width='0%'}
}
let activeGuestFilter='all';
const statusLabels={attending:'Gelecek',declined:'Gelmeyecek',pending:'Cevap bekleniyor'};
function normalizedEmail(value){return value.trim().toLocaleLowerCase('tr-TR')}
function renderGuestTable(){
  const data=readData(),query=normalizedEmail(document.getElementById('guestSearchInput').value||'');
  const counts={all:data.guests.length,attending:0,declined:0,pending:0,external:0};data.guests.forEach(g=>{counts[g.status]++;if(g.source==='external')counts.external++});
  ['All','Attending','Declined','Pending','External'].forEach(key=>document.getElementById(`filter${key}Count`).textContent=counts[key.toLowerCase()]);
  const visible=data.guests.filter(g=>(activeGuestFilter==='all'||g.status===activeGuestFilter||activeGuestFilter==='external'&&g.source==='external')&&(!query||`${g.name} ${g.email}`.toLocaleLowerCase('tr-TR').includes(query)));
  const body=document.getElementById('guestTableBody'),empty=document.getElementById('guestEmptyState');body.innerHTML=visible.map(g=>`<tr><td><div class="guest-identity"><strong>${escapeHtml(g.name)}</strong><small>${escapeHtml(g.email)}</small></div></td><td><span class="status-badge status-${g.status}">${statusLabels[g.status]}</span></td><td><span class="source-badge source-${g.source}">${g.source==='external'?'Davet linkinden':'Yönetici ekledi'}</span></td><td>${g.people||1}</td><td><button class="guest-delete" data-delete-guest="${g.id}" aria-label="Misafiri sil">×</button></td></tr>`).join('');empty.classList.toggle('hidden',visible.length>0);
  body.querySelectorAll('[data-delete-guest]').forEach(button=>button.onclick=()=>{const next=readData();next.guests=next.guests.filter(g=>g.id!==button.dataset.deleteGuest);saveData(next);renderGuestTable();updateDashboard();toast('Misafir listeden kaldırıldı.')});
}
document.getElementById('addGuestForm').onsubmit=e=>{e.preventDefault();const data=readData(),name=document.getElementById('guestNameInput').value.trim(),email=normalizedEmail(document.getElementById('guestEmailInput').value);if(data.guests.some(g=>normalizedEmail(g.email)===email)){toast('Bu e-posta adresi zaten misafir listesinde.');return}data.guests.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,email,status:'pending',source:'admin',people:1,createdAt:new Date().toISOString()});addActivity(data,`${name} misafir listesine eklendi`,'userplus');saveData(data);e.currentTarget.reset();renderGuestTable();updateDashboard();toast('Misafir eklendi ve cevap bekleniyor listesine alındı.')};
document.querySelectorAll('#guestFilters [data-filter]').forEach(button=>button.onclick=()=>{activeGuestFilter=button.dataset.filter;document.querySelectorAll('#guestFilters button').forEach(x=>x.classList.toggle('active',x===button));renderGuestTable()});
document.getElementById('guestSearchInput').addEventListener('input',renderGuestTable);
document.getElementById('copyInviteLinkBtn').onclick=async()=>{const link=LumaConfig.inviteUrl(currentEventToken());try{await navigator.clipboard.writeText(link);toast('Bu etkinliğe özel davet bağlantısı kopyalandı.')}catch{window.prompt('Etkinliğe özel davet bağlantısını kopyalayın:',link)}};
document.querySelector('.notification').onclick=()=>{activeGuestFilter='external';document.querySelectorAll('#guestFilters button').forEach(x=>x.classList.toggle('active',x.dataset.filter==='external'));showView('guests')};
function mediaDb(){return new Promise((resolve,reject)=>{const request=indexedDB.open('lumaMedia',2);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('uploads'))request.result.createObjectStore('uploads',{keyPath:'id',autoIncrement:true});if(!request.result.objectStoreNames.contains('settings'))request.result.createObjectStore('settings',{keyPath:'key'})};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function saveMusicFile(file){const db=await mediaDb(),key=`music:${currentEventId()}`;return new Promise((resolve,reject)=>{const tx=db.transaction('settings','readwrite');if(file)tx.objectStore('settings').put({key,file,fileName:file.name,type:file.type});else tx.objectStore('settings').delete(key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)})}
async function getMusicFile(){const db=await mediaDb(),key=`music:${currentEventId()}`;return new Promise((resolve,reject)=>{const store=db.transaction('settings').objectStore('settings'),request=store.get(key);request.onsuccess=()=>{if(request.result||currentEventId()!=='default'){db.close();resolve(request.result||null);return}const legacy=store.get('music');legacy.onsuccess=()=>{db.close();resolve(legacy.result||null)};legacy.onerror=()=>reject(legacy.error)};request.onerror=()=>reject(request.error)})}
window.onGalleryPhotoDeleted=async()=>{const data=readData();data.uploads=Math.max(0,data.uploads-1);saveData(data);updateDashboard()};
function openMessageDetail(id){const item=readData().messages.find(message=>message.id===id);if(!item)return;document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;content.innerHTML=`<div class="message-detail"><div class="message-detail-mark">“</div><blockquote>${escapeHtml(item.message)}</blockquote><div class="message-detail-meta"><strong>${escapeHtml(item.name)}</strong><small>${trDate(new Date(item.createdAt),{dateStyle:'long',timeStyle:'short'})}</small></div></div>`;modal.classList.remove('hidden')}
function renderAdminMessages(){
  const data=readData(),list=document.getElementById('adminMessageList'),empty=document.getElementById('adminMessageEmpty');list.innerHTML=data.messages.slice().reverse().map(item=>`<article class="admin-message-card" data-view-message="${item.id}" tabindex="0" role="button" aria-label="${escapeHtml(item.name)} tarafından bırakılan mesajı aç"><blockquote>“${escapeHtml(item.message)}”</blockquote><div class="admin-message-meta"><div><strong>${escapeHtml(item.name)}</strong><small>${trDate(new Date(item.createdAt),{dateStyle:'short',timeStyle:'short'})}</small></div><button class="manager-delete" data-delete-message="${item.id}">Sil</button></div></article>`).join('');empty.classList.toggle('hidden',data.messages.length>0);
  list.querySelectorAll('[data-view-message]').forEach(card=>{card.onclick=()=>openMessageDetail(card.dataset.viewMessage);card.onkeydown=e=>{if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openMessageDetail(card.dataset.viewMessage)}}});
  list.querySelectorAll('[data-delete-message]').forEach(button=>button.onclick=e=>{e.stopPropagation();const item=data.messages.find(message=>message.id===button.dataset.deleteMessage);LumaGallery.openDeleteConfirmation('Mesaj silinsin mi?',`${item?.name||'Bu misafir'} tarafından bırakılan mesaj kalıcı olarak kaldırılacak.`,()=>{const next=readData();next.messages=next.messages.filter(message=>message.id!==button.dataset.deleteMessage);saveData(next);updateDashboard();renderAdminMessages();toast('Mesaj anı defterinden silindi.')})});
}
function openGuestUploadEntry(){
  if(!LumaConfig.publicEventToken()||!LumaConfig.shouldOpenUploadModal())return;
  document.getElementById('authScreen')?.classList.add('hidden');
  document.getElementById('dashboard')?.classList.add('hidden');
  document.getElementById('closeInvite')?.classList.add('hidden');
  document.body.classList.add('guest-upload-entry');
  document.body.style.overflow='hidden';
  openModal('upload');
}
function openModal(type){
  document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;content.innerHTML=modalTemplates[type];content.querySelectorAll('[data-icon]').forEach(el=>{el.outerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[el.dataset.icon]}</svg>`});modal.classList.remove('hidden');
  const form=content.querySelector('form');if(type==='rsvp'){const email=form.querySelector('input[type="email"]');email.required=true;email.previousElementSibling.textContent='E-POSTA';}
  if(type==='event')form.querySelector('[name="eventDate"]').value=new Date(Date.now()+30*864e5).toISOString().slice(0,16);
  if(type==='upload'){
    form.insertAdjacentHTML('afterbegin','<div class="field full"><label>AD SOYAD</label><input name="uploaderName" required placeholder="Adınız ve soyadınız"></div>');
    LumaUpload.bindUploadForm(form,async(result,uploaderName)=>{const data=readData();data.uploads+=result.uploaded.length;addActivity(data,`${uploaderName}, ${result.uploaded.length} yeni fotoğraf veya video yükledi`,'image');saveData(data);updateDashboard();renderGuestTable()});
  }
  if(form&&type!=='upload')form.onsubmit=async e=>{e.preventDefault();const data=readData();
    if(type==='event'){
      const value=name=>form.querySelector(`[name="${name}"]`).value.trim(),eventName=value('eventName'),meta={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),slug:LumaConfig.slugFromName(eventName),private_token:'',name:eventName,date:value('eventDate'),venue:value('eventVenue'),city:value('eventCity'),createdAt:new Date().toISOString()},events=eventList();events.push(meta);localStorage.setItem('lumaEvents',JSON.stringify(events));localStorage.setItem('lumaActiveEvent',JSON.stringify(meta));localStorage.setItem(scopedKey('lumaEventDate',meta.id),meta.date);localStorage.setItem(scopedKey('lumaInvitationContent',meta.id),JSON.stringify({...invitationContentDefaults,names:meta.name,venue:meta.venue,location:meta.city}));eventDate=new Date(meta.date);dateInput.value=meta.date;applyEventMeta(meta);updateDateContent(eventDate);tick();toast('Yeni etkinlik oluşturuldu ve aktif edildi.');setTimeout(()=>location.reload(),500);
    }else if(type==='rsvp'){
      const name=form.querySelector('input[required]:not([type="email"])').value.trim(),email=normalizedEmail(form.querySelector('input[type="email"]').value),statusIndex=[...form.querySelectorAll('input[name="status"]')].findIndex(x=>x.checked),status=['attending','declined','pending'][statusIndex],people=form.querySelector('select').selectedIndex+1;let guest=data.guests.find(g=>normalizedEmail(g.email)===email),external=false;
      if(guest){guest.name=name;guest.status=status;guest.people=people;guest.respondedAt=new Date().toISOString()}else{external=true;guest={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,email,status,people,source:'external',createdAt:new Date().toISOString(),respondedAt:new Date().toISOString()};data.guests.push(guest)}
      addActivity(data,external?`${name}, listede olmadan davet linkinden yanıt verdi`:`${name} katılım durumunu “${statusLabels[status]}” olarak güncelledi`,'check');
    }else{const name=form.querySelector('input[required]').value.trim(),message=form.querySelector('textarea[required]').value.trim();data.messages.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,message,createdAt:new Date().toISOString()});addActivity(data,`${name} anı defterine yazdı`,'book')}
    if(type!=='event'){saveData(data);updateDashboard();renderGuestTable()}modal.classList.add('hidden');if(type!=='event')toast(type==='rsvp'?'Katılım yanıtınız kaydedildi.':'Mesaj anı defteri sayacına eklendi.');
  }
}
window.closeModal=function(){const wasMediaViewer=modal.dataset.viewer==='media';modal.classList.add('hidden');document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;if(wasMediaViewer&&!document.getElementById('galleryView').classList.contains('hidden'))LumaGallery.renderAdminGallery()};
document.querySelectorAll('[data-modal]').forEach(b=>b.onclick=()=>openModal(b.dataset.modal));document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=closeModal);
document.getElementById('newEventBtn').onclick=()=>openModal('event');
async function passwordHash(value){if(globalThis.crypto?.subtle){const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,'0')).join('')}let hash=2166136261;for(const char of value)hash=Math.imul(hash^char.charCodeAt(0),16777619);return `fallback-${(hash>>>0).toString(16)}`}
function adminAccount(){try{return JSON.parse(localStorage.getItem('lumaAdminAccount')||'null')}catch{return null}}
function updatePlanUI(){const plan=localStorage.getItem('lumaPlan')||'free';document.getElementById('sidebarPlanName').textContent=plan==='premium'?'Premium Plan':'Free Plan';document.querySelectorAll('[data-plan]').forEach(button=>button.classList.toggle('active',button.dataset.plan===plan))}
function showAuthFeedback(message){const box=document.getElementById('authFeedback');box.textContent=message;box.classList.toggle('hidden',!message)}
function initializeAccess(){
  const publicToken=LumaConfig.publicEventToken();
  const account=adminAccount();
  const loggedIn=Boolean(sessionStorage.getItem('lumaAdminJwt'));
  if(publicToken){document.getElementById('authScreen').classList.add('hidden');dashboard.classList.add('hidden');return}
  document.getElementById('authScreen').classList.toggle('hidden',loggedIn);
  dashboard.classList.toggle('hidden',!loggedIn);
  const email=account?.email||sessionStorage.getItem('lumaAdminSession')||'';
  if(email){document.getElementById('settingsEmail').textContent=email;document.getElementById('sidebarUserName').textContent=email.split('@')[0]}
  if(loggedIn){syncBackendEvents().finally(()=>{const savedView=sessionStorage.getItem('lumaAdminView')||'overview';showView(savedView)})}
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
      if(result.reason==='invalid')showAuthFeedback('E-posta veya şifre hatalı. admin@example.com / change-me-admin deneyin.');
      else if(result.reason==='network')showAuthFeedback('Sunucuya bağlanılamadı. Backend çalışıyor mu?');
      else showAuthFeedback('Giriş şu an tamamlanamadı. Lütfen tekrar deneyin.');
      return;
    }
    localStorage.setItem('lumaAdminAccount',JSON.stringify({email,createdAt:new Date().toISOString()}));
    sessionStorage.setItem('lumaAdminSession',email);
    initializeAccess();
    toast('Yönetici paneline giriş yapıldı.');
  }catch{showAuthFeedback('Giriş işlenemedi. Tarayıcı depolama iznini kontrol edin.')}
  finally{button.disabled=false;button.textContent='Giriş Yap'}
};
document.getElementById('passwordChangeForm').onsubmit=async e=>{e.preventDefault();const account=adminAccount(),current=e.currentTarget.currentPassword.value,next=e.currentTarget.newPassword.value,confirm=e.currentTarget.confirmPassword.value;if(await passwordHash(current)!==account?.passwordHash){toast('Mevcut şifreniz hatalı.');return}if(next!==confirm){toast('Yeni şifreler eşleşmiyor.');return}account.passwordHash=await passwordHash(next);account.passwordChangedAt=new Date().toISOString();localStorage.setItem('lumaAdminAccount',JSON.stringify(account));e.currentTarget.reset();toast('Şifreniz başarıyla güncellendi.')};
function logout(){sessionStorage.removeItem('lumaAdminSession');sessionStorage.removeItem('lumaAdminJwt');location.reload()}
document.getElementById('logoutBtn').onclick=logout;
const userPopup=document.getElementById('userPopupMenu'),userMenuButton=document.getElementById('userMenuBtn');userMenuButton.onclick=e=>{e.stopPropagation();userPopup.classList.toggle('hidden');userMenuButton.setAttribute('aria-expanded',!userPopup.classList.contains('hidden'))};document.getElementById('profileBtn').onclick=()=>showView('profile');document.querySelector('[data-profile-action]').onclick=()=>{userPopup.classList.add('hidden');showView('profile')};document.querySelector('[data-logout-action]').onclick=logout;document.addEventListener('click',e=>{if(!document.getElementById('userCard').contains(e.target)){userPopup.classList.add('hidden');userMenuButton.setAttribute('aria-expanded','false')}});
document.querySelectorAll('[data-plan]').forEach(button=>button.onclick=()=>{localStorage.setItem('lumaPlan',button.dataset.plan);updatePlanUI();toast(`${button.dataset.plan==='premium'?'Premium':'Free'} plan seçildi.`)});
const invitationAudio=document.getElementById('invitationAudio'),musicButton=document.getElementById('musicBtn');
async function playInvitationMusic(){if(!invitationAudio.src){musicButton.classList.add('hidden');return}musicButton.classList.remove('hidden');try{await invitationAudio.play();musicButton.classList.add('playing');musicButton.classList.remove('needs-interaction');musicButton.querySelector('small').textContent='Çalıyor'}catch{musicButton.classList.add('needs-interaction');musicButton.querySelector('small').textContent='Müziği başlat'}}
musicButton.onclick=async()=>{if(!invitationAudio.src){toast('Bu davetiye için müzik seçilmemiş.');return}if(invitationAudio.paused){await playInvitationMusic()}else{invitationAudio.pause();musicButton.classList.remove('playing','needs-interaction');musicButton.querySelector('small').textContent='Müzik';toast('Müzik durduruldu')}};
document.getElementById('calendarBtn').onclick=()=>toast('Etkinlik takviminize eklendi.');
document.addEventListener('keydown',e=>{if(!modal.classList.contains('hidden')&&modal.dataset.viewer==='media'&&e.key==='ArrowLeft')LumaGallery.showMediaAt(LumaGallery.activeMediaIndex-1);if(!modal.classList.contains('hidden')&&modal.dataset.viewer==='media'&&e.key==='ArrowRight')LumaGallery.showMediaAt(LumaGallery.activeMediaIndex+1);if(e.key==='Escape'){if(!modal.classList.contains('hidden'))closeModal();else if(!invitation.classList.contains('hidden'))closeInvitation()}});

const defaultCover=LumaConfig.defaultCover,activeMeta=currentEventMeta(),storedDate=localStorage.getItem(scopedKey('lumaEventDate'))||(currentEventId()==='default'?localStorage.getItem('lumaEventDate'):null)||activeMeta.date||'2026-09-06T18:30';
let eventDate=new Date(storedDate),pendingCover=localStorage.getItem(scopedKey('lumaCoverImage'))||(currentEventId()==='default'?localStorage.getItem('lumaCoverImage'):null)||defaultCover;
const dateInput=document.getElementById('eventDateInput'),coverInput=document.getElementById('coverImageInput'),coverPreview=document.getElementById('coverPreview'),dropzone=document.getElementById('coverDropzone');
dateInput.value=storedDate;coverPreview.src=pendingCover;document.getElementById('inviteCoverImage').src=pendingCover;document.querySelector('.event-thumb').style.backgroundImage=`url("${pendingCover}")`;
function applyEventMeta(meta){
  if(!meta)return;document.querySelector('.hero-copy h1').textContent=meta.name;document.querySelector('.hero-place').textContent=`${meta.venue} · ${meta.city}`.toLocaleUpperCase('tr-TR');const venueText=document.querySelector('.detail-grid article:nth-child(2) p');venueText.replaceChildren(document.createTextNode(meta.venue),document.createElement('br'),document.createTextNode(meta.city));const footer=document.querySelector('.invite-footer p'),footerDate=document.createElement('span');footerDate.id='footerDate';footer.replaceChildren(document.createTextNode(`${meta.name} · `),footerDate);
}
function setupEventSwitcher(){const select=document.getElementById('eventSelect'),events=eventList();select.innerHTML=events.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('');select.value=currentEventId();select.disabled=Boolean(LumaConfig.publicEventToken());select.onchange=()=>{const selected=events.find(item=>item.id===select.value);if(!selected)return;localStorage.setItem('lumaActiveEvent',JSON.stringify(selected));location.reload()}}
function contactList(){try{return JSON.parse(localStorage.getItem('lumaContacts')||'[]')}catch{return []}}
function saveContacts(contacts){localStorage.setItem('lumaContacts',JSON.stringify(contacts));renderSavedContactSelect()}
function renderSavedContactSelect(){const select=document.getElementById('savedContactSelect'),contacts=contactList();select.innerHTML='<option value="">Kişi seçin (isteğe bağlı)</option>'+contacts.map(contact=>`<option value="${contact.id}">${escapeHtml(contact.name)} · ${escapeHtml(contact.email)}</option>`).join('')}
function openContactEventPicker(contact){
  const events=eventList(),email=normalizedEmail(contact.email);document.querySelector('.modal-card').classList.remove('media-viewer-card');delete modal.dataset.viewer;
  content.innerHTML=`<p class="invite-kicker">KİŞİNİN ETKİNLİKLERİ</p><h2>Etkinlik seç</h2><p><strong>${escapeHtml(contact.name)}</strong> kişisinin katılabileceği etkinlikleri işaretleyin. İşareti kaldırılan etkinliklerden kişi çıkarılır.</p><div class="event-picker-list">${events.map(event=>{const exists=readData(event.id).guests.some(guest=>normalizedEmail(guest.email)===email);return `<label class="event-picker-option"><input type="checkbox" value="${event.id}" ${exists?'checked':''}><span><strong>${escapeHtml(event.name)}</strong><small>${exists?'Şu anda misafir listesinde':trDate(eventDateFor(event),{day:'numeric',month:'long',year:'numeric'})}</small></span></label>`}).join('')}</div><div class="event-picker-actions"><button id="cancelEventPicker" class="confirm-cancel">Vazgeç</button><button id="confirmEventPicker" class="confirm-delete">Seçimleri Kaydet</button></div>`;
  modal.classList.remove('hidden');document.getElementById('cancelEventPicker').onclick=closeModal;document.getElementById('confirmEventPicker').onclick=()=>{let added=0,removed=0;events.forEach(event=>{const data=readData(event.id),existing=data.guests.some(guest=>normalizedEmail(guest.email)===email),selected=content.querySelector(`.event-picker-option input[value="${event.id}"]`).checked;if(selected&&!existing){data.guests.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${event.id}`,name:contact.name,email,status:'pending',source:'admin',people:1,createdAt:new Date().toISOString()});addActivity(data,`${contact.name} kayıtlı kişilerden misafir listesine eklendi`,'userplus');saveData(data,event.id);added++}else if(!selected&&existing){data.guests=data.guests.filter(guest=>normalizedEmail(guest.email)!==email);addActivity(data,`${contact.name} misafir listesinden çıkarıldı`,'users');saveData(data,event.id);removed++}});closeModal();updateDashboard();renderGuestTable();toast(added||removed?`${added} etkinliğe eklendi, ${removed} etkinlikten çıkarıldı.`:'Etkinlik seçimlerinde değişiklik yapılmadı.')}}
function renderProfile(){const events=eventList(),eventContainer=document.getElementById('profileEventList');eventContainer.innerHTML=events.map(event=>`<button class="profile-event ${event.id===currentEventId()?'active':''}" data-profile-event="${event.id}"><strong>${escapeHtml(event.name)}</strong><small>${trDate(eventDateFor(event),{day:'numeric',month:'long',year:'numeric'})} · ${escapeHtml(event.venue||'Mekân belirtilmedi')}</small><small>${event.private_token?escapeHtml(LumaConfig.inviteUrl(event.private_token)):'Davet bağlantısı senkronize ediliyor...'}</small></button>`).join('');eventContainer.querySelectorAll('[data-profile-event]').forEach(button=>button.onclick=()=>{const selected=events.find(event=>event.id===button.dataset.profileEvent);localStorage.setItem('lumaActiveEvent',JSON.stringify(selected));location.reload()});const contacts=contactList(),container=document.getElementById('contactList');container.innerHTML=contacts.map(contact=>`<div class="contact-row"><div><strong>${escapeHtml(contact.name)}</strong><small>${escapeHtml(contact.email)}</small></div><button data-select-events="${contact.id}">Etkinlik seç</button><button class="contact-delete" data-delete-contact="${contact.id}">Sil</button></div>`).join('');document.getElementById('contactEmpty').classList.toggle('hidden',contacts.length>0);container.querySelectorAll('[data-select-events]').forEach(button=>button.onclick=()=>openContactEventPicker(contacts.find(contact=>contact.id===button.dataset.selectEvents)));container.querySelectorAll('[data-delete-contact]').forEach(button=>button.onclick=()=>{saveContacts(contacts.filter(contact=>contact.id!==button.dataset.deleteContact));renderProfile();toast('Kişi rehberden kaldırıldı.')})}
document.getElementById('savedContactSelect').onchange=e=>{const contact=contactList().find(item=>item.id===e.currentTarget.value);if(!contact)return;document.getElementById('guestNameInput').value=contact.name;document.getElementById('guestEmailInput').value=contact.email};
document.getElementById('contactForm').onsubmit=e=>{e.preventDefault();const contacts=contactList(),name=document.getElementById('contactName').value.trim(),email=normalizedEmail(document.getElementById('contactEmail').value);if(contacts.some(contact=>normalizedEmail(contact.email)===email)){toast('Bu e-posta rehberde zaten kayıtlı.');return}contacts.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,email,createdAt:new Date().toISOString()});saveContacts(contacts);e.currentTarget.reset();renderProfile();toast('Kişi rehbere kaydedildi.')};
const invitationContentDefaults={names:'Melisa & Berk',tagline:'Birlikte, sonsuza...',storyTitle:'Hayat, seninle daha güzel.',storyText:'Bir kahveyle başlayan hikâyemiz, şimdi en güzel “evet”e hazırlanıyor. Bu özel günümüzde sevincimizi sizinle paylaşmak için sabırsızlanıyoruz.',venue:'The Marmara Esma Sultan',location:'Ortaköy, Beşiktaş · İstanbul',guestNote:'Şıklığınızı yansıtan kokteyl veya gece kıyafeti.'};
function invitationContentFromForm(){return {names:document.getElementById('contentCoupleNames').value.trim(),tagline:document.getElementById('contentTagline').value.trim(),storyTitle:document.getElementById('contentStoryTitle').value.trim(),storyText:document.getElementById('contentStoryText').value.trim(),venue:document.getElementById('contentVenue').value.trim(),location:document.getElementById('contentLocation').value.trim(),guestNote:document.getElementById('contentGuestNote').value.trim()}}
function applyInvitationContent(data){const contentData={...invitationContentDefaults,...data};document.getElementById('inviteNames').textContent=contentData.names;document.getElementById('inviteTagline').textContent=contentData.tagline;document.getElementById('inviteStoryTitle').textContent=contentData.storyTitle;document.getElementById('inviteStoryText').textContent=contentData.storyText;document.getElementById('inviteHeroPlace').textContent=`${contentData.venue} · ${contentData.location}`.toLocaleUpperCase('tr-TR');const venueText=document.querySelector('.detail-grid article:nth-child(2) p');venueText.replaceChildren(document.createTextNode(contentData.venue),document.createElement('br'),document.createTextNode(contentData.location));document.querySelector('.detail-grid article:nth-child(3) p').textContent=contentData.guestNote;document.querySelector('.signature').textContent=contentData.names.split(/\s*&\s*|\s+/).filter(Boolean).slice(0,2).map(part=>part[0].toLocaleUpperCase('tr-TR')).join(' & ');const footer=document.querySelector('.invite-footer p'),dateSpan=document.getElementById('footerDate')||document.createElement('span');dateSpan.id='footerDate';footer.replaceChildren(document.createTextNode(`${contentData.names} · `),dateSpan)}
function loadInvitationContentEditor(){let data={...invitationContentDefaults,names:activeMeta.name,venue:activeMeta.venue,location:activeMeta.city};try{const legacy=currentEventId()==='default'?localStorage.getItem('lumaInvitationContent'):null;data={...data,...JSON.parse(localStorage.getItem(scopedKey('lumaInvitationContent'))||legacy||'{}')}}catch{};document.getElementById('contentCoupleNames').value=data.names;document.getElementById('contentTagline').value=data.tagline;document.getElementById('contentStoryTitle').value=data.storyTitle;document.getElementById('contentStoryText').value=data.storyText;document.getElementById('contentVenue').value=data.venue;document.getElementById('contentLocation').value=data.location;document.getElementById('contentGuestNote').value=data.guestNote;applyInvitationContent(data)}
function updateDateContent(date){
  if(Number.isNaN(date.getTime()))return;
  const dayMonthYear=trDate(date,{day:'numeric',month:'long',year:'numeric'}),weekday=trDate(date,{weekday:'long'}),time=trDate(date,{hour:'2-digit',minute:'2-digit'}),capitalWeekday=weekday.charAt(0).toUpperCase()+weekday.slice(1);
  document.getElementById('selectedDatePreview').textContent=`${dayMonthYear}, ${capitalWeekday} · ${time}`;
  document.getElementById('dashboardDate').textContent=`${dayMonthYear} · ${capitalWeekday}`;
  document.getElementById('dashboardDateTime').textContent=`${capitalWeekday}, ${dayMonthYear} · ${time}`;
  document.getElementById('heroDate').textContent=[date.getDate(),date.getMonth()+1,date.getFullYear()].map((x,i)=>i<2?String(x).padStart(2,'0'):x).join(' · ');
  document.getElementById('detailDate').textContent=`${dayMonthYear}, ${capitalWeekday}`;
  document.getElementById('detailTime').textContent=`Kokteyl ${time} · Davet ${trDate(new Date(date.getTime()+36e5),{hour:'2-digit',minute:'2-digit'})}`;
  document.getElementById('footerDate').textContent=dayMonthYear;
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
const musicInput=document.getElementById('musicFileInput'),musicFileName=document.getElementById('musicFileName'),musicAdminPreview=document.getElementById('musicAdminPreview'),musicPreviewAudio=document.getElementById('musicPreviewAudio');let pendingMusicFile,removePendingMusic=false;
function showMusicPreview(file,fileName){const url=URL.createObjectURL(file);musicFileName.textContent=fileName;musicPreviewAudio.src=url;invitationAudio.src=url;musicAdminPreview.classList.remove('hidden');musicButton.classList.remove('hidden')}
async function loadSavedMusic(){try{const record=await getMusicFile();if(record)showMusicPreview(record.file,record.fileName);else musicButton.classList.add('hidden')}catch{musicButton.classList.add('hidden')}}
musicInput.onchange=()=>{const file=musicInput.files[0];if(!file)return;if(file.size>15*1024*1024){toast('Müzik dosyası en fazla 15 MB olabilir.');musicInput.value='';return}pendingMusicFile=file;removePendingMusic=false;showMusicPreview(file,file.name)};
document.getElementById('removeMusicBtn').onclick=()=>{pendingMusicFile=undefined;removePendingMusic=true;musicInput.value='';musicFileName.textContent='Müzik dosyası seç';musicPreviewAudio.removeAttribute('src');musicPreviewAudio.load();invitationAudio.removeAttribute('src');invitationAudio.load();musicAdminPreview.classList.add('hidden');musicButton.classList.add('hidden');toast('Müzik kaldırılmak üzere işaretlendi.')};
document.getElementById('editorPreviewBtn').onclick=()=>{document.getElementById('inviteCoverImage').src=pendingCover;updateDateContent(new Date(dateInput.value));applyInvitationContent(invitationContentFromForm());openInvitation()};
document.getElementById('inviteEditorForm').onsubmit=async e=>{
  e.preventDefault();eventDate=new Date(dateInput.value);updateDateContent(eventDate);document.getElementById('inviteCoverImage').src=pendingCover;document.querySelector('.event-thumb').style.backgroundImage=`url("${pendingCover}")`;
  localStorage.setItem(scopedKey('lumaEventDate'),dateInput.value);try{if(pendingCover===defaultCover)localStorage.removeItem(scopedKey('lumaCoverImage'));else localStorage.setItem(scopedKey('lumaCoverImage'),pendingCover);if(removePendingMusic)await saveMusicFile(null);else if(pendingMusicFile)await saveMusicFile(pendingMusicFile);const contentData=invitationContentFromForm();localStorage.setItem(scopedKey('lumaInvitationContent'),JSON.stringify(contentData));applyInvitationContent(contentData)}catch{toast('Davetiye ayarları kaydedilemedi.');return}pendingMusicFile=undefined;removePendingMusic=false;updateStorageCard();toast('Davetiye içeriği ve görünümü kaydedildi.');
};
function eventDateFor(meta){return new Date(localStorage.getItem(scopedKey('lumaEventDate',meta.id))||meta.date)}
function nearestUpcomingEvent(){const now=Date.now(),upcoming=eventList().map(meta=>({meta,date:eventDateFor(meta)})).filter(item=>!Number.isNaN(item.date.getTime())&&item.date.getTime()>=now).sort((a,b)=>a.date-b.date);return upcoming[0]||{meta:activeMeta,date:eventDate}}
function countdownValues(date){const diff=Math.max(0,date-new Date()),values=[Math.floor(diff/864e5),Math.floor(diff/36e5)%24,Math.floor(diff/6e4)%60,Math.floor(diff/1e3)%60];return {diff,days:values[0],nums:values.map(value=>String(value).padStart(2,'0'))}}
function tick(){const selected=countdownValues(eventDate),nearest=nearestUpcomingEvent(),next=countdownValues(nearest.date);document.getElementById('daysRemaining').textContent=next.diff?`${next.days} gün kaldı`:'Etkinlik tarihi geldi';document.getElementById('dashboardDateTime').textContent=`${nearest.meta.name} · ${trDate(nearest.date,{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}`;document.getElementById('sidebarDaysRemaining').textContent=selected.diff?`Etkinliğinize ${selected.days} gün kaldı.`:'Etkinlik tarihi geldi.';document.querySelectorAll('.mini-countdown b').forEach((el,i)=>el.childNodes[0].nodeValue=next.nums[i]);document.querySelectorAll('#publicCountdown b').forEach((el,i)=>el.textContent=selected.nums[i])}
LumaGallery.bindFavoriteFilter();
initializeAccess();updatePlanUI();setupEventSwitcher();renderSavedContactSelect();applyEventMeta(activeMeta);loadInvitationContentEditor();updateDateContent(eventDate);syncPhotoCount().finally(()=>{updateDashboard();renderGuestTable()});tick();setInterval(tick,1000);
if(LumaConfig.publicEventToken()){
  if(LumaConfig.shouldOpenUploadModal())openGuestUploadEntry();
  else{document.getElementById('closeInvite').classList.add('hidden');loadSavedMusic().finally(()=>openInvitation())}
}else{loadSavedMusic()}
