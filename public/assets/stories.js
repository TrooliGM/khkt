import {journeyPath,installJourneyNavigation,recordExploration} from './chat-journey.js';
import {mobileCareers,renderMobileCareers,clearMobileGrid} from './mobile-career-grid.js';
import {revealGrid} from './interaction-motion.js';
installJourneyNavigation();
﻿import {storyArt} from './story-art.js';
import {comicCover} from './story-thumbnails.js';
import {offerStoryQuestion,offerVideoQuestion} from './story-journey.js';
import {YouTubePlayer} from './youtube-player.js';
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
let catalog=null,story=null,index=0,answers=new Map(),shown=12,view='comic',videoRows=[],selectedVideo=null;
let controller,epoch=0,readonly=false,requestedURL=location.href,ended=false,searchTimer,careerGroups=[];
const player=new YouTubePlayer($('#youtube-host'),message=>{
  $('#video-fallback-text').textContent=message;$('#video-fallback').hidden=false;
});
async function json(url,signal){
  const r=await fetch(url,{signal});const b=await r.json();
  if(!r.ok)throw Error(typeof b.detail==='string'?b.detail:'Nội dung chưa tải được. Em thử lại nhé.');return b;
}
function remember(){
  if(!story)return;
  try{sessionStorage.setItem('laban.story.'+story.id,JSON.stringify({at:Date.now(),version:story.version,index,answers:[...answers]}));}catch{}
}
function restore(){
  try{
    const saved=JSON.parse(sessionStorage.getItem('laban.story.'+story.id));
    if(!saved||saved.version!==story.version||!Number.isFinite(saved.at)||Date.now()<saved.at||Date.now()-saved.at>86400000)return;
    if(Number.isInteger(saved.index)&&saved.index>=0&&saved.index<story.scenes.length)index=saved.index;
    if(Array.isArray(saved.answers))for(const pair of saved.answers){
      if(!Array.isArray(pair)||pair.length!==2)continue;
      const [id,choice]=pair;if(story.scenes.find(s=>s.scene_id===id)?.choices.some(c=>c.choice_id===choice))answers.set(id,choice);
    }
  }catch{}
}
function chosen(s){return s.choices.find(c=>c.choice_id===answers.get(s.scene_id));}
function resetAsk(){
  $('#story-ask-form').hidden=true;$('#story-answer').hidden=true;
  $('#ask-scene').disabled=readonly;
  $('#ask-note').textContent=readonly?'Preview: AI đang tạm khóa. Em vẫn có thể xem video và đọc đủ 200 truyện.':'Câu hỏi sẽ mở ở AI Chat để em chỉnh sửa và xác nhận gửi.';
}
function renderScene(){
  const s=story.scenes[index],choice=chosen(s),prior=index?chosen(story.scenes[index-1]):null;
  $('#comic-reader').hidden=ended;$('#day-summary').hidden=!ended;
  $('#comic-person').textContent=`Một ngày cùng ${story.character} · ${story.workplace}`;
  $('#scene-counter').textContent=`${index+1} / ${story.scenes.length}`;
  $('#reading-progress').max=story.scenes.length;$('#reading-progress').value=index+1;
  $('#scene-art').innerHTML=storyArt(s.art);$('#scene-time').textContent=s.time;$('#character-name').textContent=story.character;
  $('#scene-kicker').textContent=`CẢNH ${String(index+1).padStart(2,'0')}`;
  $('#scene-title').textContent=s.title;$('#scene-caption').textContent=s.caption;
  $('#scene-consequence').hidden=!prior;$('#scene-consequence').textContent=prior?'Từ lựa chọn trước: '+prior.consequence:'';
  $('#decision-card').hidden=!s.choices.length;$('#decision-question').textContent=s.question;
  $('#decision-choices').innerHTML=s.choices.map(c=>`<button data-choice="${esc(c.choice_id)}" aria-pressed="${choice===c}">${esc(c.text)}</button>`).join('');
  $('#decision-feedback').hidden=!choice;$('#decision-feedback').textContent=choice?choice.feedback+' '+choice.consequence:'';
  $('#skill-details').open=false;$('#scene-skill').textContent=s.skill;$('#scene-skill-reason').textContent=s.skill_reason;$('#scene-speech').textContent=s.speech;
  $('#prev-scene').disabled=index===0;$('#next-scene').textContent=index===story.scenes.length-1?'Khép lại một ngày ✓':'Tiếp theo →';
  $('#story-question').value=`Trong cảnh “${s.title}”, người làm nghề cần cân nhắc điều gì? Em có thể rèn kỹ năng này thế nào?`;
  remember();if(ended)renderSummary();
}
function renderSummary(){
  $('#summary-text').textContent=story.takeaway;$('#summary-step').textContent=story.first_step;
  $('#summary-reflection').innerHTML=story.reflection.map(s=>`<li>${esc(s)}</li>`).join('');
  $('#summary-decisions').innerHTML=story.scenes.filter(s=>s.choices.length).map(s=>{
    const c=chosen(s);return `<li>${c?esc(c.text)+' — '+esc(c.consequence):'Em chưa chọn ở tình huống này; có thể quay lại thử.'}</li>`;
  }).join('');
}
function go(next){if(!story)return;ended=false;index=Math.max(0,Math.min(next,story.scenes.length-1));resetAsk();renderScene();}
function chooseTab(next,update=true){
  view=next;player.clear();$('#video-panel').hidden=next!=='video';$('#comic-panel').hidden=next!=='comic';
  for(const t of ['video','comic']){$('#tab-'+t).setAttribute('aria-selected',String(t===next));$('#tab-'+t).tabIndex=t===next?0:-1;}
  $('#ask-scene').textContent=next==='video'?'Hỏi AI về video này ↗':'Hỏi AI về cảnh này ↗';
  $('#ask-scene').hidden=next==='video'&&!selectedVideo;resetAsk();
  if(next==='video')renderVideo();else renderScene();
  if(update){const u=new URL(location.href);u.searchParams.set('tab',next);history.replaceState(null,'',u);}
}
function renderVideo(){
  const v=selectedVideo;
  $('#video-empty').hidden=Boolean(v);$('#video-content').hidden=!v;$('#video-fallback').hidden=true;
  if(!v)return;
  $('#play-video').hidden=false;$('#video-thumbnail').src=v.thumbnail_url;$('#video-thumbnail').alt='Ảnh thu nhỏ của video '+v.title;
  $('#video-title').textContent=v.title;
  const duration=v.duration_seconds?`${Math.floor(v.duration_seconds/60)}:${String(v.duration_seconds%60).padStart(2,'0')}`:'';
  $('#video-channel').textContent=[v.channel_name,v.language==='en'?'Tiếng Anh · Bối cảnh quốc tế':v.language==='vi'?'Tiếng Việt':v.language||'',duration].filter(Boolean).join(' · ');
    $('#video-description').textContent=[v.description,v.subtitle_note,v.review_scope].filter(Boolean).join(' ');$('#youtube-link').href=v.youtube_url;
  if(v.embeddable!==true||v.availability_status==='region_restricted'){
    $('#play-video').disabled=true;$('#video-fallback').hidden=false;
    $('#video-fallback-text').textContent='Video chưa phát nhúng tại đây hoặc có giới hạn khu vực. Em có thể kiểm tra trực tiếp trên YouTube.';
  }else $('#play-video').disabled=false;
  $('#story-question').value='Video cho thấy những nhiệm vụ và kỹ năng nào của nghề này? Em nên tìm hiểu thêm điều gì trước khi lựa chọn?';
}
function libraryCards(){
  if(!catalog)return;
  const query=normalize($('#story-search').value),category=$('#story-category-filter').value;
  const matches=catalog.filter(c=>(!category||c.category_id===category)&&normalize(c.name).includes(query));
  const withVideo=matches.filter(c=>c.video_count>0).length;
  if(mobileCareers.matches){
    const href=(id,tab)=>{const u=new URL(location.href);u.searchParams.set('nghe',id);u.searchParams.set('tab',tab);return u.pathname+u.search;};
    renderMobileCareers($('#story-grid'),{categories:careerGroups,category,items:category||query?matches:null,kind:'video',href,onSelect:id=>{$('#story-category-filter').value=id;$('#story-search').value='';filterURL(true);},onBack:()=>{$('#story-category-filter').value='';$('#story-search').value='';filterURL(true);}});
    $('#story-count').textContent=category||query?`${matches.length} nghề · ${withVideo} video`:'Chọn nhóm nghề em muốn tìm hiểu.';$('#story-more').hidden=true;return;
  }
  clearMobileGrid($('#story-grid'));
  $('#story-count').textContent=matches.length?`${matches.length} nghề · ${withVideo} nghề có video đã rà soát · ${matches.length-withVideo} chưa có video`:'Chưa tìm thấy nghề. Em thử từ khóa hoặc nhóm khác nhé.';
  $('#story-grid').innerHTML=matches.slice(0,shown).map(c=>{
    const v=c.cover_video;
    const cover=v?`<img src="${esc(v.thumbnail_url)}" width="640" height="360" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="Ảnh thu nhỏ YouTube: ${esc(v.title)}"><span class="cover-play" aria-hidden="true">▶</span>`:comicCover(c.category_id);
    const path='/mot-ngay-lam-viec?nghe='+encodeURIComponent(c.id);
    return `<article class="story-card"><a class="story-card-main" href="${path}" data-story="${esc(c.id)}"><div class="card-cover">${cover}</div><p class="card-label">${v?'VIDEO YOUTUBE + TRUYỆN':'TRUYỆN TƯƠNG TÁC · 5 CẢNH'}</p><h2>${esc(c.name)}</h2><p>${esc(c.short_description)}</p></a><nav class="story-card-actions" aria-label="Cách tìm hiểu nghề ${esc(c.name)}">${v?`<a class="story-open-video" href="${path}&tab=video" data-story="${esc(c.id)}">▶ Xem video</a>`:'<span class="story-video-missing">Chưa có video đã duyệt</span>'}<a class="story-open-comic" href="${path}&tab=comic" data-story="${esc(c.id)}">Đọc truyện →</a></nav></article>`;
  }).join('');$('#story-more').hidden=shown>=matches.length;revealGrid($('#story-grid'));
}
function filterURL(push=false){
  shown=12;libraryCards();const u=new URL(location.href);const conversation=u.searchParams.get('conversation');u.search='';if(conversation)u.searchParams.set('conversation',conversation);
  if($('#story-search').value.trim())u.searchParams.set('q',$('#story-search').value.trim());
  if($('#story-category-filter').value)u.searchParams.set('category',$('#story-category-filter').value);
  history[push===true?'pushState':'replaceState'](null,'',u);
}
async function route({push=null,resume=false}={}){
  remember();controller?.abort();player.clear();const turn=++epoch;
  if(push)history.pushState({},'',journeyPath(push));
  const url=new URL(location.href),id=url.searchParams.get('nghe')||url.searchParams.get('career_id');requestedURL=url.href;
  const current=new AbortController();controller=current;
  $('#story-library').hidden=true;$('#story-detail').hidden=true;$('#story-error').hidden=true;$('#story-loading').hidden=false;
  resetAsk();
  try{
    if(!id){
      story=null;
      if(!catalog){const [data,groups]=await Promise.all([json('/api/career-stories',current.signal),json('/api/career-library/categories',current.signal)]);if(turn!==epoch)return;catalog=data.items;readonly=data.preview_read_only;careerGroups=groups.items;}
      const categories=new Map(careerGroups.map(c=>[c.category_id,c.name]));
      $('#story-category-filter').innerHTML='<option value="">Tất cả nhóm nghề</option>'+[...categories].map(([id,name])=>`<option value="${esc(id)}">${esc(name)}</option>`).join('');
      $('#story-search').value=(url.searchParams.get('q')||'').slice(0,120);$('#story-category-filter').value=categories.has(url.searchParams.get('category'))?url.searchParams.get('category'):'';
      shown=12;libraryCards();$('#story-library').hidden=false;document.title='Thế giới nghề nghiệp · La Bàn';return;
    }
    if(!/^[a-z0-9-]{1,80}$/.test(id))throw Error('Đường dẫn nghề không hợp lệ.');
    const [data,videos]=await Promise.all([json('/api/career-stories/'+encodeURIComponent(id),current.signal),json('/api/career-videos/'+encodeURIComponent(id),current.signal)]);
    if(turn!==epoch)return;
    story=data;videoRows=videos.items;readonly=videos.preview_read_only;index=0;answers=new Map();ended=false;
    const libraryURL=new URL(location.href);for(const key of ['nghe','career_id','tab','video','scene'])libraryURL.searchParams.delete(key);
    document.querySelectorAll('[data-library]').forEach(a=>a.href=libraryURL.pathname+libraryURL.search);
    recordExploration(id);
    if(resume||url.searchParams.has('scene'))restore();
    const requestedScene=data.scenes.findIndex(s=>s.scene_id===url.searchParams.get('scene'));if(requestedScene>=0)index=requestedScene;
    selectedVideo=videoRows.find(v=>v.youtube_video_id===url.searchParams.get('video'))||videoRows[0]||null;
    document.title=data.name+' · Thế giới nghề nghiệp · La Bàn';
    $('#career-title').textContent=data.name;$('#breadcrumb-name').textContent=data.name;$('#career-intro').textContent=data.short_description;$('#story-category').textContent=data.category;
    $('#back-career').href='/?career='+encodeURIComponent(id)+'#careers';
    $('#video-count').textContent=videoRows.length?String(videoRows.length):'đang cập nhật';
    $('#video-selector-label').hidden=videoRows.length<2;
    $('#video-selector').innerHTML=videoRows.map(v=>`<option value="${esc(v.id)}">${esc(v.title)}</option>`).join('');
    if(selectedVideo)$('#video-selector').value=selectedVideo.id;
    $('#story-note').textContent=data.note;
    $('#story-sources').innerHTML=data.sources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join('');
    const explicit=url.searchParams.get('tab');
    chooseTab(requestedScene>=0?'comic':['video','comic'].includes(explicit)?explicit:selectedVideo?'video':'comic',false);
    $('#story-detail').hidden=false;
  }catch(error){
    if(turn!==epoch||error.name==='AbortError')return;
    $('#story-error-text').textContent=error.message||'Chưa mở được nội dung. Em thử lại nhé.';$('#story-error').hidden=false;
  }finally{if(turn===epoch)$('#story-loading').hidden=true;}
}
$('#story-filters').addEventListener('submit',e=>{e.preventDefault();clearTimeout(searchTimer);filterURL();});
$('#story-search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(filterURL,160);});
$('#story-category-filter').addEventListener('change',filterURL);
$('#story-more').addEventListener('click',()=>{shown+=12;libraryCards();});
$('#tab-video').addEventListener('click',()=>chooseTab('video'));$('#tab-comic').addEventListener('click',()=>chooseTab('comic'));
$('.story-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'video':e.key==='End'?'comic':view==='video'?'comic':'video';chooseTab(next);$('#tab-'+next).focus();}});
$('#play-video').addEventListener('click',()=>{if(!selectedVideo||$('#play-video').disabled)return;$('#play-video').hidden=true;$('#video-fallback').hidden=true;player.open(selectedVideo);});
$('#video-selector').addEventListener('change',()=>{selectedVideo=videoRows.find(v=>v.id===$('#video-selector').value);player.clear();resetAsk();renderVideo();});
$('#prev-scene').addEventListener('click',()=>go(index-1));
$('#next-scene').addEventListener('click',()=>{if(index===story.scenes.length-1){ended=true;renderScene();$('#day-summary').focus({preventScroll:true});}else go(index+1);});
$('#restart-story').addEventListener('click',()=>{answers=new Map();go(0);});$('#return-last-scene').addEventListener('click',()=>go(story.scenes.length-1));
$('#ask-scene').addEventListener('click',()=>{$('#story-ask-form').hidden=!$('#story-ask-form').hidden;if(!$('#story-ask-form').hidden)$('#story-question').focus();});
$('#retry-story').addEventListener('click',()=>route());
$('#story-ask-form').addEventListener('submit',e=>{
  e.preventDefault();if(readonly||!story)return;
  const question=$('#story-question').value.trim();if(question.length<3)return;remember();
  const saved=view==='video'&&selectedVideo?offerVideoQuestion(selectedVideo,question):offerStoryQuestion(story,story.scenes[index],question);
  if(!saved){$('#story-answer').hidden=false;$('#story-answer').textContent='Trình duyệt đang chặn lưu trong tab. Em sao chép câu hỏi trước khi mở AI Chat nhé.';return;}
  location.assign(journeyPath('/ai-career-advisor?mode=career_exploration&career_id='+encodeURIComponent(story.id)));
});
document.addEventListener('click',e=>{
  const link=e.target.closest('[data-story],[data-library]');
  if(link&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.button===0){e.preventDefault();route({push:link.getAttribute('href')});window.scrollTo({top:0,behavior:'instant'});return;}
  const choice=e.target.closest('[data-choice]');
  if(choice&&story){const s=story.scenes[index];if(!s.choices.some(c=>c.choice_id===choice.dataset.choice))return;const draft=$('#story-question').value;answers.set(s.scene_id,choice.dataset.choice);renderScene();$('#story-question').value=draft;}
});
window.addEventListener('popstate',()=>route({resume:true}));
mobileCareers.addEventListener('change',()=>{if(catalog&&!$('#story-library').hidden)libraryCards();});
window.addEventListener('pageshow',event=>{if(event.persisted)route({resume:true});});
window.addEventListener('pagehide',()=>{remember();controller?.abort();player.clear();});
route({resume:performance.getEntriesByType('navigation')[0]?.type==='back_forward'});
