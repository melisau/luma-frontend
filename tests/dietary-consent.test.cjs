const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/dietary-consent.js'),'utf8');
const main=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'../app.html'),'utf8');
function load(){const context={window:{}};vm.runInNewContext(source,context);return context.window.LumaDietaryConsent}

test('consent box starts unticked and is separate from the RSVP',()=>{
 const consent=load(),markup=consent.fieldMarkup();
 assert.match(markup,/type="checkbox" id="rsvpDietaryConsent"/);
 assert.doesNotMatch(markup,/checked|required/);
 assert.match(markup,/katılım yanıtınız bundan etkilenmez/);
});
test('dietary text is only sent with consent',()=>{
 const consent=load();
 assert.deepEqual({...consent.payload('  Glutensiz ',true)},{dietary_requirements:'Glutensiz',dietary_consent:true});
 assert.deepEqual({...consent.payload('Glutensiz',false)},{dietary_requirements:'',dietary_consent:false});
 assert.deepEqual({...consent.payload('   ',true)},{dietary_requirements:'',dietary_consent:false});
});
test('guest is told when dietary info was not saved',()=>{
 const consent=load();
 assert.equal(consent.wasDropped('Vegan',false,{}),true);
 assert.equal(consent.wasDropped('Vegan',true,{dietary_dropped:false}),false);
 assert.equal(consent.wasDropped('',false,{}),false);
 assert.equal(consent.wasDropped('Vegan',true,{dietary_dropped:true}),true);
});
test('RSVP form and planner screens use the consent module',()=>{
 assert.match(main,/LumaDietaryConsent\.fieldMarkup\(\)/);
 assert.match(main,/LumaDietaryConsent\.payload\(/);
 assert.match(main,/LumaDietaryConsent\.plannerNote/);
 assert.ok(app.indexOf('/js/dietary-consent.js')>-1&&app.indexOf('/js/dietary-consent.js')<app.indexOf('/js/main.js'));
});
