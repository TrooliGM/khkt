// Một lưới, cùng dữ liệu nhóm; không tạo bản sao catalog hoặc điều hướng khi chọn nhóm.
import {revealGrid} from './interaction-motion.js';
export const mobileCareers = matchMedia('(max-width: 760px)');
export const wideCareers = matchMedia('(min-width: 1100px)');
const css=document.createElement('link');css.rel='stylesheet';css.href='/assets/mobile-career-grid.css?v=1';document.head.append(css);
const paths=[
  'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
  'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 5 2 10 8 14 6-4 12-9 8-14Z',
  'm2 9 10-5 10 5-10 5-10-5Zm4 3v6c4 3 8 3 12 0v-6M22 9v8',
  'M4 16h16M6 16v-4a6 6 0 0 1 12 0v4M10 7V4h4v3M3 16v4h18v-4',
  'm4 4 13 4 3 12-12-3-4-13Zm0 0 8 8m0 0a2 2 0 1 0 3 3 2 2 0 0 0-3-3Z',
  'M8 8a4 4 0 0 1 8 0c5-1 7 5 3 7v5H5v-5C1 13 3 7 8 8Z',
  'M4 8h16v12H4V8Zm4 0V4h8v4M4 12h16M10 12v3h4v-3',
  'M4 5h16v14H4V5Zm4 4h8M8 13h5M8 17h8',
  'M12 3v18M5 7h14M5 7l-4 8h8L5 7Zm14 0-4 8h8l-4-8M7 21h10',
  'M12 21V10M12 14C3 15 2 9 3 4c6 0 10 3 9 10Zm0-3c1-7 5-9 10-9 0 6-3 10-10 9Z',
  'M12 3v3m0 12v3M3 12h3m12 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z',
  'M9 3h6m-5 0v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M7 16h10'
];
function icon(index){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',paths[index%paths.length]);svg.append(p);return svg;}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
export function renderMobileCareers(host,{categories,category='',items=null,kind='career',onSelect,onBack,onCareer,href,loading=false}){
  const hadFocus=host.contains(document.activeElement);
  host.classList.add('mobile-career-grid');host.replaceChildren();
  host.setAttribute('aria-busy',String(loading));
  const selected=categories.find(c=>c.category_id===category),slot=categories.findIndex(c=>c.category_id===category);
  if(items===null){
    for(const [i,c] of categories.entries()){
      const button=el('button','mobile-group');button.type='button';button.dataset.mobileGroup=c.category_id;
      button.append(icon(i),el('strong','',c.name),el('small','',`${c.count} nghề`));
      button.addEventListener('click',()=>onSelect(c.category_id));host.append(button);
    }
    revealGrid(host);return;
  }
  if(selected){
    const back=el('button','mobile-grid-back');back.type='button';back.dataset.mobileBack=category;
    // Vị trí tường minh giữ đúng ô A, các thẻ còn lại tự lấp những ô trống.
    const columns=wideCareers.matches?4:mobileCareers.matches?2:3;
    back.style.gridRow=String(Math.floor(slot/columns)+1);back.style.gridColumn=String(slot%columns+1);
    back.append(el('span','mobile-back-label','← Quay về'),el('strong','',selected.name));
    back.addEventListener('click',()=>{onBack();requestAnimationFrame(()=>host.querySelector(`[data-mobile-group="${CSS.escape(category)}"]`)?.focus({preventScroll:true}));});host.append(back);
  }
  for(const c of items){
    const cid=c.career_id||c.id,groupIndex=categories.findIndex(g=>g.category_id===c.category_id);
    if(kind==='career'){
      const card=el('article','mobile-career-card');card.dataset.mobileCareer=cid;
      const title=el('h3'),name=el('button','career-name',c.name);name.type='button';name.addEventListener('click',()=>onCareer(cid));title.append(name);
      const description=el('p','career-card-description',c.short_description||c.description||'');
      const actions=el('div','career-card-actions'),explore=el('button','career-explore','Cùng khám phá');explore.type='button';explore.addEventListener('click',()=>onCareer(cid));
      const video=el('a','career-watch-video','Xem video');video.href=`/mot-ngay-lam-viec?nghe=${encodeURIComponent(cid)}&tab=video`;video.setAttribute('aria-label',`Xem video: ${c.name}`);
      actions.append(explore,video);card.append(icon(Math.max(0,groupIndex)),title,description,actions);host.append(card);
    }else{
      const card=el('article','mobile-video-card story-card');card.dataset.mobileCareer=cid;
      const video=el('a','mobile-video-cover story-open-video');video.href=href(cid,'video');video.dataset.story=cid;
      video.setAttribute('aria-label',`Xem video: ${c.name}`);
      if(c.cover_video){const img=el('img');img.src=c.cover_video.thumbnail_url;img.alt=`Video nghề ${c.name}`;img.width=640;img.height=360;img.loading='lazy';img.referrerPolicy='no-referrer';video.append(img);}
      video.append(el('span','mobile-video-play','▶'));
      const title=el('h2','',c.name),comic=el('a','mobile-comic-link story-open-comic','Đọc truyện →');comic.href=href(cid,'comic');comic.dataset.story=cid;comic.setAttribute('aria-label',`Đọc truyện: ${c.name}`);
      card.append(video,title,comic);host.append(card);
    }
  }
  if(loading)host.append(el('p','mobile-grid-loading','Đang tải nghề…'));
  else if(!items.length)host.append(el('p','mobile-grid-empty','Chưa có nghề phù hợp. Em thử từ khóa khác nhé.'));
  if(hadFocus)host.querySelector('[data-mobile-back]')?.focus({preventScroll:true});
  revealGrid(host);
}
export function clearMobileGrid(host){host.classList.remove('mobile-career-grid');host.removeAttribute('aria-busy');}
