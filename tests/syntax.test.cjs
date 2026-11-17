const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
// Every script the pages load must at least parse; most tests only read slices of main.js.
const dir=path.join(__dirname,'../js');
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.js'))){
 test(`js/${file} parses`,()=>{assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(dir,file),'utf8'),{filename:file}))});
}
