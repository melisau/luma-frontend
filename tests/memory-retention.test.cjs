const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8');const handler=source.slice(source.indexOf('function memoryRetentionPayload(){'));
function setup({enabled=false,date='',confirm=false,previous=null}={}){
 const fields={eventSettingsRetentionEnabled:{checked:enabled},eventSettingsRetentionDate:{value:date},eventSettingsRetentionConfirm:{checked:confirm}};
 const context={Date,currentEventMeta:()=>({memory_delete_at:previous}),document:{getElementById:id=>fields[id]},LumaDates:{toLocalInput:value=>value.slice(0,16)}};
 vm.runInNewContext(handler,context);return context.memoryRetentionPayload;
}
test('no retention policy is sent by default',()=>assert.equal(Object.keys(setup()()).length,0));
test('disabling an existing policy cancels it',()=>assert.equal(setup({previous:'2038-01-01T12:00:00Z'})().memory_delete_at,null));
test('scheduling requires an explicit confirmation and a future date',()=>{
 assert.throws(setup({enabled:true,date:'2038-01-01T12:00'}),/onaylayın/);
 assert.throws(setup({enabled:true,date:'2020-01-01T12:00',confirm:true}),/24 saat/);
 assert.equal(setup({enabled:true,date:'2038-01-01T12:00',confirm:true})().confirm_memory_deletion,true);
});
test('unrelated settings changes preserve an existing schedule without rearming deletion',()=>{
 assert.equal(Object.keys(setup({enabled:true,date:'2038-01-01T12:00',previous:'2038-01-01T12:00:00Z'})()).length,0);
});
