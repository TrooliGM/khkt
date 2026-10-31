"""Focused interaction QA; auth/chat fixtures ONLY on loopback, never shipped."""
import asyncio,json,subprocess,time,traceback
from pathlib import Path
import httpx,websockets
import browser_mobile_layout as fixture

R=Path(__file__).resolve().parents[1];A=R/'artifacts';O=fixture.O
report={'status':'RUNNING','environment':'Chrome desktop/mobile emulation; no physical phone','checks':{}}
async def run(tab):
    async with websockets.connect(tab['webSocketDebuggerUrl'],origin='http://localhost:9298',max_size=20000000) as ws:
        b=fixture.Browser(ws)
        for method in ('Runtime.enable','Page.enable','Network.enable'):await b.call(method)
        await b.call('Page.bringToFront');await b.call('Emulation.setFocusEmulationEnabled',{'enabled':True})
        await b.call('Fetch.enable',{'patterns':[{'urlPattern':origin+path} for origin in (O,'http://127.0.0.1:8079') for path in ('/assets/firebase-client.js*','/api/auth/*','/api/ai/*')]})
        for width in (320,360,390,412,1440):
            mobile=width<760;height=844 if mobile else 1000
            await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':mobile})
            await b.call('Emulation.setTouchEmulationEnabled',{'enabled':mobile})
            # Header/hero have identical computed styles and geometry to the release.
            snapshots=[]
            for origin in ('http://127.0.0.1:8079',O):
                await b.call('Page.navigate',{'url':origin+'/'});await b.wait('document.querySelectorAll("#library-categories button").length===12')
                await b.evaluate('document.fonts.ready');await asyncio.sleep(.2)
                snapshots.append(await b.evaluate("['.home-brand','.hero','.hero h1','.hero-actions'].map(s=>{const n=document.querySelector(s),r=n.getBoundingClientRect(),c=getComputedStyle(n);return {rect:[r.x,r.y,r.width,r.height].map(v=>Math.round(v)),color:c.color,background:c.backgroundColor,font:c.font,transform:c.transform,transition:c.transition}})"))
            assert snapshots[0]==snapshots[1],('home changed',width,snapshots)
            assert await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
            report['checks'][f'home_unchanged_{width}']=True
            if mobile:
                await b.evaluate("document.querySelector('#careers').scrollIntoView()")
                # A late response cannot replace groups after Return; no animation blocks controls.
                await b.evaluate("for(let i=0;i<6;i++){document.querySelector('[data-mobile-group]').click();document.querySelector('[data-mobile-back]').click()}")
                await asyncio.sleep(.7)
                assert await b.evaluate("document.querySelectorAll('[data-mobile-group]').length===12&&document.querySelector('#library-categories').getAttribute('aria-busy')==='false'&&!document.querySelector('.mobile-grid-loading')")
                report['checks'][f'rapid_group_return_{width}']=True
            await b.call('Page.navigate',{'url':O+'/mot-ngay-lam-viec'})
            await b.wait("document.querySelector('#story-library')?.hidden===false")
            if mobile:
                await b.click('[data-mobile-group]');await b.wait('document.querySelector(".mobile-video-cover")')
                await asyncio.sleep(.2)
                await b.evaluate("document.querySelector('[data-mobile-back]').focus({preventScroll:true})")
                assert await b.evaluate("document.activeElement.matches('[data-mobile-back]')")
                await b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter','text':'\r','windowsVirtualKeyCode':13});await b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Enter','code':'Enter','windowsVirtualKeyCode':13})
                await b.wait("document.querySelectorAll('[data-mobile-group]').length===12")
                await b.click('[data-mobile-group]');await b.wait('document.querySelector(".mobile-video-cover")')
                button='[data-mobile-back]'
                await b.evaluate(f'document.querySelector({json.dumps(button)}).scrollIntoView({{block:"center"}})')
                rect=await b.evaluate(f'(()=>{{const r=document.querySelector({json.dumps(button)}).getBoundingClientRect();return {{x:r.x+r.width/2,y:r.y+r.height/2}}}})()')
                await b.call('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[rect]})
                await asyncio.sleep(.12)
                pressed=await b.evaluate(f'(()=>{{const n=document.querySelector({json.dumps(button)});return {{filter:getComputedStyle(n).filter,active:n.matches(":active"),hit:document.elementFromPoint({rect["x"]},{rect["y"]})?.closest("button")?.className}}}})()')
                assert pressed['filter']!='none',pressed
                await b.call('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                await b.wait("document.querySelectorAll('[data-mobile-group]').length===12")
            else:
                await b.wait('document.querySelectorAll(".story-card").length===12')
                await b.evaluate("document.querySelector('.story-card-main').scrollIntoView({block:'center'});document.querySelector('.story-card-main').focus({preventScroll:true})")
                assert await b.evaluate("getComputedStyle(document.activeElement).outlineStyle!=='none'")
                rect=await b.evaluate("(()=>{const r=document.querySelector('.story-card').getBoundingClientRect();return {x:r.x+20,y:r.y+20,width:r.width,height:r.height}})()")
                await b.call('Input.dispatchMouseEvent',{'type':'mouseMoved','x':rect['x'],'y':rect['y']});await asyncio.sleep(.2)
                assert await b.evaluate("getComputedStyle(document.querySelector('.story-card')).boxShadow!=='none'&&getComputedStyle(document.querySelector('.story-card')).transform==='none'")
                after=await b.evaluate("(()=>{const r=document.querySelector('.story-card').getBoundingClientRect();return [r.width,r.height]})()")
                assert after==[rect['width'],rect['height']]
                await b.shot('desktop-stories.png')
            report['checks'][f'keyboard_and_pointer_or_touch_{width}']=True
            await b.call('Page.navigate',{'url':O+'/ai-career-advisor?conversation='+fixture.SID});await b.wait('document.querySelector(".answer-more")')
            await b.evaluate("document.querySelector('#chat-scroll').scrollTop=70")
            before=await b.evaluate("document.querySelector('#chat-scroll').scrollTop")
            await b.evaluate("const s=document.querySelector('.answer-evidence summary');for(let i=0;i<10;i++)s.click()")
            await asyncio.sleep(.25)
            assert await b.evaluate("!document.querySelector('.answer-evidence').open&&document.querySelector('#thinking').hidden&&document.querySelectorAll('.answer-evidence').length===1")
            assert abs(before-await b.evaluate("document.querySelector('#chat-scroll').scrollTop"))<2
            await b.evaluate("document.querySelector('.answer-evidence summary').focus({preventScroll:true})")
            await b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Enter','code':'Enter','text':'\r','windowsVirtualKeyCode':13});await b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Enter','code':'Enter','windowsVirtualKeyCode':13})
            await b.wait('document.querySelector(".answer-evidence").open')
            assert await b.evaluate("document.querySelector('.source-list a').getClientRects().length>0")
            # Full content survives DOM-only disclosure, excluding the added toggle label.
            result=await b.evaluate("(()=>{const bubble=[...document.querySelectorAll('.assistant .message-bubble')].find(n=>n.querySelector('.answer-more')).cloneNode(true);bubble.querySelectorAll('.answer-more>summary').forEach(n=>n.remove());const original=document.createElement('div');original.innerHTML=DOMPurify.sanitize(marked.parse("+json.dumps(fixture.GUIDE)+",{breaks:true}));return bubble.textContent.replace(/\\s+/g,' ').trim()===original.textContent.replace(/\\s+/g,' ').trim()})()")
            assert result
            await b.call('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
            await b.click('.answer-more summary');await asyncio.sleep(.02)
            assert await b.evaluate("document.getAnimations().length===0&&getComputedStyle(document.querySelector('.answer-more summary')).transitionDuration==='0s'")
            await b.call('Emulation.setEmulatedMedia',{'features':[]})
            report['checks'][f'rapid_disclosure_keyboard_content_scroll_reduced_motion_{width}']=True
            if not mobile:await b.shot('desktop-chat.png')
        assert not b.errors;report.update(status='PASS',js_errors=0)

def main():
    proc=subprocess.Popen(['C:/Program Files/Google/Chrome/Application/chrome.exe','--headless=new','--no-first-run','--no-proxy-server','--remote-debugging-port=9298','--remote-allow-origins=http://localhost:9298','--user-data-dir='+str(A/('chrome-motion-'+str(time.time_ns()))),'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
    try:
        for _ in range(100):
            try:
                tabs=[t for t in httpx.get('http://localhost:9298/json',timeout=1).json() if t['type']=='page']
                if tabs:break
            except Exception:pass
            time.sleep(.1)
        asyncio.run(run(tabs[0]))
    except Exception as e:
        report.update(status='FAIL',error_type=type(e).__name__,line=traceback.extract_tb(e.__traceback__)[-1].lineno,reason=str(e)[:500]);raise
    finally:
        (A/'interaction-motion-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');proc.terminate();proc.wait(timeout=10)
    print(json.dumps(report))
if __name__=='__main__':main()
