import {installJourneyNavigation,recordExploration} from './chat-journey.js';
import {mobileCareers,renderMobileCareers,clearMobileGrid} from './mobile-career-grid.js';
import {revealGrid} from './interaction-motion.js';
installJourneyNavigation();
const $ = s => document.querySelector(s);
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let categories=[], category='', offset=0, generation=0, modalGeneration=0, selected=false;
const symbols=['⌘','✚','▤','⚙','◇','▥','✳','◉','⚖','♧','☀','⚗'];
async function json(url) {
  const response=await fetch(url); const body=await response.json();
  if(!response.ok) throw new Error(typeof body.detail==='string'?body.detail:'Chưa tải được dữ liệu.');
  return body;
}
function categoryState(){
  document.querySelectorAll('[data-field]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.field===category)));
  $('#library-reset').hidden=!selected;
}
function mobileURL(push=false){
  if(!mobileCareers.matches)return;
  const u=new URL(location.href);u.searchParams.delete('career');
  for(const key of ['category_id','career_q','all_careers'])u.searchParams.delete(key);
  if(category)u.searchParams.set('category_id',category);
  if($('#career-search').value.trim())u.searchParams.set('career_q',$('#career-search').value.trim());
  if(selected&&!category&&!$('#career-search').value.trim())u.searchParams.set('all_careers','1');
  u.hash='careers';if(u.href!==location.href)history[push?'pushState':'replaceState'](null,'',u);
}
function mobileGrid(items=null,loading=false){
  renderMobileCareers($('#library-categories'),{categories,category,items,loading,onSelect:id=>{category=id;selected=true;$('#career-search').value='';mobileURL(true);load();},onBack:()=>reset(),onCareer:openCareer});
}
function desktopCategories(){
  const host=$('#library-categories');clearMobileGrid(host);host.replaceChildren();
  categories.forEach((c,i)=>{const button=document.createElement('button');button.dataset.field=c.category_id;button.setAttribute('aria-pressed',String(c.category_id===category));button.innerHTML=`<span class="field-symbol" aria-hidden="true">${symbols[i]}</span><strong>${escape(c.name)}</strong><small>${c.count} nghề <span aria-hidden="true">↗</span></small>`;button.addEventListener('click',()=>{category=c.category_id;selected=true;$('#career-search').value='';categoryState();load();});host.append(button);});
}
async function load(append=false){
  const ticket=++generation;
  if(!append){offset=0;$('#career-grid').replaceChildren();}
  $('#library-more').hidden=true;$('#career-status').textContent='Đang tìm nghề…';
  $('#career-status').dataset.loading='true';
  try{
    if(mobileCareers.matches){
      mobileGrid([],true);
      const items=[];let total=Infinity;
      while(items.length<total){
        const params=new URLSearchParams({q:$('#career-search').value.trim(),category_id:category,offset:String(items.length),limit:'24'});
        const data=await json('/api/career-library?'+params);if(ticket!==generation)return;
        total=data.total;items.push(...data.items);if(!data.items.length)break;
      }
      mobileGrid(items);categoryState();$('#career-status').textContent=`${items.length} nghề`;return;
    }
    const params=new URLSearchParams({q:$('#career-search').value.trim(),category_id:category,offset:String(offset),limit:'12'});
    const data=await json('/api/career-library?'+params);
    if(ticket!==generation)return;
    for(const c of data.items){
      const button=document.createElement('button');button.className='library-card';
      button.innerHTML=`<span class="library-tag">${escape(categories.find(x=>x.category_id===c.category_id)?.name||'')}</span><h3>${escape(c.name)}</h3><p>${escape(c.short_description)}</p><span class="library-card-link">Tìm hiểu nghề <span aria-hidden="true">↗</span></span>`;
      button.addEventListener('click',()=>openCareer(c.career_id));$('#career-grid').append(button);
    }
    offset+=data.items.length;
    $('#career-status').textContent=data.total?`${data.total} nghề · Đang xem ${offset} nghề`:'Chưa tìm thấy nghề. Em thử từ khóa khác hoặc bỏ bộ lọc nhé.';
    $('#library-more').hidden=offset>=data.total;
    revealGrid($('#career-grid'));
  }catch(error){if(ticket===generation){$('#career-status').textContent=error.message+' Em có thể bấm Tìm kiếm để thử lại.';$('#library-categories').setAttribute('aria-busy','false');$('#library-categories .mobile-grid-loading')?.remove();}}
  finally{if(ticket===generation)$('#career-status').dataset.loading='false';}
}
async function openCareer(id,update=true){
  if(update){const url=new URL(location.href);url.searchParams.set('career',id);url.hash='careers';if(url.href!==location.href)history.pushState(null,'',url);}
  const ticket=++modalGeneration;
  const dialog=$('#content-dialog'), content=$('#dialog-content');
  content.innerHTML='<h2 id="dialog-title">Đang mở nghề…</h2>';
  if(!dialog.open)dialog.showModal();
  try{
    const c=await json('/api/career-library/'+encodeURIComponent(id));
    if(ticket!==modalGeneration||!dialog.open)return;
    recordExploration(c.career_id);
    const lists=(title,items)=>`<h3>${title}</h3><ul>${items.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`;
    const fold=(title,body)=>`<details class="career-profile-section"><summary>${title}</summary>${body}</details>`;
    const day=(c.typical_day||[]).map(x=>`${x.stage}: ${x.activity}`);
    const skills=(c.skill_details||[]).map(x=>`${x.skill}: ${x.reason}`);
    const requirements=c.professional_requirements||{};
    const sources=(c.sources||[]).filter(x=>/^https:\/\//.test(x.url)).map(x=>`<li><a href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">${escape(x.label)} ↗</a></li>`).join('');
    content.innerHTML=`<span class="eyebrow">${escape(categories.find(x=>x.category_id===c.category_id)?.name||'KHÁM PHÁ NGHỀ')}</span><h2 id="dialog-title">${escape(c.name)}</h2><p>${escape(c.description)}</p>${lists('Công việc thường ngày',c.daily_tasks)}${fold('Một ngày làm việc điển hình',lists('Nhịp công việc minh họa',day)+'<p class="content-note">Không phải lịch bắt buộc: công việc thay đổi theo vị trí, chuyên môn và môi trường.</p>')}${fold('Kỹ năng và lý do cần rèn luyện',lists('Kỹ năng hữu ích',skills.length?skills:c.skills))}${fold('Môi trường và trách nhiệm',`<p>${escape(c.work_environment)}</p>${lists('Khó khăn và thử thách',c.challenges)}`)}${fold('Lộ trình khám phá cho học sinh',lists('Môn học liên quan',c.related_subjects)+lists('Bước học và trải nghiệm',c.learning_path||[]))}${fold('Điều kiện nghề và nguồn đối chiếu',`<p>${escape(requirements.note||'Kiểm tra yêu cầu theo vị trí cụ thể.')}</p><p class="content-note">${escape(requirements.study_note||'')}</p>${sources?'<ul>'+sources+'</ul>':''}`)}<div class="library-modal-actions"><a class="btn btn-coral" href="/ai-career-advisor?mode=career_exploration&amp;career_id=${encodeURIComponent(c.career_id)}">Cùng tìm hiểu nghề ↗</a><a class="btn btn-ink" href="/mot-ngay-lam-viec?nghe=${encodeURIComponent(c.career_id)}">Xem truyện một ngày làm việc →</a></div>`;
  }catch(e){if(ticket!==modalGeneration||!dialog.open)return;content.replaceChildren();const title=document.createElement('h2');title.id='dialog-title';title.textContent=e.message;content.append(title);}
}
window.openLibraryCareer=openCareer;
$('#search-form').addEventListener('submit',event=>{event.preventDefault();selected=true;mobileURL();categoryState();load();});
let debounce;$('#career-search').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{if($('#career-search').value.trim()){selected=true;mobileURL();categoryState();load();}else if(mobileCareers.matches&&category){mobileURL();load();}else reset();},250);});
$('#show-all').addEventListener('click',()=>{selected=true;category='';$('#career-search').value='';mobileURL(true);categoryState();load();});
$('#library-more').addEventListener('click',()=>load(true));
function reset({push=true}={}){generation++;selected=false;category='';offset=0;$('#career-search').value='';$('#career-grid').replaceChildren();$('#library-more').hidden=true;$('#career-status').dataset.loading='false';$('#career-status').textContent='Chọn lĩnh vực hoặc tìm kiếm để bắt đầu.';categoryState();if(mobileCareers.matches){if(push)mobileURL(true);mobileGrid();}}
function restoreMobileFilters(){const p=new URL(location.href).searchParams;category=categories.some(c=>c.category_id===p.get('category_id'))?p.get('category_id'):'';$('#career-search').value=(p.get('career_q')||'').slice(0,120);selected=Boolean(category||$('#career-search').value||p.get('all_careers')==='1');if(selected)load();else reset({push:false});}
$('#library-reset').addEventListener('click',reset);
try{
  categories=(await json('/api/career-library/categories')).items;
  desktopCategories();if(mobileCareers.matches)restoreMobileFilters();else reset({push:false});
  const returnCareer=new URLSearchParams(location.search).get('career');
  if(returnCareer && /^[a-z0-9-]{1,80}$/.test(returnCareer))await openCareer(returnCareer,false);
}catch(e){$('#career-status').textContent=e.message;}

window.addEventListener('popstate',()=>{if(mobileCareers.matches)restoreMobileFilters();const id=new URLSearchParams(location.search).get('career');if(id&&/^[a-z0-9-]{1,80}$/.test(id))openCareer(id,false);else{modalGeneration++;$('#content-dialog').close();}});
mobileCareers.addEventListener('change',()=>{if(mobileCareers.matches){if(selected)load();else mobileGrid();}else{desktopCategories();if(selected)load();}});
window.addEventListener('pageshow',event=>{if(event.persisted)installJourneyNavigation();});
