// Chỉ tổ chức DOM đã được làm sạch. Không sửa nội dung, gọi model hay ghi hội thoại.
import {reveal} from './interaction-motion.js';
export const mobileChat=matchMedia('(max-width: 760px)');
const link=document.createElement('link');link.rel='stylesheet';link.href='/assets/mobile-chat.css?v=1';document.head.append(link);
const records=new WeakMap(),opened=new Map();
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/^\s*[\d.()\-:]+\s*/,'').trim();
const protectedTitle=s=>/^(ket luan|tom lai|tom tat|nguon|luu y|dieu can nho|loi khuyen cuoi|buoc tiep theo)/.test(norm(s));
function heading(n){if(n.nodeType!==1)return 0;if(/^H[2-4]$/.test(n.tagName))return Number(n.tagName[1]);if(n.matches('p')&&n.children.length===1&&n.firstElementChild.matches('strong')&&n.textContent.trim()===n.firstElementChild.textContent.trim())return 4;return 0;}
function disclosure(key,title,more=false){
  const d=document.createElement('details'),s=document.createElement('summary'),body=document.createElement('div');
  d.className=more?'answer-more':'answer-evidence';body.className='answer-disclosure-content';
  if(typeof title==='string')s.textContent=title;else s.append(title);
  d.append(s,body);d.open=opened.get(key)===true;
  const update=()=>{opened.set(key,d.open);if(more)s.textContent=d.open?'Thu gọn ↑':title;};update();
  s.addEventListener('click',e=>{
    e.preventDefault();const scroll=document.querySelector('#chat-scroll'),top=scroll?.scrollTop||0;
    d.open=!d.open;update();
    reveal(d.open?body:s);
    // Giữ nguyên điểm đọc; tuyệt đối không gọi scrollIntoView/scrollBottom.
    if(scroll)requestAnimationFrame(()=>{scroll.scrollTop=Math.min(top,Math.max(0,scroll.scrollHeight-scroll.clientHeight));});
  });d.addEventListener('toggle',update);return {d,body};
}
function apply(record){
  const {row,key,sources}=record,bubble=row.querySelector('.message-bubble');if(!bubble||record.undo.length)return;
  // Nguồn nằm ngoài phần hướng dẫn thu gọn và hiện mở trên điện thoại.
  for(const source of row.querySelectorAll('.source-list')){const was=source.open;source.open=true;record.undo.push(()=>source.open=was);}
  const evidence=[...bubble.children].filter(n=>heading(n)&&/^can cu tu cau tra loi cua (ban|em)/.test(norm(n.textContent)));
  for(const [i,title] of evidence.entries()){
    const level=heading(title),nodes=[title];let next=title.nextSibling;
    while(next&&!(heading(next)&&(heading(next)<=level||protectedTitle(next.textContent)))&&!(next.nodeType===1&&next.matches('.recommendations,.source-list,.career-navigation'))){nodes.push(next);next=next.nextSibling;}
    const marker=document.createComment('evidence');title.before(marker);
    const {d,body}=disclosure(key+':evidence:'+i,title);nodes.slice(1).forEach(n=>body.append(n));marker.replaceWith(d);
    record.undo.push(()=>d.replaceWith(...nodes));
  }
  // Bằng chứng cấu trúc khảo sát vốn đã dùng details; giữ mặc định thu gọn.
  for(const existing of bubble.querySelectorAll(':scope > details:not(.answer-evidence):not(.answer-more)')){
    const title=existing.querySelector('summary');if(title&&/^can cu tu cau tra loi cua/.test(norm(title.textContent)))existing.classList.add('answer-evidence');
  }
  const hasSource=n=>n.nodeType===1&&[...n.querySelectorAll('a[href]')].some(a=>sources.some(s=>s.url===a.href));
  const children=[...bubble.childNodes];
  const levels=[4,3,2];
  for(const level of levels){
    const starts=children.map((n,i)=>heading(n)===level?i:-1).filter(i=>i>=0);
    const runs=[];let run=[];
    for(const start of starts){
      const end=children.findIndex((n,i)=>i>start&&((heading(n)&&heading(n)<=level)||(n.nodeType===1&&(n.matches('.recommendations,.source-list,.career-navigation,.answer-evidence')||protectedTitle(n.textContent)))));
      const nodes=children.slice(start,end<0?children.length:end);
      const safe=!protectedTitle(children[start].textContent)&&!nodes.some(hasSource);
      // Không gom qua một tiêu đề cha, căn cứ hoặc khối nguồn.
      if(run.length&&run[run.length-1].end!==start){runs.push(run);run=[];}
      if(safe)run.push({start,end:end<0?children.length:end,nodes});else{if(run.length)runs.push(run);run=[];}
    }
    if(run.length)runs.push(run);
    const selected=runs.find(items=>items.length>=3&&items.flatMap(x=>x.nodes).reduce((n,x)=>n+x.textContent.length,0)>=650);
    if(selected){
      const rest=selected.slice(1).flatMap(x=>x.nodes),first=rest[0];
      const {d,body}=disclosure(key+':guide',`Xem thêm ${selected.length-1} mục ↓`,true);first.before(d);rest.forEach(n=>body.append(n));
      record.undo.push(()=>d.replaceWith(...rest));break;
    }
  }
  if(!bubble.querySelector('.answer-more')){
    const list=[...bubble.querySelectorAll(':scope > ol,:scope > ul')].find(n=>n.children.length>=3&&n.textContent.length>=650&&![...n.children].some(li=>protectedTitle(li.textContent)||protectedTitle(li.querySelector('strong')?.textContent||'')||hasSource(li)));
    if(list){
      const nodes=[...list.childNodes],items=[...list.children],more=document.createElement('li');more.className='answer-more-list';
      const {d,body}=disclosure(key+':list',`Xem thêm ${items.length-1} mục ↓`,true),nested=document.createElement(list.tagName.toLowerCase());
      if(list.tagName==='OL')nested.start=Number(list.getAttribute('start')||1)+1;
      items.slice(1).forEach(n=>nested.append(n));body.append(nested);more.append(d);list.append(more);
      record.undo.push(()=>list.replaceChildren(...nodes));
    }
  }
}
export function prepareMobileAnswer(row,key,sources=[]){
  const record={row,key,sources,undo:[]};records.set(row,record);apply(record);
}
