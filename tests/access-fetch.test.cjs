const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
test('event cookies accompany API requests but not external requests',async()=>{
 const calls=[];const context={URL,URLSearchParams,location:{href:'http://localhost:5500/',origin:'http://localhost:5500',protocol:'http:',hostname:'localhost',port:'5500'},fetch:async(input,options)=>{calls.push(options);return {ok:true}}};context.window=context;
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/config.js'),'utf8'),context);
 await context.fetch('http://localhost:8000/api/events/event');await context.fetch('https://external.example/image');
 assert.equal(calls[0].credentials,'include');assert.equal(calls[1].credentials,undefined);
});
