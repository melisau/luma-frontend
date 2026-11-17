const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const main=fs.readFileSync(path.join(__dirname,'../js/main.js'),'utf8');
const fn=name=>{const start=main.indexOf(`async function ${name}(`);return main.slice(start,main.indexOf('\nasync function',start+10))};
test('sign-up treats 202 as "check your e-mail", without a session',()=>{
 const register=fn('registerBackendAdmin');
 const at202=register.indexOf('response.status===202'),atToken=register.indexOf('lumaAdminJwt');
 assert.ok(at202>0&&at202<atToken,'202 is handled before any session is stored');
 assert.match(register,/reason:'check_email'/);
 assert.match(main,/result\.reason==='check_email'\)\{setAuthMode\('login'\)/);
 assert.match(main,/Bağlantıya tıklayıp adresinizi doğrulayın/);
});
test('an unverified login is explained, not shown as a wrong password',()=>{
 assert.match(fn('loginBackendAdmin'),/response\.status===403\)return \{ok:false,reason:'unverified'\}/);
 assert.match(main,/result\.reason==='unverified'\)showAuthFeedback\('Giriş için önce e-posta adresinizi doğrulayın/);
});
