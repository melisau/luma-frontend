window.LumaRsvpAccess = {
  initialEvent: LumaConfig.publicEventToken(),
  initialHash: new URLSearchParams(appLocation().hash.slice(1)),
  key(event,email){return `luma-rsvp:${event}:${email.trim().toLowerCase()}`},
  credential(event,email){
    const hash=this.initialHash;
    if(event===this.initialEvent&&hash.get('email')?.toLowerCase()===email.trim().toLowerCase()&&hash.get('rsvp'))return hash.get('rsvp');
    try{return localStorage.getItem(this.key(event,email))}catch{return null}
  },
  save(event,email,credential){try{localStorage.setItem(this.key(event,email),credential)}catch{}},
  link(event,email,credential){return `${LumaConfig.inviteUrl(event)}#rsvp=${encodeURIComponent(credential)}&email=${encodeURIComponent(email)}`},
  email(){return this.initialHash.get('email')||''},
  showLink(container,event,email,credential){
    const label=document.createElement('label');label.textContent='Kişisel RSVP bağlantınız';
    const input=document.createElement('input');input.readOnly=true;input.value=this.link(event,email,credential);input.setAttribute('aria-label','Kişisel RSVP bağlantınız');input.style.width='100%';label.appendChild(input);
    const note=document.createElement('p');note.textContent='Yanıtınızı değiştirmek için bu bağlantıyı saklayın. Bağlantıyı yalnızca ilgili misafirle paylaşın.';
    const button=document.createElement('button');button.type='button';button.textContent='Bağlantıyı kopyala';
    button.onclick=async()=>{try{await navigator.clipboard.writeText(input.value);button.textContent='Kopyalandı'}catch{input.select();button.textContent='Bağlantıyı seçip kopyalayın'}};
    container.append(label,note,button);
  }
};

if(window.LumaRsvpAccess.initialEvent&&window.LumaRsvpAccess.email()&&window.LumaRsvpAccess.initialHash.get('rsvp')){
  window.LumaRsvpAccess.save(window.LumaRsvpAccess.initialEvent,window.LumaRsvpAccess.email(),window.LumaRsvpAccess.initialHash.get('rsvp'));
}
