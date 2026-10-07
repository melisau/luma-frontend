/* Compact editor for decorative layers and exhibition photos. The saved layer format is unchanged. */
(() => {
  const editor = window.LumaVisualLayers;
  const photoPositions = {'after-hero':'Kapaktan sonra','after-story':'Hikâyeden sonra','after-details':'Detaylardan sonra','before-memories':'Anı bölümünden önce'};
  const isPhoto = item => Object.hasOwn(photoPositions,item.position);
  const limit = 32;

  editor.addFiles = function(files,group){
    let added=0;
    for(const file of files){
      if(this.items.length>=limit){toast(`En fazla ${limit} görsel ekleyebilirsiniz.`);break}
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){toast('JPG, PNG veya WebP ve en fazla 5 MB seçin.');continue}
      const src=URL.createObjectURL(file);this.urls.push(src);
      this.items.push({id:'draft-'+Date.now()+'-'+Math.random().toString(16).slice(2),src,file,position:group==='photo'?'after-details':'hero-foreground',placement:group==='photo'?'custom':'center',background_fit:'cover',frame:group==='photo'?'arch':'none',motion:'none',width:group==='photo'?70:25,x:50,y:50,caption:''});added++;
    }
    this.renderEditor();if(added)toast(`${added} görsel eklendi. Değişiklikleri Kaydet ile yayınlayabilirsiniz.`);
  };

  editor.init = function(){
    const panel=document.createElement('section');panel.className='editor-panel visual-editor';
    panel.innerHTML=`<div class="editor-panel-head"><span>✧</span><div><h2>Sticker ve görsel katmanlar</h2><p>Davetiyenin üzerine eklenecek dekorları topluca yükleyin. Ayrıntıları istediğiniz görselde açın.</p></div></div>
      <div class="visual-upload-bar"><label class="visual-add">+ Sticker veya görsel ekle<input id="visualFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label><small>JPG, PNG veya WebP · Her biri en fazla 5 MB</small></div>
      <details class="visual-preset-library"><summary>Hazır Halloween stickerları</summary><div>${Object.entries(this.stickerPresets).map(([key,label])=>`<button type="button" data-sticker="${key}"><img src="/assets/images/stickers/halloween-${key}.png" alt=""><span>${label}</span></button>`).join('')}</div></details>
      <div id="visualLayerRows" class="visual-card-grid"></div>`;
    document.getElementById('coverDropzone').closest('.editor-panel').after(panel);
    panel.querySelector('#visualFiles').onchange=e=>{this.addFiles(e.target.files,'decor');e.target.value=''};
    panel.querySelectorAll('[data-sticker]').forEach(button=>button.onclick=async()=>{button.disabled=true;try{await this.addSticker(button.dataset.sticker)}catch{toast('Sticker eklenemedi. Lütfen tekrar deneyin.')}finally{button.disabled=false}});
  };

  editor.attachExhibition = function(panel){
    const area=document.createElement('div');area.className='exhibition-editor';
    area.innerHTML=`<div class="exhibition-editor-head"><div><h3>Sergi fotoğrafları</h3><p>Fotoğrafları topluca ekleyin. Her biri aynı çerçeve ve genişlikle başlar.</p></div><label class="visual-add">+ Fotoğraf ekle<input id="exhibitionFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label></div><div id="exhibitionRows" class="visual-card-grid"></div>`;
    const help=panel.querySelector('.visual-help');help.replaceWith(area);
    area.querySelector('#exhibitionFiles').onchange=e=>{this.addFiles(e.target.files,'photo');e.target.value=''};
    this.renderEditor();
  };

  editor.renderEditor = function(){
    this.closeSelectMenu();this.closeInspector?.();
    for(const [group,id] of [['decor','visualLayerRows'],['photo','exhibitionRows']]){
      const container=document.getElementById(id);if(!container)continue;container.replaceChildren();
      const indexed=this.items.map((item,index)=>({item,index})).filter(({item})=>isPhoto(item)===(group==='photo'));
      if(!indexed.length){const empty=document.createElement('p');empty.className='visual-empty';empty.textContent=group==='photo'?'Henüz sergi fotoğrafı eklenmedi.':'Henüz sticker veya görsel katman eklenmedi.';container.appendChild(empty);continue}
      indexed.forEach(({item,index},order)=>{
        const card=document.createElement('article');card.className='visual-item-card';
        const image=document.createElement('img');image.src=item.src;image.alt=item.caption||'Görsel önizlemesi';
        const info=document.createElement('div');info.className='visual-item-info';
        const name=document.createElement('strong');name.textContent=item.caption||item.file?.name||`${group==='photo'?'Sergi fotoğrafı':'Görsel'} ${order+1}`;
        const detail=document.createElement('small');detail.textContent=`${(group==='photo'?photoPositions:this.positions)[item.position]||this.positions[item.position]||'Görsel'} · ${item.width}%${group==='photo'?' · '+this.frames[item.frame]:''}`;
        info.append(name,detail);
        const actions=document.createElement('div');actions.className='visual-item-actions';
        const edit=document.createElement('button');edit.type='button';edit.textContent='Düzenle';edit.onclick=()=>this.openInspector(item,group,edit);
        const up=document.createElement('button');up.type='button';up.textContent='↑';up.setAttribute('aria-label','Yukarı taşı');up.disabled=order===0;up.onclick=()=>this.moveWithinGroup(index,-1,group);
        const down=document.createElement('button');down.type='button';down.textContent='↓';down.setAttribute('aria-label','Aşağı taşı');down.disabled=order===indexed.length-1;down.onclick=()=>this.moveWithinGroup(index,1,group);
        const remove=document.createElement('button');remove.type='button';remove.textContent='Kaldır';remove.onclick=()=>{this.items.splice(index,1);if(item.file){URL.revokeObjectURL(item.src);this.urls=this.urls.filter(url=>url!==item.src)}this.renderEditor()};
        actions.append(edit,up,down,remove);card.append(image,info,actions);container.appendChild(card);
      });
    }
    window.LumaEditorPreview?.schedule();
  };

  editor.moveWithinGroup = function(index,direction,group){
    const indices=this.items.flatMap((item,i)=>isPhoto(item)===(group==='photo')?[i]:[]);
    const other=indices[indices.indexOf(index)+direction];if(other===undefined)return;
    [this.items[index],this.items[other]]=[this.items[other],this.items[index]];this.renderEditor();
  };

  editor.closeInspector = function(){
    if(!this.inspector)return;this.closeSelectMenu();this.inspector.remove();this.inspector=null;
    if(this.inspectorPreviewMarker){this.inspectorPreviewMarker.replaceWith(this.inspectorPreview);this.inspectorPreviewMarker=null;this.inspectorPreview=null}
    document.body.style.overflow=this.inspectorOverflow??'';
    document.removeEventListener('keydown',this.inspectorKey);
    this.inspectorReturn?.focus({preventScroll:true});this.inspectorReturn=null;
  };

  editor.openInspector = function(item,group,returnButton){
    this.closeInspector?.();this.inspectorReturn=returnButton;this.inspectorOverflow=document.body.style.overflow;
    const overlay=document.createElement('div');overlay.className='visual-inspector-overlay';
    const positions=group==='photo'?photoPositions:Object.fromEntries(Object.entries(this.positions).filter(([key])=>!Object.hasOwn(photoPositions,key)));
    const field=(label,key,control)=>`<label class="editor-field"><span>${label}</span>${control}</label>`;
    const select=(key,values)=>`<select data-field="${key}">${this.options(values)}</select>`;
    overlay.innerHTML=`<div class="visual-inspector" role="dialog" aria-modal="true" aria-label="Görseli düzenle"><div class="visual-inspector-head"><div><h3>${group==='photo'?'Sergi fotoğrafını düzenle':'Görsel katmanı düzenle'}</h3><p>Ayarlar yalnızca bu görsele uygulanır.</p></div><button type="button" class="visual-inspector-close" aria-label="Kapat">×</button></div><img class="visual-inspector-image" alt="Görsel önizlemesi"><div class="visual-inspector-fields">${field(group==='photo'?'SERGİDEKİ YERİ':'KONUM / KATMAN','position',select('position',positions))}${field('ÇERÇEVE','frame',select('frame',this.frames))}${field('GENİŞLİK (%)','width','<input data-field="width" type="number" min="5" max="100">')}${field('HAREKET','motion',select('motion',this.motions))}${group==='photo'?'':field('ARKA PLAN GÖRÜNÜMÜ','background_fit',select('background_fit',this.backgroundFits))+field('ÖN PLAN HİZALAMA','placement',select('placement',this.placements))+field('YATAY KONUM (%)','x','<input data-field="x" type="number" min="0" max="100">')+field('DİKEY KONUM (%)','y','<input data-field="y" type="number" min="0" max="100">')}${field('AÇIKLAMA','caption','<input data-field="caption" maxlength="255">')}</div><button type="button" class="create-btn visual-inspector-done">Bitti</button></div>`;
    const modal=overlay.querySelector('.visual-inspector'),main=document.createElement('div');main.className='visual-inspector-main';
    while(modal.firstChild)main.appendChild(modal.firstChild);modal.appendChild(main);
    const preview=document.querySelector('.editor-mobile-preview');
    if(preview){const marker=document.createComment('Mobil önizlemenin önceki konumu');preview.replaceWith(marker);this.inspectorPreviewMarker=marker;this.inspectorPreview=preview;modal.appendChild(preview)}
    document.body.appendChild(overlay);this.inspector=overlay;document.body.style.overflow='hidden';
    overlay.querySelector('.visual-inspector-image').src=item.src;
    overlay.querySelectorAll('[data-field]').forEach(input=>{input.value=item[input.dataset.field];input.oninput=()=>{item[input.dataset.field]=input.type==='number'?Number(input.value):input.value;window.LumaEditorPreview?.schedule()};input.onchange=()=>{if(input.dataset.field==='placement'){const anchor=this.anchors[item.placement];if(anchor)[item.x,item.y]=anchor}if(input.dataset.field==='position'&&this.isBackground(item))item.motion='none';this.syncInspector(item,group);if(input.dataset.field==='position')this.focusInspectorPreview(item,group)}});
    overlay.querySelectorAll('select[data-field]').forEach(input=>this.enhanceSelect(input));
    this.syncInspector(item,group);
    overlay.querySelector('.visual-inspector-close').onclick=()=>this.closeInspector();overlay.querySelector('.visual-inspector-done').onclick=()=>{this.closeInspector();this.renderEditor()};
    overlay.onclick=e=>{if(e.target===overlay){this.closeInspector();this.renderEditor()}};
    this.inspectorKey=e=>{if(e.key==='Escape'&&!this.selectMenu){this.closeInspector();this.renderEditor()}};
    document.addEventListener('keydown',this.inspectorKey);overlay.querySelector('.visual-inspector-close').focus({preventScroll:true});this.focusInspectorPreview(item,group);
  };

  editor.focusInspectorPreview = function(item,group){
    const preview=window.LumaEditorPreview,select=document.getElementById('mobilePreviewSection');if(!preview||!select)return;
    const sections={'opening-background':'opening-envelope','hero-background':'inviteHero','hero-foreground':'inviteHero','invitation-background':'inviteHero','story-background':'story','sticker-story':'story','details-background':'details','sticker-details':'details','memories-background':'memories','sticker-memories':'memories','exhibition-background':'exhibition','sticker-exhibition':'exhibition','countdown-background':'details','sticker-countdown':'details','footer-background':'memories'};
    select.value=group==='photo'?'exhibition':sections[item.position]||'inviteHero';preview.focusedPosition=item.position;preview.following=true;preview.schedule();
  };

  editor.syncInspector = function(item,group){
    if(!this.inspector)return;const background=this.isBackground(item),sticker=this.isSticker(item);
    for(const key of ['frame','width','caption']){const control=this.inspector.querySelector(`[data-field=${key}]`);control.disabled=background;const button=control.nextElementSibling;if(button?.classList.contains('visual-select-trigger'))button.disabled=control.disabled}
    for(const key of ['background_fit','placement','x','y']){const control=this.inspector.querySelector(`[data-field=${key}]`);if(!control)continue;control.disabled=key==='background_fit'?!background:key==='placement'?!sticker:!sticker||item.placement!=='custom';const button=control.nextElementSibling;if(button?.classList.contains('visual-select-trigger'))button.disabled=control.disabled}
    for(const key of ['x','y']){const control=this.inspector.querySelector(`[data-field=${key}]`);if(control)control.value=item[key]}
  };
})();
