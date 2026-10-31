import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
globalThis.location={origin:'https://example.test',pathname:'/',search:'',hash:''};
const values=new Map();
globalThis.sessionStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
const journey=await import('../public/assets/chat-journey.js');
const {explorationQuestion}=await import('../public/assets/career-question.js');
const rows=(await Promise.all([1,2,3,4].map(i=>readFile(new URL(`../data/careers-${i}.json`,import.meta.url),'utf8').then(JSON.parse)))).flat();
test('return path rejects open redirects, credentials and unsafe internal endpoints',()=>{
  for(const bad of ['//evil.test','https://evil.test','/\\evil.test','/api/ai/data','/%2f%2fevil.test','/\n/evil.test']) assert.equal(journey.safeReturnPath(bad),'/');
  assert.equal(journey.safeReturnPath('/ai-career-advisor?token=secret&mode=career_exploration&career_id=bac-si'),'/ai-career-advisor?mode=career_exploration&career_id=bac-si');
});
test('tab drafts restore exact step, text and address without account crossover',()=>{
  values.clear();const draft={survey:{step:2,answers:['a','b','nội dung','',''],address:'anh'},message:'Câu hỏi đang sửa'};
  const restored={...draft,pending:null}; // Không có yêu cầu gửi đang chờ trong hợp đồng hiện có.
  journey.saveDraft('guest','session',draft);assert.deepEqual(journey.loadDraft('guest','session'),restored);assert.equal(journey.loadDraft('other','session'),null);
  values.set('laban.advisor.guest','session');journey.transferDrafts('guest','member');assert.deepEqual(journey.loadDraft('member','session'),restored);
  assert.equal(journey.loadDraft('guest','session'),null);
});
test('draft expiration and corrupt data fail safely',()=>{
  values.set('laban.draft.u.s',JSON.stringify({at:Date.now()-7200001,message:'expired'}));assert.equal(journey.loadDraft('u','s'),null);
  values.set('laban.draft.u.s','broken');assert.equal(journey.loadDraft('u','s'),null);
});
test('login origin homepage versus exact chat context',()=>{
  Object.assign(location,{pathname:'/',search:'',hash:'#careers'});journey.beginLogin();assert.equal(journey.finishLogin(),'/#careers');
  Object.assign(location,{pathname:'/ai-career-advisor',search:'',hash:''});journey.beginLogin();assert.equal(journey.finishLogin(),'/ai-career-advisor');
});
test('explicit chat destination survives missing/overwritten intent and validates conversation ID',()=>{
  const id='00000000-0000-4000-8000-000000000001';
  const url=journey.chatLoginURL(id);Object.assign(location,{pathname:'/',search:url.slice(url.indexOf('?')),hash:''});
  values.delete('laban.login-return');const target=journey.loginDestination();journey.beginLogin('/');
  assert.equal(journey.finishLogin(target),'/ai-career-advisor?conversation='+id);
  assert.equal(journey.safeReturnPath('/ai-career-advisor?conversation=invalid'),'/ai-career-advisor');
  Object.assign(location,{pathname:'/',search:'?return_to=https%3A%2F%2Fevil.test',hash:''});assert.equal(journey.loginDestination(),'/');
  Object.assign(location,{pathname:'/',search:'',hash:''});
});
test('200 career drafts are distinct, grounded and respond only to stated survey goal',()=>{
  const drafts=rows.map(c=>explorationQuestion(c,{answers:['','','','','']}));assert.equal(new Set(drafts).size,200);
  for (let i=0;i<rows.length;i++){assert.ok(drafts[i].includes(rows[i].name));assert.ok(drafts[i].includes(rows[i].daily_tasks[2]));assert.ok(drafts[i].length<=1800);}
  const c=rows.find(c=>c.career_id==='chuyen-vien-nhan-su');
  assert.ok(explorationQuestion(c,{answers:['','','','','Em muốn rèn kỹ năng']}).includes(c.skills[0].toLocaleLowerCase('vi')));
  assert.ok(explorationQuestion(c,{answers:['','','','','Em muốn hiểu khó khăn']}).includes(c.challenges[0]));
});
test('server guest claim failure, reload, account guard and lost response recover safely',async()=>{
  values.clear();const id='00000000-0000-4000-8000-000000000001';values.set('laban.advisor.sg_test',id);
  journey.saveDraft('sg_test',id,{message:'giữ lại',survey:{step:3,answers:['a','b','c','',''],address:'chị'}});
  const target={uid:'member',getIdToken:async()=>'fixture-only'};const auth={currentUser:target};let fail=true,claimed=false;
  globalThis.fetch=async(path,opts)=>{
    if(path==='/api/ai/guest/session')return {ok:true,json:async()=>({user:claimed?null:{uid:'sg_test',server_guest:true}})};
    if(path==='/api/ai/guest/claim'){assert.equal(opts.headers.Authorization,'Bearer fixture-only');if(fail)return {ok:false};claimed=true;return {ok:true};}
    if(path==='/api/ai/sessions/'+id)return {ok:claimed};throw new Error('Unexpected route');
  };
  const link=await import('../public/assets/account-link.js?case=initial');
  await assert.rejects(link.resumeGuestTransfer(auth));assert.equal(values.get('laban.advisor.member'),undefined);
  const reload=await import('../public/assets/account-link.js?case=reloaded');
  await assert.rejects(reload.retryGuestClaim({currentUser:{uid:'other'}}));
  fail=false;await reload.retryGuestClaim(auth);assert.equal(values.get('laban.advisor.member'),id);assert.equal(journey.loadDraft('member',id).message,'giữ lại');
  values.set('laban.advisor.sg_test',id);journey.saveDraft('sg_test',id,{message:'sau COMMIT'});
  values.set('laban.claim-target',JSON.stringify({uid:'member',source:'sg_test',session:id,at:Date.now()}));
  const lost=await import('../public/assets/account-link.js?case=lost');await lost.retryGuestClaim(auth);assert.equal(journey.loadDraft('member',id).message,'sau COMMIT');
});
