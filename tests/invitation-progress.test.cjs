const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'invitation-progress.js'), 'utf8');
const sandbox = {window: {}};
vm.runInNewContext(source, sandbox);
const progress = sandbox.window.LumaInvitationProgress;

test('an untouched event does not count as a completed invitation', () => {
  const result = progress.state({name: 'Parti', venue: 'Salon', event_date: '2027-06-20T19:30:00Z', presentation: {}}, {});
  assert.deepEqual({...result}, {appearance: false, colors: false, date: false, details: false});
});

test('saved date and details do not imply appearance or color choices', () => {
  const result = progress.state({name: 'Parti', city: 'İstanbul', event_date: '2027-06-20T19:30:00Z', presentation: {editor_saved: true}}, {});
  assert.deepEqual({...result}, {appearance: false, colors: false, date: true, details: true});
});

test('explicit choices complete appearance and colors once saved', () => {
  const result = progress.state({name: 'Parti', venue: '', city: '', event_date: null, presentation: {editor_saved: true, appearance_confirmed: true, colors_confirmed: true}}, {});
  assert.deepEqual({...result}, {appearance: true, colors: true, date: false, details: false});
});

test('customized appearance and palette also count as choices', () => {
  const result = progress.state({name: 'Parti', venue: 'Salon', event_date: '2027-06-20T19:30:00Z', opening_style: 'envelope', palette: {heading: '#123456'}, presentation: {editor_saved: true}}, {});
  assert.deepEqual({...result}, {appearance: true, colors: true, date: true, details: true});
});

test('a newly completed editor step fills progress before saving', () => {
  const saved = {appearance: false, colors: false, date: false, details: false};
  const draft = {appearance: true, colors: false, date: false, details: false};
  assert.deepEqual({...progress.displayState(saved, draft, {appearance: true})}, {appearance: true, colors: false, date: false, details: false});
  assert.deepEqual({...progress.displayState(saved, draft, {})}, saved);
});
