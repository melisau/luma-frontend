window.LumaInvitationColors={
  overrides:{},
  labels:{background:'Davetiye arka planı',text:'Ana yazılar',heading:'Başlıklar',hero_text:'Kapak üzerindeki yazılar',details_background:'Etkinlik detayları arka planı',memory_background:'Fotoğraf / anı alanı arka planı',memory_text:'Fotoğraf / anı alanı yazıları',badge_background:'Anı sayısı rozeti arka planı',badge_text:'Anı sayısı rozeti yazıları',button_background:'Düğme arka planı',button_text:'Düğme yazıları',countdown_background:'Geri sayım / alt bilgi arka planı',countdown_text:'Geri sayım / alt bilgi yazıları'},
  defaults(theme){
    const common={background:'#F8F5EF',text:'#242B27',heading:'#25463B',hero_text:'#FFFFFF',details_background:'#EDF0E7',memory_background:'#F8F5EF',memory_text:'#242B27',badge_background:'#925551',badge_text:'#FFFFFF',button_background:'#25463B',button_text:'#FFFFFF',countdown_background:'#25463B',countdown_text:'#FFFFFF'};
    if(theme==='minimal')return {...common,background:'#FFFFFF',text:'#181818',heading:'#181818',details_background:'#F4F4F2',memory_background:'#FFFFFF',memory_text:'#181818',badge_background:'#151515',button_background:'#151515',countdown_background:'#151515'};
    if(theme==='celebration')return {...common,background:'#FFF8EE',text:'#432843',heading:'#432843',details_background:'#FBE8D8',memory_background:'#FFF8EE',memory_text:'#432843',badge_background:'#E77D5F',button_background:'#6D315F',countdown_background:'#6D315F'};
    return common;
  },
  sanitize(palette){return Object.fromEntries(Object.entries(palette||{}).filter(([key,value])=>Object.hasOwn(this.labels,key)&&typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)));},
  apply(target,palette,theme){
    const colors={...this.defaults(theme),...this.sanitize(palette)};
    target.dataset.palette='customizable';
    for(const [key,value] of Object.entries(colors))target.style.setProperty('--invite-'+key.replaceAll('_','-'),value);
  },
  readEditor(){return {...this.overrides};},
  fillEditor(palette,theme){this.overrides=this.sanitize(palette);this.refreshEditor(theme);},
  refreshEditor(theme){const colors={...this.defaults(theme),...this.overrides};for(const key of Object.keys(this.labels)){const input=document.getElementById('palette_'+key);if(input){input.value=colors[key];this.syncHex(input);}}},
  syncHex(input){
    const hex=document.getElementById(input.id+'_hex');
    if(hex){hex.value=input.value.toUpperCase();hex.setCustomValidity('');hex.removeAttribute('aria-invalid');}
  },
  addHexInputs(){
    document.querySelectorAll('.editor-field input[type="color"]').forEach(input=>{
      if(document.getElementById(input.id+'_hex'))return;
      const label=input.closest('label'),field=document.createElement('div');
      field.className=label.className;field.innerHTML=label.innerHTML;label.replaceWith(field);
      // Keep the original color element so its existing event handlers survive.
      field.querySelector('input[type="color"]').replaceWith(input);
      const name=field.querySelector('span').textContent;
      input.setAttribute('aria-label',name+' renk seçici');
      const row=document.createElement('div');row.className='color-code-row';
      input.before(row);row.append(input);
      const hex=document.createElement('input');hex.type='text';hex.id=input.id+'_hex';hex.className='color-hex-input';hex.maxLength=7;hex.spellcheck=false;hex.autocomplete='off';hex.placeholder='#FFFFFF';hex.setAttribute('aria-label',name+' HEX kodu');
      row.append(hex);this.syncHex(input);
      input.addEventListener('input',()=>this.syncHex(input));
      hex.addEventListener('input',()=>{
        const value=hex.value.trim().replace(/^#?/,'#');
        if(!/^#[0-9a-f]{6}$/i.test(value)){hex.setCustomValidity('Altı haneli bir HEX renk kodu girin. Örn. #25463B');hex.setAttribute('aria-invalid','true');return;}
        hex.setCustomValidity('');hex.removeAttribute('aria-invalid');input.value=value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
      });
      hex.addEventListener('blur',()=>{if(hex.validity.valid)this.syncHex(input);});
    });
  },
  init(){
    const section=document.createElement('section');section.className='editor-panel invitation-colors-panel';
    section.innerHTML='<div class="editor-panel-head"><span>◌</span><div><h2>Davetiye renkleri</h2><p>Etkinliğine uygun renkleri seç. Değişiklikleri canlı önizlemede görebilir, Kaydet ile etkinliğine uygulayabilirsin.</p></div></div><div class="invitation-color-grid">'+Object.entries(this.labels).map(([key,label])=>'<label class="editor-field"><span>'+label+'</span><input type="color" id="palette_'+key+'" data-palette-color="'+key+'"></label>').join('')+'</div><button type="button" class="text-btn" id="resetInvitationColors">Tema renklerine dön</button>';
    document.querySelector('.opening-style-panel').after(section);
    section.querySelectorAll('[data-palette-color]').forEach(input=>input.addEventListener('input',()=>{this.overrides[input.dataset.paletteColor]=input.value;this.apply(document.getElementById('invitation'),this.overrides,document.getElementById('contentTheme').value);}));
    document.getElementById('resetInvitationColors').onclick=()=>{this.fillEditor({},document.getElementById('contentTheme').value);this.apply(document.getElementById('invitation'),{},document.getElementById('contentTheme').value);};
    document.getElementById('contentTheme').addEventListener('change',()=>{const theme=document.getElementById('contentTheme').value;this.refreshEditor(theme);this.apply(document.getElementById('invitation'),this.overrides,theme);});
    this.addHexInputs();
    this.refreshEditor('romantic');
  }
};
