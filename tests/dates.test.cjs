const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
for(const timezone of ['Europe/Istanbul','America/New_York','UTC']){
 test(`editing dates preserves the instant in ${timezone}`,()=>{
 const code=`global.window={};require(${JSON.stringify(path.join(__dirname,'../js/date-utils.js'))});const d=window.LumaDates;const assert=require('node:assert/strict');let raw='2027-06-20T16:30:00Z';for(let i=0;i<4;i++){raw=new Date(d.toLocalInput(raw)).toISOString();assert.equal(raw,'2027-06-20T16:30:00.000Z');}assert.equal(d.parse('2027-06-20T16:30:00').toISOString(),raw);`;
 execFileSync(process.execPath,['-e',code],{env:{...process.env,TZ:timezone}});
 });
}
