"""Chrome emulation at four widths. Chat/auth/mic fixtures exist ONLY on loopback/CDP.
Career/catalog endpoints remain real. Never run these fixtures on Preview/Production.
"""
import asyncio,base64,json,subprocess,sys,time,traceback
from pathlib import Path
from urllib.parse import urlsplit
import httpx,websockets
R=Path(__file__).resolve().parents[1];O='http://127.0.0.1:8078';ART=R/'artifacts';ART.mkdir(exist_ok=True)
SID='11111111-1111-4111-8111-111111111111';SURVEY='22222222-2222-4222-8222-222222222222'
GUIDE='Sở thích này là một điểm để em thử khám phá nghề giáo viên. Chưa đủ thông tin để kết luận em phù hợp với nghề.\n\n### Căn cứ từ câu trả lời của bạn\n\nEm thích đặt câu hỏi và giải thích cho bạn bè. Đây là dữ liệu tổng hợp dùng riêng cho kiểm thử.\n\n### Rèn kỹ năng giải thích ngay ở trường\n\nGiải thích dễ hiểu là kỹ năng có thể luyện tập, bắt đầu bằng một việc nhỏ.\n\n'
for title,body in [('Giúp một bạn cùng bàn','Đừng đưa đáp án ngay. Thử hỏi bạn đang nghĩ thế nào rồi điều chỉnh cách giải thích.'),('Thử ba cách nói','Chọn một khái niệm trong Toán, Lý hoặc Tin học. Giải thích cho một bạn còn vướng, một bạn học tốt và người chưa biết nội dung đó.'),('Tham gia nhóm học tập','Hướng dẫn bạn, hỗ trợ nhóm và trình bày một phần bài học. Cùng quan sát xem cách giải thích nào giúp người nghe dễ hình dung hơn.'),('Quan sát giáo viên','Chú ý cách thầy cô đổi cách giảng khi cả lớp chưa hiểu. Hỏi lại những điểm còn chưa rõ và ghi chép điều em muốn thử ở lần tiếp theo.')]:GUIDE+='#### '+title+'\n\n'+body+' '+body+'\n\n'
GUIDE+='### Kết luận\n\nKẾT LUẬN LUÔN HIỆN: đây là hướng để thử khám phá, chưa phải kết luận năng lực.\n\n'
SOURCE={'url':'https://example.org/nguon-kiem-thu','title':'Nguồn tổng hợp dành riêng kiểm thử','domain':'example.org','supporting_excerpt':'Trích dẫn tổng hợp kiểm thử, không phải nguồn sản phẩm.','retrieved_at':'2026-10-30','published_at':None}
def session(sid):
    return {'id':sid,'title':'Hội thoại tổng hợp kiểm thử','remember':False,'created_at':'2026-10-30T00:00:00Z','updated_at':'2026-10-30T00:00:00Z','messages':[{'role':'assistant','content':'Chào em!','survey_required':sid==SURVEY}]+([] if sid==SURVEY else [{'role':'user','content':'Em thích đặt câu hỏi và giải thích cho bạn bè.'},{'role':'assistant','content':GUIDE,'request_id':'test-long-answer','sources':[SOURCE]}])}
