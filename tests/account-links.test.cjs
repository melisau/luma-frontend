const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../js/landing.js'),'utf8');
function run(search){
 const replaced=[];
 const context={location:{search,replace:url=>replaced.push(url)},document:{querySelectorAll:()=>{throw new Error('landing code ran')},querySelector:()=>{throw new Error('landing code ran')},getElementById:()=>{throw new Error('landing code ran')},addEventListener(){},documentElement:{}},window:{addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}})},localStorage:{getItem:()=>null,setItem(){}}};
 try{vm.runInNewContext(source,context)}catch(error){if(!replaced.length)return {replaced,ran:true}}
 return {replaced};
}
test('old e-mailed account links on the landing page are passed to app.html',()=>{
 assert.deepEqual(run('?verify_token=abc').replaced,['/app.html?verify_token=abc']);
 assert.deepEqual(run('?reset_token=xyz&x=1').replaced,['/app.html?reset_token=xyz&x=1']);
});
test('the landing page stays put without an account link',()=>{
 assert.deepEqual(run('').replaced,[]);
 assert.deepEqual(run('?utm_source=whatsapp').replaced,[]);
});
