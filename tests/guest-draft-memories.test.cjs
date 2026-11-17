const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');

test('the no-login draft keeps the memory section in the phone preview',()=>{
 const preview=read('js/editor-preview.js');
 const line=preview.split(/\r?\n/).find(l=>l.includes("classList.contains('guest-draft')"));
 assert.ok(line);
 assert.doesNotMatch(line,/#memories/);
});
test('a chosen memory image shows in the invitation before saving',()=>{
 const main=read('js/main.js');
 assert.match(main,/function showMemoryCoverInInvitation\(src\)/);
 assert.equal((main.match(/showMemoryCoverInInvitation\(/g)||[]).length>=4,true);
});
test('memory buttons in the draft explain why nothing is added',()=>{
 const main=read('js/main.js');
 assert.match(main,/isGuestDraft\(\)&&b\.closest\('#memories'\)\)\{toast\(GUEST_DRAFT_MEMORY_NOTE\)/);
});