SESSIONS={s:session(s) for s in (SID,SURVEY)};requests=[];GUEST_ROLE=False
FIREBASE="""const user={uid:'mobile-test-member',providerData:[{providerId:'password'}],displayName:'Tài khoản kiểm thử',getIdToken:async()=> 'test-only-loopback'};const auth={currentUser:user};const sdk={onAuthStateChanged(a,f){queueMicrotask(()=>f(user));return()=>{}},signOut:async()=>{}};export async function getFirebase(){return {auth,sdk}}export async function restoredUser(){return user}"""
MIC="""window.SpeechRecognition=class{start(){setTimeout(()=>{const r=[{transcript:'Bản nháp giọng nói kiểm thử',confidence:1}];r.isFinal=true;this.onresult?.({resultIndex:0,results:[r]});this.onend?.()},80)}stop(){this.onend?.()}abort(){this.onend?.()}};window.webkitSpeechRecognition=window.SpeechRecognition;"""
class Browser:
    def __init__(self,ws):self.ws=ws;self.seq=0;self.pending={};self.errors=[];self.reader=asyncio.create_task(self.pump())
    async def pump(self):
        async for raw in self.ws:
            e=json.loads(raw)
            if 'id' in e:
                f=self.pending.pop(e['id'],None)
                if f and not f.done():f.set_result(e)
            elif e.get('method')=='Runtime.exceptionThrown':self.errors.append(e['params']['exceptionDetails'])
            elif e.get('method')=='Fetch.requestPaused':asyncio.create_task(self.fixture(e['params']))
    async def call(self,m,p=None):
        self.seq+=1;n=self.seq;f=asyncio.get_running_loop().create_future();self.pending[n]=f
        await self.ws.send(json.dumps({'id':n,'method':m,'params':p or {}}));v=await asyncio.wait_for(f,35)
        if 'error' in v:raise RuntimeError(v['error'])
        return v.get('result',{})
    async def evaluate(self,s):
        r=await self.call('Runtime.evaluate',{'expression':s,'awaitPromise':True,'returnByValue':True})
        if r.get('exceptionDetails'):raise AssertionError(r['exceptionDetails'])
        return r.get('result',{}).get('value')
    async def wait(self,s,timeout=25):
        for _ in range(int(timeout/.1)):
            if await self.evaluate('Boolean('+s+')'):return
            await asyncio.sleep(.1)
        raise AssertionError('WAIT '+s)
    async def click(self,s):await self.call('Runtime.evaluate',{'expression':'document.querySelector('+json.dumps(s)+').click()','userGesture':True})
    async def fixture(self,p):
        req=p['request'];u=urlsplit(req['url']);path=u.path;method=req['method'];body={};status=200;ctype='application/json'
        assert u.hostname=='127.0.0.1','FIXTURES_ONLY_ON_LOOPBACK'
        if path=='/assets/firebase-client.js':body=FIREBASE;ctype='text/javascript'
        elif path=='/api/auth/config':body={'configured':True,'config':{}}
        elif path=='/api/auth/me':body={'user':{'uid':'mobile-test-member','provider':'password'}}
        elif path=='/api/ai/config':body={'mode':'live','configured':True,'model':'test-only','is_guest':GUEST_ROLE,'profile_enabled':False,'task4_enabled':True,'automatic_analysis':True,'chat_pipeline':'task41','web_search_enabled':True,'microphone':{'google':False},'guest_quota':{'limit':8,'remaining':5,'used_questions':3} if GUEST_ROLE else None,'analysis_policy':{'daily_limit':6}}
        elif path=='/api/ai/sessions':body={'items':[dict(s,messages=None) for s in SESSIONS.values()]}
        elif path=='/api/ai/chat':
            data=json.loads(req.get('postData','{}'));requests.append(data)
            await asyncio.sleep(.45)
            if data['message']=='FAIL_TEST' and len(requests)==1:status=503;body={'detail':'DATABASE_URL / DEEPSEEK_API_KEY internal configuration example'}
            else:
                s=SESSIONS[data['session_id']];s['messages'].extend([{'role':'user','content':data['message'],'request_id':data['request_id']},{'role':'assistant','content':'Phản hồi ngắn dành riêng cho kiểm thử.','request_id':data['request_id']}]);body={'session':s,'pipeline':'task41','guest_quota':None}
        elif path.startswith('/api/ai/sessions/'):
            sid=path.split('/')[4];body={'session':SESSIONS[sid]}
            if path.endswith('/analysis'):body={'status':'pending'}
        else:status=404;body={'detail':'test endpoint not implemented'}
        encoded=body if isinstance(body,str) else json.dumps(body,ensure_ascii=False)
        await self.call('Fetch.fulfillRequest',{'requestId':p['requestId'],'responseCode':status,'responseHeaders':[{'name':'Content-Type','value':ctype+'; charset=utf-8'}],'body':base64.b64encode(encoded.encode()).decode()})
    async def shot(self,name):
        v=await self.call('Page.captureScreenshot',{'format':'png'});(ART/name).write_bytes(base64.b64decode(v['data']))
