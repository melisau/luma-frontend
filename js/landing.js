(() => {
  'use strict';
  const events = {
    wedding: { names: 'Elif & Deniz', date: '20 June 2027', intro: 'Together with our favorite people', message: 'We would love to celebrate with you.' },
    engagement: { names: 'Elif & Deniz', date: '14 February 2027', intro: 'The beginning of our forever', message: 'Join us for our engagement celebration.' },
    birthday: { names: 'A little wish', date: '10 July 2027', intro: 'Another year, another adventure', message: 'Cake, candles, and our favorite people.' },
    party: { names: 'Under the stars', date: '21 August 2027', intro: 'Good company. A beautiful evening.', message: 'Come for the music. Stay for the memories.' }
  };
  const colors = { forest: '#25463B', sage: '#63745B', rose: '#995E5D' };
  let selectedEvent = 'wedding';
  const tabs = [...document.querySelectorAll('[data-event]')];
  const dialog = document.querySelector('#demo-dialog');
  const form = document.querySelector('#demo-rsvp');
  const result = document.querySelector('#demo-result');
  const activeEvents = () => window.LumaLandingI18n.events(events);
  function selectEvent(tab) {
    selectedEvent = tab.dataset.event;
    const event = activeEvents()[selectedEvent];
    tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
    document.querySelector('#invitation-preview').setAttribute('aria-labelledby', tab.id);
    const names = document.querySelector('#invite-names');
    names.replaceChildren();
    const parts = event.names.split(' & ');
    if (parts.length === 2) { const amp = document.createElement('em'); amp.textContent = '&'; names.append(parts[0] + ' ', amp, ' ' + parts[1]); }
    else names.textContent = event.names;
    document.querySelector('.invite-intro').textContent = event.intro;
    document.querySelector('.invite-date').textContent = event.date;
    document.querySelector('#invite-message').textContent = event.message;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectEvent(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectEvent(tabs[next]); tabs[next].focus(); }
    });
  });
  document.querySelectorAll('[data-color]').forEach(swatch => swatch.addEventListener('click', () => {
    document.querySelectorAll('[data-color]').forEach(item => item.setAttribute('aria-pressed', String(item === swatch)));
    document.documentElement.style.setProperty('--event-color', colors[swatch.dataset.color]);
  }));
  document.querySelector('.preview-open').addEventListener('click', () => {
    const event = activeEvents()[selectedEvent];
    document.querySelector('#demo-title').textContent = event.names;
    document.querySelector('#demo-date').textContent = event.date;
    document.querySelector('#demo-message').textContent = event.message;
    form.reset(); form.hidden = false; result.hidden = true;
    dialog.showModal();
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    if (!name) { document.querySelector('#demo-name').setCustomValidity(window.LumaLandingI18n.message('required')); form.reportValidity(); return; }
    form.hidden = true; result.hidden = false;
    result.textContent = window.LumaLandingI18n.message(data.get('attending') === 'yes' ? 'yes' : 'no', name);
  });
  document.querySelector('#demo-name').addEventListener('input', event => event.target.setCustomValidity(''));
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  function updateMenuLabel() { menuButton.setAttribute('aria-expanded', String(!menu.hidden)); menuButton.setAttribute('aria-label', window.LumaLandingI18n.menuLabel(!menu.hidden)); }
  menuButton.addEventListener('click', () => { menu.hidden = !menu.hidden; updateMenuLabel(); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.hidden = true; updateMenuLabel(); }));
  window.LumaLandingRefresh = () => {
    selectEvent(tabs.find(tab => tab.dataset.event === selectedEvent));
    if (dialog.open) {
      const event = activeEvents()[selectedEvent];
      document.querySelector('#demo-title').textContent = event.names;
      document.querySelector('#demo-date').textContent = event.date;
      document.querySelector('#demo-message').textContent = event.message;
    }
    updateMenuLabel();
  };
  window.LumaLandingRefresh();
})();
