// Motion never owns application state; interrupted animations are disposable.
const css=document.createElement('link');css.rel='stylesheet';css.href='/assets/interaction-motion.css?v=1';document.head.append(css);
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),running=new Set();
let pressed;
const clearPress=()=>{pressed?.removeAttribute('data-laban-pressed');pressed=null;};
document.addEventListener('pointerdown',event=>{
  clearPress();const control=event.target.closest('button,a,summary');
  if(event.button!==0||!control?.closest('.career-library,.stories-page,.advisor-page')||control.matches(':disabled,[aria-disabled="true"]'))return;
  pressed=control;control.setAttribute('data-laban-pressed','');
},{passive:true});
for(const type of ['pointerup','pointercancel','scroll'])document.addEventListener(type,clearPress,{passive:true,capture:true});
window.addEventListener('blur',clearPress);
export function reveal(element){
  if(!element?.isConnected||reduced.matches||!element.animate)return;
  element.getAnimations().forEach(animation=>animation.cancel());
  const animation=element.animate([{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:150,easing:'ease-out'});
  running.add(animation);animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
}
export function revealGrid(host){
  // Leave the green return tile stationary; no stagger or delayed controls.
  for(const node of host.children)if(!node.matches('[data-mobile-back]'))reveal(node);
}
reduced.addEventListener('change',()=>{if(reduced.matches){for(const animation of running)animation.cancel();running.clear();}});
