const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/upload.js'),'utf8');
function load(){const context={window:{}};vm.runInNewContext(source,context);return context.window.LumaUpload}
function busy(retryAfter){const error=new Error('busy');error.status=429;error.retryAfter=retryAfter;return error}

test('busy venue: upload waits as the server asks and retries',async()=>{
 const upload=load(),waits=[],notices=[];let calls=0;
 const result=await upload.uploadWithRetry(async()=>{calls++;if(calls<3)throw busy(calls===1?7:0);return {uploaded:[1]}},s=>notices.push(s),async ms=>waits.push(ms));
 assert.deepEqual(result,{uploaded:[1]});
 assert.equal(calls,3);
 assert.deepEqual(waits,[7000,5000]);
 assert.deepEqual(notices,[7,5]);
});
test('wait is kept between 3 and 30 seconds',async()=>{
 const upload=load(),waits=[];let calls=0;
 await upload.uploadWithRetry(async()=>{calls++;if(calls===1)throw busy(600);if(calls===2)throw busy(1);return 'ok'},null,async ms=>waits.push(ms));
 assert.deepEqual(waits,[30000,3000]);
});
test('other errors and repeated limits are not retried forever',async()=>{
 const upload=load();let calls=0;
 await assert.rejects(upload.uploadWithRetry(async()=>{calls++;const e=new Error('too big');e.status=413;throw e},null,async()=>{}),/too big/);
 assert.equal(calls,1);calls=0;
 await assert.rejects(upload.uploadWithRetry(async()=>{calls++;throw busy(1)},null,async()=>{}),/busy/);
 assert.equal(calls,4);
});
