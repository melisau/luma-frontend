window.LumaGallery = {
  adminMediaItems: [],
  adminAllItems: [],
  publicMediaItems: [],
  activeMediaIndex: 0,
  showFavoritesOnly: false,
  adminStatusFilter: 'all',

  statusLabels: {
    uploaded: 'Bekliyor',
    approved: 'Onaylı',
    hidden: 'Gizli',
  },

  normalizePhoto(photo, token, { admin = false } = {}) {
    const headers = admin ? LumaConfig.adminAuthHeaders() : {};
    const thumbPath = photo.thumbnail_url || LumaConfig.photoThumbnailUrl(photo.id, admin ? null : token);
    const originalPath = photo.original_url || LumaConfig.photoOriginalUrl(photo.id, admin ? null : token);
    return {
      id: photo.id,
      fileName: photo.original_filename || 'fotoğraf.jpg',
      name: photo.uploader_name,
      createdAt: photo.created_at,
      favorite: Boolean(photo.favorite),
      status: photo.status || 'uploaded',
      thumbPath,
      originalPath,
      admin,
      authHeaders: headers
    };
  },

  statusBadge(status) {
    const label = this.statusLabels[status] || status;
    return `<span class="photo-status-badge status-${Luma.escapeHtml(status)}">${Luma.escapeHtml(label)}</span>`;
  },

  filteredAdminItems() {
    let items = this.adminAllItems;
    if (this.adminStatusFilter !== 'all') {
      items = items.filter(item => item.status === this.adminStatusFilter);
    }
    if (this.showFavoritesOnly) {
      items = items.filter(item => item.favorite);
    }
    return items;
  },

  updateFilterCounts() {
    const counts = { all: 0, uploaded: 0, approved: 0, hidden: 0 };
    this.adminAllItems.forEach(item => {
      counts.all += 1;
      if (counts[item.status] != null) counts[item.status] += 1;
    });
    ['All', 'Uploaded', 'Approved', 'Hidden'].forEach(key => {
      const el = document.getElementById(`photoFilter${key}Count`);
      if (el) el.textContent = counts[key.toLowerCase()] ?? 0;
    });
  },

  secureImageSrc(path, admin) {
    if (!admin) return path;
    return path;
  },

  async fetchPhotos(token = LumaConfig.getEventToken(), { admin = false } = {}) {
    const url = admin ? LumaConfig.adminPhotosUrl(token) : LumaConfig.photosUrl(token);
    const headers = admin ? LumaConfig.adminAuthHeaders() : {};
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Galeri verileri okunamadı.');
    const photos = await response.json();
    return photos.map(photo => this.normalizePhoto(photo, token, { admin }));
  },

  imageElement(item, { large = false } = {}) {
    const src = large ? item.originalPath : item.thumbPath;
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = item.fileName;
    img.dataset.photoId = item.id;
    if (item.admin) {
      fetch(src, { headers: item.authHeaders })
        .then(async response => {
          if (!response.ok) throw new Error('load failed');
          const blob = await response.blob();
          img.src = URL.createObjectURL(blob);
        })
        .catch(() => { img.alt = 'Yüklenemedi'; });
      return img.outerHTML;
    }
    img.src = src;
    return img.outerHTML;
  },

  async deletePhoto(photoId) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/photos/${photoId}`, {
      method: 'DELETE',
      headers: LumaConfig.adminAuthHeaders()
    });
    if (!response.ok) throw new Error('Silme işlemi tamamlanamadı.');
  },

  async patchPhoto(photoId, payload) {
    const response = await fetch(`${LumaConfig.apiBase}/api/admin/photos/${photoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...LumaConfig.adminAuthHeaders() },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Görsel güncellenemedi.');
    return response.json();
  },

  async setFavorite(photoId, favorite) {
    return this.patchPhoto(photoId, { favorite });
  },

  async setStatus(photoId, status) {
    return this.patchPhoto(photoId, { status });
  },

  moderationActions(item) {
    const approve = item.status !== 'approved'
      ? `<button class="photo-action approve" data-approve-media="${item.id}">Onayla</button>`
      : '';
    const hide = item.status !== 'hidden'
      ? `<button class="photo-action hide" data-hide-media="${item.id}">Gizle</button>`
      : '';
    const restore = item.status === 'hidden'
      ? `<button class="photo-action approve" data-approve-media="${item.id}">Yeniden onayla</button>`
      : '';
    return `<div class="photo-actions">${item.status === 'hidden' ? restore : approve}${hide}</div>`;
  },

  showMediaAt(index) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    if (!this.adminMediaItems.length) return;

    this.activeMediaIndex = (index + this.adminMediaItems.length) % this.adminMediaItems.length;
    const item = this.adminMediaItems[this.activeMediaIndex];
    const modActions = item.admin && item.status !== 'approved'
      ? `<button id="viewerApproveBtn" class="ghost-btn">Onayla</button>`
      : '';
    const hideAction = item.admin && item.status !== 'hidden'
      ? `<button id="viewerHideBtn" class="ghost-btn">Gizle</button>`
      : '';
    const favoriteControl = item.admin
      ? `<button id="viewerFavoriteBtn" class="media-favorite media-viewer-favorite ${item.favorite ? 'active' : ''}" aria-label="Favoriye ekle" aria-pressed="${Boolean(item.favorite)}">${item.favorite ? '★' : '☆'}</button>`
      : '';

    content.innerHTML = `<div class="media-viewer"><button class="media-viewer-nav" id="mediaPrev" aria-label="Önceki görsel">‹</button><div class="media-viewer-stage" id="viewerStage"></div><button class="media-viewer-nav" id="mediaNext" aria-label="Sonraki görsel">›</button><div class="media-viewer-foot"><span class="media-position">${this.activeMediaIndex + 1} / ${this.adminMediaItems.length}</span>${this.statusBadge(item.status)}${favoriteControl}<div class="media-viewer-meta"><strong>${Luma.escapeHtml(item.fileName)}</strong><small>${Luma.escapeHtml(item.name)} · ${Luma.trDate(new Date(item.createdAt), { dateStyle: 'long', timeStyle: 'short' })}</small></div><div class="media-viewer-actions">${modActions}${hideAction}</div></div></div>`;

    const stage = content.querySelector('#viewerStage');
    const img = document.createElement('img');
    img.alt = item.fileName;
    const src = item.originalPath;
    if (item.admin) {
      fetch(src, { headers: item.authHeaders })
        .then(r => r.blob())
        .then(blob => { img.src = URL.createObjectURL(blob); });
    } else {
      img.src = src;
    }
    stage.appendChild(img);

    document.getElementById('mediaPrev').onclick = () => this.showMediaAt(this.activeMediaIndex - 1);
    document.getElementById('mediaNext').onclick = () => this.showMediaAt(this.activeMediaIndex + 1);
    const favoriteBtn = document.getElementById('viewerFavoriteBtn');
    if (favoriteBtn) {
      favoriteBtn.onclick = async () => {
        item.favorite = !item.favorite;
        await this.setFavorite(item.id, item.favorite);
        this.showMediaAt(this.activeMediaIndex);
      };
    }
    const approveBtn = document.getElementById('viewerApproveBtn');
    if (approveBtn) {
      approveBtn.onclick = async () => {
        await this.setStatus(item.id, 'approved');
        item.status = 'approved';
        Luma.toast('Görsel onaylandı.');
        await this.renderAdminGallery();
        this.showMediaAt(this.activeMediaIndex);
      };
    }
    const hideBtn = document.getElementById('viewerHideBtn');
    if (hideBtn) {
      hideBtn.onclick = async () => {
        await this.setStatus(item.id, 'hidden');
        item.status = 'hidden';
        Luma.toast('Görsel gizlendi.');
        await this.renderAdminGallery();
        window.closeModal();
      };
    }
    content.querySelectorAll('.media-viewer-nav').forEach(button => {
      button.disabled = this.adminMediaItems.length === 1;
    });
  },

  openMediaViewer(index) {
    const modal = document.getElementById('modal');
    document.querySelector('.modal-card').classList.add('media-viewer-card');
    modal.dataset.viewer = 'media';
    modal.classList.remove('hidden');
    this.showMediaAt(index);
  },

  openDeleteConfirmation(title, description, onConfirm) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    document.querySelector('.modal-card').classList.remove('media-viewer-card');
    delete modal.dataset.viewer;
    content.innerHTML = `<div class="delete-confirm"><div class="delete-confirm-icon">!</div><h2>${Luma.escapeHtml(title)}</h2><p>${Luma.escapeHtml(description)}</p><div class="delete-confirm-actions"><button id="cancelDeleteBtn" class="confirm-cancel">Vazgeç</button><button id="confirmDeleteBtn" class="confirm-delete">Evet, sil</button></div></div>`;
    modal.classList.remove('hidden');
    document.getElementById('cancelDeleteBtn').onclick = () => window.closeModal();
    document.getElementById('confirmDeleteBtn').onclick = async event => {
      event.currentTarget.disabled = true;
      event.currentTarget.textContent = 'Siliniyor...';
      try {
        await onConfirm();
        window.closeModal();
      } catch {
        event.currentTarget.disabled = false;
        event.currentTarget.textContent = 'Evet, sil';
        Luma.toast('Silme işlemi tamamlanamadı.');
      }
    };
  },

  bindModerationActions(grid, allItems) {
    grid.querySelectorAll('[data-approve-media]').forEach(button => {
      button.onclick = async event => {
        event.stopPropagation();
        await this.setStatus(button.dataset.approveMedia, 'approved');
        if (window.onGalleryPhotoUpdated) await window.onGalleryPhotoUpdated();
        await this.renderAdminGallery();
        Luma.toast('Görsel onaylandı.');
      };
    });
    grid.querySelectorAll('[data-hide-media]').forEach(button => {
      button.onclick = async event => {
        event.stopPropagation();
        await this.setStatus(button.dataset.hideMedia, 'hidden');
        if (window.onGalleryPhotoUpdated) await window.onGalleryPhotoUpdated();
        await this.renderAdminGallery();
        Luma.toast('Görsel gizlendi.');
      };
    });
    grid.querySelectorAll('[data-delete-media]').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const item = allItems.find(entry => entry.id === button.dataset.deleteMedia);
        this.openDeleteConfirmation(
          'Görsel silinsin mi?',
          `“${item?.fileName || 'Bu içerik'}” kalıcı olarak galeriden kaldırılacak.`,
          async () => {
            await this.deletePhoto(button.dataset.deleteMedia);
            if (window.onGalleryPhotoDeleted) await window.onGalleryPhotoDeleted();
            await this.renderAdminGallery();
            Luma.toast('İçerik galeriden silindi.');
          }
        );
      };
    });
  },

  async renderAdminGallery() {
    const grid = document.getElementById('adminGalleryGrid');
    const empty = document.getElementById('adminGalleryEmpty');
    const token = LumaConfig.getEventToken();

    try {
      this.adminAllItems = await this.fetchPhotos(token, { admin: true });
      this.updateFilterCounts();
      this.adminMediaItems = this.filteredAdminItems();

      grid.innerHTML = this.adminMediaItems.map((item, index) => {
        return `<article class="admin-media-card" data-media-index="${index}" tabindex="0" role="button" aria-label="Fotoğrafı büyüt"><button class="media-favorite card-favorite ${item.favorite ? 'active' : ''}" data-favorite-media="${item.id}" aria-label="Favoriye ekle" aria-pressed="${Boolean(item.favorite)}">${item.favorite ? '★' : '☆'}</button><div class="admin-media-thumb" data-photo-index="${index}"></div><div class="admin-media-meta"><div><strong>${Luma.escapeHtml(item.fileName)}</strong><small>${this.statusBadge(item.status)} ${Luma.escapeHtml(item.name)} · ${Luma.trDate(new Date(item.createdAt), { dateStyle: 'short', timeStyle: 'short' })}</small></div>${this.moderationActions(item)}<button class="manager-delete" data-delete-media="${item.id}">Sil</button></div></article>`;
      }).join('');

      grid.querySelectorAll('.admin-media-thumb').forEach(container => {
        const item = this.adminMediaItems[Number(container.dataset.photoIndex)];
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = item.fileName;
        fetch(item.thumbPath, { headers: item.authHeaders })
          .then(r => r.blob())
          .then(blob => { img.src = URL.createObjectURL(blob); });
        container.appendChild(img);
      });

      const filterActive = this.adminStatusFilter !== 'all' || this.showFavoritesOnly;
      empty.classList.toggle('hidden', this.adminMediaItems.length > 0);
      empty.querySelector('h2').textContent = this.showFavoritesOnly
        ? 'Henüz favori görsel yok'
        : filterActive
          ? 'Bu filtrede görsel yok'
          : 'Henüz görsel yüklenmedi';

      grid.querySelectorAll('[data-media-index]').forEach(card => {
        card.onclick = event => {
          if (event.target.closest('button')) return;
          this.openMediaViewer(Number(card.dataset.mediaIndex));
        };
      });

      grid.querySelectorAll('[data-favorite-media]').forEach(button => {
        button.onclick = async event => {
          event.stopPropagation();
          const favorite = button.getAttribute('aria-pressed') !== 'true';
          await this.setFavorite(button.dataset.favoriteMedia, favorite);
          await this.renderAdminGallery();
          Luma.toast(favorite ? 'Görsel favorilere eklendi.' : 'Görsel favorilerden çıkarıldı.');
        };
      });

      this.bindModerationActions(grid, this.adminAllItems);
    } catch {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      Luma.toast('Galeri verileri okunamadı.');
    }
  },

  bindFavoriteFilter() {
    document.getElementById('favoriteFilterBtn').onclick = event => {
      this.showFavoritesOnly = !this.showFavoritesOnly;
      event.currentTarget.classList.toggle('active', this.showFavoritesOnly);
      event.currentTarget.setAttribute('aria-pressed', this.showFavoritesOnly);
      event.currentTarget.textContent = this.showFavoritesOnly
        ? '★ Tüm görselleri göster'
        : '☆ Yalnızca favoriler';
      this.renderAdminGallery();
    };
  },

  bindStatusFilters() {
    document.querySelectorAll('#photoFilters [data-photo-filter]').forEach(button => {
      button.onclick = () => {
        this.adminStatusFilter = button.dataset.photoFilter;
        document.querySelectorAll('#photoFilters button').forEach(el => {
          el.classList.toggle('active', el === button);
        });
        this.renderAdminGallery();
      };
    });
  },

  async renderPublicCollage(token = LumaConfig.getEventToken()) {
    const grid = document.getElementById('publicPhotoGrid');
    const fallback = document.getElementById('publicMemoryFallback');
    if (!grid || !token) return;

    try {
      this.publicMediaItems = await this.fetchPhotos(token, { admin: false });
      if (!this.publicMediaItems.length) {
        grid.innerHTML = '';
        grid.classList.add('hidden');
        fallback?.classList.remove('hidden');
        return;
      }

      fallback?.classList.add('hidden');
      grid.classList.remove('hidden');
      const display = this.publicMediaItems.slice(0, 3);
      const extra = this.publicMediaItems.length - display.length;

      grid.innerHTML = display
        .map((item, index) => {
          const moreOverlay =
            index === display.length - 1 && extra > 0
              ? `<span class="public-photo-more">+${extra}</span>`
              : '';
          return `<button type="button" class="public-photo-cell" data-public-photo="${index}" aria-label="Fotoğraf ${index + 1}">${this.imageElement(item)}${moreOverlay}</button>`;
        })
        .join('');

      grid.querySelectorAll('[data-public-photo]').forEach(button => {
        button.onclick = () => this.openPublicViewer(Number(button.dataset.publicPhoto));
      });
    } catch {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      fallback?.classList.remove('hidden');
    }
  },

  openPublicViewer(index) {
    if (!this.publicMediaItems.length) return;
    this.adminMediaItems = this.publicMediaItems;
    this.openMediaViewer(index);
  },
};
