"""Read real local career data; compare every rendered profile field with its API.
No auth/AI fixtures, writes, model requests or video playback in this test.
"""
import asyncio,json,subprocess,time,traceback
from pathlib import Path
import httpx,websockets
from browser_mobile_layout import Browser
R=Path(__file__).resolve().parents[1];A=R/'artifacts';O='http://127.0.0.1:8078'
report={'status':'RUNNING','environment':'Chrome emulation; not physical devices','real_local_catalog':True,'widths':{}}
async def run(tab):
    groups=httpx.get(O+'/api/career-library/categories').json()['items']
    async with websockets.connect(tab['webSocketDebuggerUrl'],origin='http://localhost:9301',max_size=20000000) as ws:
        b=Browser(ws)
        for m in ('Runtime.enable','Page.enable'):await b.call(m)
        await b.call('Page.bringToFront');await b.call('Emulation.setFocusEmulationEnabled',{'enabled':True})
        for width in (320,360,390,412,1280,1440):
            columns=2 if width<=760 else 4;checks=[]
            await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':844 if width<=760 else 1000,'deviceScaleFactor':1,'mobile':width<=760})
            await b.call('Page.navigate',{'url':O+'/#careers'});await b.wait("document.querySelectorAll('#library-categories [data-mobile-group]').length===12")
            assert await b.evaluate(f"getComputedStyle(document.querySelector('#library-categories')).gridTemplateColumns.split(' ').length==={columns}")
            for index in (0,6,11):
                group=groups[index];await b.click(f'[data-mobile-group="{group["category_id"]}"]')
                await b.wait(f"document.querySelectorAll('#library-categories [data-mobile-career]').length==={group['count']}&&document.querySelector('#career-status').dataset.loading==='false'")
                assert await b.evaluate(f"document.querySelector('#career-status').textContent==='{group['count']} nghề'")
                assert await b.evaluate(f"document.querySelector('[data-mobile-back]').style.gridRowStart==='{index//columns+1}'&&document.querySelector('[data-mobile-back]').style.gridColumnStart==='{index%columns+1}'&&getComputedStyle(document.querySelector('[data-mobile-back]')).backgroundColor==='rgb(36, 120, 79)'")
                assert await b.evaluate("!document.querySelector('.mobile-career-card img')&&[...document.querySelectorAll('.career-explore')].every(n=>n.textContent==='Cùng khám phá')")
                cid=await b.evaluate("document.querySelector('[data-mobile-career]').dataset.mobileCareer")
                data=httpx.get(O+'/api/career-library/'+cid).json()
                await b.evaluate("document.querySelector('.career-name').focus({preventScroll:true})")
                assert await b.evaluate("getComputedStyle(document.activeElement).outlineStyle!=='none'&&getComputedStyle(document.activeElement).outlineWidth!=='0px'")
                assert await b.evaluate('document.querySelector(".career-card-description").textContent==='+json.dumps(data['short_description']))
                assert await b.evaluate('new URL(document.querySelector(".career-watch-video").href).searchParams.get("nghe")==='+json.dumps(cid)+'&&new URL(document.querySelector(".career-watch-video").href).searchParams.get("tab")==="video"')
                await b.click('.career-name');await b.wait('document.querySelector("#content-dialog").open&&document.querySelectorAll(".career-profile-section").length===5')
                # All fields of the pre-existing rich profile stay present in the DOM.
                expected=[data['name'],data['description'],data['work_environment'],*data['daily_tasks'],*data['challenges'],*data['related_subjects'],*data.get('learning_path',[])]
                for row in data.get('typical_day',[]):expected += [row['stage'],row['activity']]
                for row in data.get('skill_details',[]):expected += [row['skill'],row['reason']]
                if not data.get('skill_details'):expected+=data.get('skills',[])
                expected += [data.get('professional_requirements',{}).get(key,'') for key in ('note','study_note')]
                actual=await b.evaluate('document.querySelector("#dialog-content").textContent')
                assert all(s in actual for s in expected if s),(width,cid,'missing profile value',[s for s in expected if s and s not in actual])
                links=await b.evaluate('[...document.querySelectorAll("#dialog-content a")].map(n=>n.href)')
                assert all(source['url'] in links for source in data.get('sources',[]) if source['url'].startswith('https://'))
                assert await b.evaluate('(()=>{const links=[...document.querySelectorAll(".library-modal-actions a")].map(n=>new URL(n.href));return links.some(u=>u.pathname==="/ai-career-advisor"&&u.searchParams.get("career_id")==='+json.dumps(cid)+')&&links.some(u=>u.searchParams.get("nghe")==='+json.dumps(cid)+'&&!u.searchParams.has("tab"))&&links.some(u=>u.searchParams.get("nghe")==='+json.dumps(cid)+'&&u.searchParams.get("tab")==="video")})()')
                await b.evaluate("(()=>{const s=document.querySelector('.career-profile-section summary');for(let i=0;i<10;i++)s.click();document.querySelectorAll('.career-profile-section').forEach(n=>n.open=true)})()")
                await asyncio.sleep(.2)
                assert await b.evaluate("document.querySelector('#content-dialog').scrollWidth<=document.querySelector('#content-dialog').clientWidth+1&&document.documentElement.scrollWidth<=innerWidth+1")
                if index==6 and width in (390,1440):
                    await b.evaluate("document.querySelector('#content-dialog').scrollTop=0");await b.shot(f'final-popup-{width}.png')
                await b.call('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
                await b.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'Escape','code':'Escape','windowsVirtualKeyCode':27});await b.call('Input.dispatchKeyEvent',{'type':'keyUp','key':'Escape','code':'Escape','windowsVirtualKeyCode':27})
                await b.wait('!document.querySelector("#content-dialog").open')
                assert await b.evaluate('!document.getAnimations().length')
                await b.call('Emulation.setEmulatedMedia',{'features':[]})
                await b.click('.career-explore');await b.wait('document.querySelector("#content-dialog").open&&document.querySelectorAll(".career-profile-section").length===5')
                await b.evaluate("document.querySelector('#content-dialog').close();document.querySelector('.career-explore').click()")
                await b.wait('document.querySelector("#content-dialog").open&&document.querySelectorAll(".career-profile-section").length===5')
                await b.click('#content-dialog .dialog-close');await b.wait('!document.querySelector("#content-dialog").open')
                await b.click('[data-mobile-back]');await b.wait('document.querySelectorAll("[data-mobile-group]").length===12')
                assert await b.evaluate('[...document.querySelectorAll("[data-mobile-group]")].map(n=>n.dataset.mobileGroup)')==[g['category_id'] for g in groups]
                checks.append({'group_index':index,'count':group['count'],'profile_values_checked':len(expected),'sources_checked':len(data.get('sources',[])),'links':'PASS','return_position_order':'PASS'})
            report['widths'][str(width)]=checks
        assert not b.errors;report.update(status='PASS',js_errors=0)
def main():
    p=subprocess.Popen(['C:/Program Files/Google/Chrome/Application/chrome.exe','--headless=new','--no-first-run','--no-proxy-server','--remote-debugging-port=9301','--remote-allow-origins=http://localhost:9301','--user-data-dir='+str(Path('C:/Users/Administrator/AppData/Local/Temp')/('laban-final-profiles-'+str(time.time_ns()))),'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
    try:
        for _ in range(100):
            try:
                tabs=[t for t in httpx.get('http://localhost:9301/json',timeout=1).json() if t['type']=='page']
                if tabs:break
            except Exception:pass
            time.sleep(.1)
        asyncio.run(run(tabs[0]))
    except Exception as e:report.update(status='FAIL',frames=[{'file':Path(f.filename).name,'line':f.lineno} for f in traceback.extract_tb(e.__traceback__)],reason=str(e)[:450])
    finally:p.terminate();p.wait(timeout=10);(A/'final-profiles-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=True));raise SystemExit(0 if report['status']=='PASS' else 1)
if __name__=='__main__':main()