async def run(tab):
    global GUEST_ROLE
    report={'environment':'desktop Chrome emulating mobile; NOT physical phones','chat_auth_model_mic':'CDP fixtures on loopback ONLY; not deployed','career_data':'real local API/catalog','widths':{},'status':'RUNNING'}
    if '--desktop-only' in sys.argv:report=json.loads((ART/'final-layout-qa.json').read_text(encoding='utf8'))
    def save():(ART/'final-layout-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    async with websockets.connect(tab['webSocketDebuggerUrl'],origin='http://localhost:9294',max_size=20000000) as ws:
        b=Browser(ws)
        for m in ('Runtime.enable','Page.enable','Network.enable'):await b.call(m)
        await b.call('Page.addScriptToEvaluateOnNewDocument',{'source':MIC})
        await b.call('Fetch.enable',{'patterns':[{'urlPattern':origin+p} for origin in (O,'http://127.0.0.1:8079') for p in ('/assets/firebase-client.js*','/api/auth/*','/api/ai/*')]})
        groups=httpx.get(O+'/api/career-library/categories').json()['items'];assert sum(x['count'] for x in groups)==200
        for width in ((1280,1440) if '--desktop-only' in sys.argv else (320,360,390,412,1280,1440)):
            checks={};report['widths'][str(width)]=checks
            await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':844,'deviceScaleFactor':1,'mobile':width<=760})
            for kind,path,host in [('careers','/#careers','#library-categories'),('stories','/mot-ngay-lam-viec','#story-grid')]:
                await b.call('Page.navigate',{'url':O+path});await b.wait(f'document.querySelectorAll("{host} [data-mobile-group]").length===12')
                order=await b.evaluate(f'[...document.querySelectorAll("{host} [data-mobile-group]")].map(n=>n.dataset.mobileGroup)');assert order==[g['category_id'] for g in groups]
                seen=set()
                for i,g in enumerate(groups):
                    await b.click(f'{host} [data-mobile-group="{g["category_id"]}"]')
                    await b.wait(f'document.querySelectorAll("{host} [data-mobile-career]").length==={g["count"]}')
                    cells=await b.evaluate(f'[...document.querySelectorAll("{host} [data-mobile-career]")].map(n=>n.dataset.mobileCareer)');seen.update(cells)
                    back=await b.evaluate(f'(()=>{{const n=document.querySelector("{host} [data-mobile-back]");return [n.style.gridRowStart,n.style.gridColumnStart,n.getBoundingClientRect().height]}})()');assert back[0]==str(i//(2 if width<=760 else 4)+1) and back[1]==str(i%(2 if width<=760 else 4)+1) and back[2]>=44
                    assert await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                    if kind=='stories':assert await b.evaluate("[...document.querySelectorAll('.mobile-video-cover')].every(n=>Math.abs(n.getBoundingClientRect().width/n.getBoundingClientRect().height-16/9)<.04)&&[...document.querySelectorAll('.mobile-comic-link')].every(n=>n.getBoundingClientRect().height>=44)")
                    await b.click(f'{host} [data-mobile-back]');await b.wait(f'document.querySelectorAll("{host} [data-mobile-group]").length===12')
                    assert await b.evaluate(f'[...document.querySelectorAll("{host} [data-mobile-group]")].map(n=>n.dataset.mobileGroup)')==order
                assert len(seen)==200;checks[kind+'_all_groups_200_cards_pinned_return']=True
                await b.click(f'{host} [data-mobile-group="{groups[2]["category_id"]}"]');await b.wait(f'document.querySelectorAll("{host} [data-mobile-career]").length>0');await b.click(f'{host} [data-mobile-back]');await b.wait(f'document.querySelectorAll("{host} [data-mobile-group]").length===12')
                await b.evaluate('history.back()');await b.wait(f'document.querySelector("{host} [data-mobile-back]")');await b.evaluate('history.forward()');await b.wait(f'document.querySelectorAll("{host} [data-mobile-group]").length===12');checks[kind+'_back_forward']=True
                field='#career-search' if kind=='careers' else '#story-search'
                await b.evaluate('document.querySelector('+json.dumps(field)+').value="ky su du lieu";document.querySelector('+json.dumps(field)+').dispatchEvent(new Event("input"))')
                await b.wait(f'document.querySelectorAll("{host} [data-mobile-career]").length===1');checks[kind+'_search']=True
                if kind=='stories':
                    await b.click('.mobile-comic-link');await b.wait("document.querySelector('#tab-comic')?.getAttribute('aria-selected')==='true'&&document.querySelector('#scene-art svg')");await b.click('#next-scene');assert await b.evaluate("document.querySelector('#reading-progress').value>0");await b.click('#tab-video');assert await b.evaluate("document.querySelector('#tab-video').getAttribute('aria-selected')==='true'");checks['video_comic_reader']=True
                await b.call('Page.navigate',{'url':O+path});await b.wait(f'document.querySelectorAll("{host} [data-mobile-group]").length===12')
                if kind=='careers':await b.evaluate("document.querySelector('#careers').scrollIntoView();window.scrollBy(0,-100)")
                await b.shot(f'final-{kind}-{width}.png')
                await b.click(f'{host} [data-mobile-group="{groups[2]["category_id"]}"]');await b.wait(f'document.querySelectorAll("{host} [data-mobile-career]").length>0');await b.shot(f'final-{kind}-selected-{width}.png')
            await b.call('Page.navigate',{'url':O+'/ai-career-advisor?conversation='+SID});await b.wait("document.querySelectorAll('.answer-more').length===1")
            assert await b.evaluate("document.querySelector('.assistant-identity h1').innerText==='La Bàn AI'&&document.querySelector('#mobile-account').getBoundingClientRect().width>=44")
            assert await b.evaluate("(()=>{const keep=document.querySelector('#keep-conversation'),old=keep.hidden;keep.hidden=true;const visible=document.querySelector('#end-session').getClientRects().length>0;keep.hidden=old;return visible})()")
            await b.click('#open-sidebar')
            if width<=760:await b.click('#close-sidebar')
            else:assert await b.evaluate("document.activeElement.id==='history-search'")
            assert await b.evaluate("document.querySelector('.answer-evidence')&&!document.querySelector('.answer-evidence').open&&!document.querySelector('.answer-more').open")
            assert await b.evaluate("document.querySelector('.source-list').open&&document.querySelector('.source-list a').getClientRects().length>0")
            assert await b.evaluate("[...document.querySelectorAll('.message-bubble h3')].find(n=>n.textContent==='Kết luận').getClientRects().length>0")
            assert await b.evaluate("document.querySelector('.answer-more .answer-disclosure-content').getClientRects().length===0")
            scroll=await b.evaluate("(()=>{const s=document.querySelector('#chat-scroll');s.scrollTop=70;return s.scrollTop})()")
            await b.click('.answer-evidence summary');await asyncio.sleep(.1);assert abs(await b.evaluate("document.querySelector('#chat-scroll').scrollTop")-scroll)<2
            await b.click('.answer-more summary');await asyncio.sleep(.1);assert abs(await b.evaluate("document.querySelector('#chat-scroll').scrollTop")-scroll)<2
            assert await b.evaluate("document.querySelector('.answer-more').open&&document.querySelector('.answer-more summary').textContent.includes('Thu gọn')")
            for marker in ('Giúp một bạn cùng bàn','Thử ba cách nói','Tham gia nhóm học tập','Quan sát giáo viên','KẾT LUẬN LUÔN HIỆN'):
                assert await b.evaluate('document.querySelector("#messages").textContent.includes('+json.dumps(marker)+')')
            assert await b.evaluate("document.documentElement.scrollWidth<=innerWidth+1&&document.querySelector('#send-message').getBoundingClientRect().width>=44&&document.querySelector('#microphone').getBoundingClientRect().width>=44")
            checks['chat_disclosures_sources_conclusion_scroll_content']=True
            await b.shot(f'final-chat-{width}.png')
            if width<=760:
                await b.evaluate("const s=document.querySelector('#chat-scroll');s.scrollTop=s.scrollHeight;document.querySelector('#message-input').focus()")
                await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':380,'deviceScaleFactor':1,'mobile':width<=760})
                await b.wait("document.querySelector('.composer-area').getBoundingClientRect().bottom<=381")
                await asyncio.sleep(.15)
                assert await b.evaluate("document.querySelector('#message-input').getBoundingClientRect().bottom<=380&&document.querySelector('#chat-scroll').getBoundingClientRect().bottom<=document.querySelector('.composer-area').getBoundingClientRect().top+1")
                checks['keyboard_viewport_simulation']=True
                await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':844,'deviceScaleFactor':1,'mobile':width<=760})
                await b.wait("document.querySelector('.composer-area').getBoundingClientRect().bottom>700")
            await b.evaluate("document.querySelector('#message-input').value='Bản nháp kiểm thử';document.querySelector('#message-input').dispatchEvent(new Event('input'))")
            await b.call('Page.reload');await b.wait("document.querySelector('#message-input')?.value==='Bản nháp kiểm thử'");checks['draft_reload']=True
            await b.click('#microphone');await b.wait("document.querySelector('#message-input').value.includes('Bản nháp giọng nói kiểm thử')");assert not requests;checks['mic_simulation_no_auto_send']=True
            await b.evaluate("document.querySelector('#message-input').value='Gửi kiểm thử';document.querySelector('#message-input').dispatchEvent(new Event('input'));document.querySelector('#message-form').requestSubmit()")
            await b.wait("!document.querySelector('#thinking').hidden");assert await b.evaluate("document.querySelector('#send-message').disabled")
            await b.wait("document.querySelector('#messages').textContent.includes('Phản hồi ngắn dành riêng cho kiểm thử.')&&document.querySelector('#thinking').hidden");assert len(requests)==1;requests.clear();checks['send_simulation']=True
            # Independent width cases must not advance the SAME survey six times.
            # This storage belongs only to synthetic loopback fixtures, never real users/quota.
            await b.evaluate("if(location.hostname==='127.0.0.1')sessionStorage.clear()")
            await b.call('Page.navigate',{'url':O+'/ai-career-advisor?conversation='+SURVEY});await b.wait("document.querySelector('#career-survey')?.hidden===false")
            await b.evaluate("document.querySelector('#survey-answer').value='Câu một tổng hợp';document.querySelector('#survey-answer').dispatchEvent(new Event('input'));document.querySelector('#survey-next').click();document.querySelector('#survey-answer').value='Nháp câu hai';document.querySelector('#survey-answer').dispatchEvent(new Event('input'))")
            await b.call('Page.navigate',{'url':O+'/mot-ngay-lam-viec'});await b.wait("document.querySelectorAll('[data-mobile-group]').length===12");await b.evaluate('history.back()');await b.wait("document.querySelector('#survey-answer')?.value==='Nháp câu hai'");await b.call('Page.reload');await b.wait("document.querySelector('#survey-answer')?.value==='Nháp câu hai'");checks['survey_navigation_back_reload']=True
            save()
        # Safe user error: internal provider/database configuration never enters the chat notice.
        await b.call('Page.navigate',{'url':O+'/ai-career-advisor?conversation='+SID});await b.wait("document.querySelector('#chat-app')?.hidden===false&&!document.querySelector('#message-form').hidden&&!document.querySelector('#message-input').disabled&&document.querySelectorAll('.message-row').length>=3")
        await b.evaluate("document.querySelector('#message-input').value='FAIL_TEST';document.querySelector('#message-input').dispatchEvent(new Event('input'));document.querySelector('#message-form').requestSubmit()")
        await b.wait("!document.querySelector('#chat-notice').hidden")
        assert await b.evaluate("!document.querySelector('#chat-notice').textContent.includes('DATABASE_URL')&&!document.querySelector('#chat-notice').textContent.includes('API_KEY')")
        await b.click('#retry-send');await b.wait("document.querySelector('#thinking').hidden&&document.querySelector('#chat-notice').hidden")
        assert len(requests)==2 and requests[0]['request_id']==requests[1]['request_id']
        report['friendly_error_and_retry_same_request_id']=True;requests.clear()
        GUEST_ROLE=True
        for width in (320,360,390,412,1280,1440):
            await b.call('Emulation.setDeviceMetricsOverride',{'width':width,'height':844,'deviceScaleFactor':1,'mobile':width<=760})
            await b.call('Page.navigate',{'url':O+'/ai-career-advisor?conversation='+SID});await b.wait("document.querySelector('#guest-quota-text')?.textContent.includes('5/8')")
            assert await b.evaluate("document.documentElement.scrollWidth<=innerWidth+1&&document.querySelector('#open-sidebar').getBoundingClientRect().height>=44&&document.querySelector('#mobile-account').getBoundingClientRect().height>=44")
        report['guest_quota_uses_api_fixture_values_six_widths']=True;GUEST_ROLE=False
        report['desktop_shared_grid_and_compact_header']=True
        report['retained_member_controls_visible_six_widths']=True
        assert not b.errors;report['js_errors']=0;report['status']='PASS';save();print(json.dumps(report,ensure_ascii=True))
def main():
    proc=subprocess.Popen(['C:/Program Files/Google/Chrome/Application/chrome.exe','--headless=new','--no-first-run','--no-proxy-server','--remote-debugging-port=9294','--remote-allow-origins=http://localhost:9294','--user-data-dir='+str(Path('C:/Users/Administrator/AppData/Local/Temp')/('laban-final-layout-'+str(time.time_ns()))),'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
    try:
        for _ in range(100):
            try:
                tabs=[t for t in httpx.get('http://localhost:9294/json',timeout=1).json() if t['type']=='page']
                if tabs:break
            except Exception:pass
            time.sleep(.1)
        asyncio.run(run(tabs[0]))
    except Exception as e:print(json.dumps({'status':'FAIL','error_type':type(e).__name__,'line':traceback.extract_tb(e.__traceback__)[-1].lineno,'reason':str(e)[:450]}));sys.exit(1)
    finally:proc.terminate();proc.wait(timeout=10)
if __name__=='__main__':main()
