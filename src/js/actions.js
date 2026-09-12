function saveRefuel(fuel){const date=document.getElementById('mDate').value||today(), mileage=Math.round(parseNum(document.getElementById('mMileage').value)), liters=round2(parseNum(document.getElementById('mLiters').value)), price=round2(parseNum(document.getElementById('mPrice').value)), comment=document.getElementById('mComment').value.trim(), fullTank=document.getElementById('mFull').checked; if(mileage<=0)return toast('Введи пробіг'); if(liters<=0||price<=0)return toast('Введи літри й ціну'); const old=state.history.find(e=>e.id===editingEntryId); const entry={id:editingEntryId||uid(),fuel,date,mileage,liters,price,comment,sum:round2(liters*price),fullTank,updatedAt:new Date().toISOString(),createdAt:editingEntryId?(old?.createdAt||new Date().toISOString()):new Date().toISOString()}; if(editingEntryId)state.history=state.history.map(e=>e.id===editingEntryId?entry:e); else state.history.push(entry); if(fuel==='gas')state.settings.lastGasPrice=price; else state.settings.lastPetrolPrice=price; saveState();closeModal();render();toast('Заправку збережено')}
function editEntry(id){const e=state.history.find(x=>x.id===id); if(e)openRefuelModal(e.fuel,e)} async function deleteEntry(id){const ok=await askConfirm('Видалити заправку?','Цей запис буде прибрано з історії, а баланс пального і пробіг перерахуються.','Видалити','Скасувати','danger'); if(!ok)return; state.history=state.history.filter(e=>e.id!==id); saveState();render();toast('Запис видалено')}
function editCorrection(id){const c=state.corrections.find(x=>x.id===id); if(c)openBalanceModal(c.kind,c)} async function deleteCorrection(id){const ok=await askConfirm('Видалити корекцію?','Баланс буде перераховано без цієї ручної зміни.','Видалити','Скасувати','danger'); if(!ok)return; state.corrections=state.corrections.filter(c=>c.id!==id);saveState();render();toast('Корекцію видалено')}
function addCalcSegment(){const km=parseNum(document.getElementById('calcKm')?.value), mode=document.getElementById('calcMode')?.value||'city'; if(km<=0)return toast('Введи кілометри'); state.calc.segments.push({id:uid(),km:round1(km),mode}); updateCalcOptions(false); toast('Відрізок додано')} function deleteCalcSegment(id){state.calc.segments=state.calc.segments.filter(s=>s.id!==id); saveState();render()} function copyCalcSegment(id){const s=state.calc.segments.find(x=>x.id===id); if(s)state.calc.segments.push({...s,id:uid()}); saveState();render();toast('Відрізок скопійовано')} function editCalcSegment(id){const s=state.calc.segments.find(x=>x.id===id); if(!s)return; const km=prompt('Кілометри:',String(s.km).replace('.',',')); if(km===null)return; const mode=confirm('ОК = траса, Скасувати = місто')?'road':'city'; s.km=round1(parseNum(km)); s.mode=mode; saveState();render()} function calcSegmentHtml(s){return `<div class="item ${s.mode}"><div class="item-main"><div class="item-title">${s.mode==='road'?'🔵 Траса':'🟡 Місто'} · ${fmt(s.km,1)} км</div></div><div class="row" style="flex-wrap:nowrap"><button class="mini-btn" data-action="editCalcSegment" data-id="${s.id}">Ред.</button><button class="mini-btn" data-action="copyCalcSegment" data-id="${s.id}">Копія</button><button class="mini-btn danger" data-action="deleteCalcSegment" data-id="${s.id}">×</button></div></div>`} function clearCalc(){state.calc.segments=[];saveState();render();toast('Калькулятор очищено')} function updateCalcOptions(doRender=true){state.calc.price=round2(parseNum(document.getElementById('calcPrice')?.value)||state.settings.lastGasPrice);state.calc.roundTrip=!!document.getElementById('calcRoundTrip')?.checked;state.calc.shared=!!document.getElementById('calcShared')?.checked;state.calc.passengers=parseInt(document.getElementById('calcPassengers')?.value||1);state.calc.includeDriver=!!document.getElementById('calcIncludeDriver')?.checked;saveState();if(doRender)render()}
function saveGasQuickPrice(){const val=round2(parseNum(document.getElementById('gasQuickPrice')?.value)); if(val<=0)return toast('Введи ціну за літр'); state.settings.lastGasPrice=val; saveState(); render(); toast('Ціну газу оновлено')} function saveSettingsFromInputs(){state.settings.gasCity=round1(parseNum(document.getElementById('setGasCity').value));state.settings.gasRoad=round1(parseNum(document.getElementById('setGasRoad').value));state.settings.gasTankCapacity=round1(parseNum(document.getElementById('setGasCap').value));state.settings.petrolTankCapacity=round1(parseNum(document.getElementById('setPetrolCap').value));state.settings.gasWarningPercent=round1(parseNum(document.getElementById('setWarnPercent').value));state.settings.gasWarningKm=round1(parseNum(document.getElementById('setWarnKm').value));state.settings.lastGasPrice=round2(parseNum(document.getElementById('setGasPrice').value));state.settings.lastPetrolPrice=round2(parseNum(document.getElementById('setPetrolPrice').value));saveState();render();toast('Налаштування збережено')}
function openPetrolLevel(){
  const cur=lastPetrolBars();
  const initBars=cur!==null?cur:5;
  document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>📊 Рівень датчика бензину</h2><button class="mini-btn" data-modal-close>Закрити</button></div>
<p class="muted" style="font-size:14px;margin:0 0 14px">Натисни на паличку, щоб встановити рівень. Знизу — порожньо, зверху — повний бак.</p>
<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
<div id="levelGaugeInteractive">${buildInteractiveGauge(initBars)}</div>
<div style="flex:1;min-width:140px">
<div style="font-size:40px;font-weight:900;letter-spacing:-.04em" id="levelReadout">${initBars}/9</div>
<div style="font-size:13px;color:var(--muted);margin-bottom:14px" id="levelDesc">${barDesc(initBars)}</div>
<label>Дата</label><input id="lvlDate" type="date" value="${today()}" style="margin-bottom:10px">
<label>Коментар</label><input id="lvlComment" placeholder="Необов'язково" style="margin-bottom:14px">
<button class="btn good" style="width:100%" id="saveLvlBtn">Зберегти рівень</button>
</div></div>
</div></div></div>`;
  document.querySelectorAll('[data-modal-close]').forEach(x=>x.onclick=closeModal);
  document.getElementById('saveLvlBtn').onclick=savePetrolLevel;
  bindLevelGauge(initBars);
}
function barDesc(b){return b===0?'Порожньо':b<=2?'🔴 Мало! Варто заправитись':b<=4?'🟡 Менше половини':b<=6?'🟢 Більше половини':b<=8?'🟢 Майже повний':'🟢 Повний бак'}
let _currentLevelBars=5;
function buildInteractiveGauge(bars){_currentLevelBars=bars;const segs=[];for(let i=9;i>=1;i--){const bg=barColor(i,bars);const bd=barBorder(i,bars);segs.push(`<div data-baridx="${i}" style="width:54px;height:28px;border-radius:8px;border:2px solid ${bd};background:${bg};cursor:pointer;transition:all .15s;box-shadow:${i<=bars?'0 2px 6px rgba(0,0,0,.12)':'none'}" onclick="setLevelBar(${i})"></div>`)}return `<div style="display:flex;flex-direction:column;gap:5px">${segs.join('')}</div>`}
function setLevelBar(i){_currentLevelBars=i;const gaugeEl=document.getElementById('levelGaugeInteractive');if(gaugeEl)gaugeEl.innerHTML=buildInteractiveGauge(i);const ro=document.getElementById('levelReadout');if(ro)ro.textContent=i+'/9';const desc=document.getElementById('levelDesc');if(desc)desc.textContent=barDesc(i);}
function bindLevelGauge(initBars){_currentLevelBars=initBars;}
function savePetrolLevel(){const bars=_currentLevelBars;const date=document.getElementById('lvlDate')?.value||today();const comment=document.getElementById('lvlComment')?.value.trim()||'';if(!state.petrolLevels)state.petrolLevels=[];state.petrolLevels.push({id:uid(),bars,date,comment,createdAt:new Date().toISOString()});saveState();closeModal();render();toast('Рівень бензину збережено')}
async function deletePetrolLevel(id){const ok=await askConfirm('Видалити фіксацію рівня?','Цей запис зникне з розрахунку км/паличку.','Видалити','Скасувати','danger');if(!ok)return;state.petrolLevels=(state.petrolLevels||[]).filter(l=>l.id!==id);saveState();render();toast('Запис видалено')}
async function recalcPetrolKmpb(){render();toast('Перераховано по '+((state.petrolLevels||[]).length)+' фіксаціях рівня')}
async function resetPetrolStats(){const ok=await askConfirm('Скинути статистику бензину?','Це видалить всі фіксації рівня датчика (записи заправок залишаться). Після скидання зможеш накопичити нову статистику — наприклад, для іншої пори року.','Скинути','Скасувати','danger');if(!ok)return;const prev=clone(state.petrolLevels||[]);state.petrolLevels=[];saveState();render();toastUndo('Статистику бензину скинуто.',()=>{state.petrolLevels=prev;saveState();render();toast('Скидання скасовано')},5)}
async function resetPetrolStats(){const ok=await askConfirm('Скинути статистику бензину?','Всі фіксації рівня датчика будуть видалені. Розрахунок км/паличку почнеться з нуля. Заправки та витрати залишаться.','Скинути','Скасувати','danger');if(!ok)return;const prev=clone(state.petrolLevels||[]);state.petrolLevels=[];saveState();render();toastUndo('Фіксації рівня видалено.',()=>{state.petrolLevels=prev;saveState();render();toast('Скидання скасовано')},5)}
function closeModal(){document.getElementById('modalRoot').innerHTML='';editingEntryId=null;editingTripId=null;editingCorrectionId=null}
function exportBackup(showToast=true){const payload={app:'palne-plus',version:17,exportedAt:new Date().toISOString(),data:state}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`palne-plus-backup-${today()}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); if(showToast)toast('Backup експортовано')}
function csvCell(v){const s=String(v??'');return /[;\n\r"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s} function exportCsv(){const rows=[['type','date','fuel_or_mode','km','liters','price_per_l','sum','mileage','full_tank','comment']];
  for(const lv of (state.petrolLevels||[]).sort((a,b)=>(a.date||'').localeCompare(b.date||''))){rows.push(['рівень_бензину',lv.date,'бензин','','','','','','',lv.bars+'/9 паличок'+(lv.comment?' · '+lv.comment:'')])}
 const events=allEventsAsc(); for(const e of events){if(e.type==='refuel'){rows.push(['заправка',e.date,e.fuel==='gas'?'газ':'бензин','',fmt(e.liters,1),fmt(e.price,1),fmt(parseNum(e.liters)*parseNum(e.price),1),mileageFmt(e.mileage),e.fullTank?'так':'ні',e.comment||''])}else if(e.type==='trip'){const after=current().tripAfter?.[e.id]||e.odometerAfter||''; rows.push(['поїздка',e.date,e.mode==='road'?'траса':'місто',fmt(e.km,1),'','','',after?mileageFmt(after):'', '', e.comment||''])}else if(e.type==='correction'){rows.push(['корекція',e.date,e.kind||'', '', '', '', '', e.kind==='odometer'?mileageFmt(e.value):'', '', e.comment||''])}} const csv='\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\n'); const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`palne-plus-history-${today()}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); toast('CSV експортовано')}
document.getElementById('importFile').addEventListener('change',async e=>{const file=e.target.files[0]; if(!file)return; try{const text=await file.text(); const next=normalizeImportedState(JSON.parse(text)); const ok=await askConfirm('Імпортувати backup?','Поточні дані буде замінено даними з JSON-файлу.','Імпортувати','Скасувати','primary'); if(!ok)return; state=next; saveState(); setTheme(state.theme||'light'); render(); setTab(state.activeTab||'gas'); toast('Backup імпортовано')}catch(err){console.error(err);toast('Не вдалося імпортувати JSON')}finally{e.target.value=''}});
function askConfirm(title,message,okText='Так',cancelText='Скасувати',tone='primary'){return new Promise(resolve=>{const root=document.getElementById('modalRoot'); const okClass=tone==='danger'?'btn danger':'btn good'; root.innerHTML=`<div class="modal-backdrop"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>${esc(title)}</h2></div><div class="muted" style="font-size:15px;line-height:1.55">${esc(message)}</div><div class="modal-actions"><button type="button" class="btn secondary" id="confirmCancel">${esc(cancelText)}</button><button type="button" class="${okClass}" id="confirmOk">${esc(okText)}</button></div></div></div>`; const done=v=>{root.innerHTML='';resolve(v)}; document.getElementById('confirmCancel').onclick=()=>done(false); document.getElementById('confirmOk').onclick=()=>done(true)})}
function askOdoDiff(diff,fromValue=null,toValue=null){return new Promise(resolve=>{const root=document.getElementById('modalRoot'); const details=(fromValue!==null&&toValue!==null)?`Було ${mileageFmt(fromValue)} км, стало ${mileageFmt(toValue)} км. Різниця: ${mileageFmt(diff)} км.`:`Різниця: ${mileageFmt(diff)} км.`; root.innerHTML=`<div class="modal-backdrop"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>Додати ${mileageFmt(diff)} км у статистику?</h2></div><div class="muted" style="font-size:15px;line-height:1.55">${details}<br>Можна записати різницю як поїздку, щоб вона потрапила в статистику і списала газ.</div><div class="modal-actions"><button class="btn secondary" id="odoNo">Ні, тільки пробіг</button><button class="btn city-choice" id="odoCity">🟡 Так, місто</button><button class="btn road-choice" id="odoRoad">🔵 Так, траса</button></div></div></div>`; const done=v=>{root.innerHTML='';resolve(v)}; document.getElementById('odoNo').onclick=()=>done('no'); document.getElementById('odoCity').onclick=()=>done('city'); document.getElementById('odoRoad').onclick=()=>done('road')})}
async function askBackupBeforeDelete(){return new Promise(resolve=>{const root=document.getElementById('modalRoot'); root.innerHTML=`<div class="modal-backdrop"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>Зробити backup перед видаленням?</h2></div><div class="muted" style="font-size:15px;line-height:1.55">Перед очищенням історії можна зберегти JSON-файл, щоб потім відновити дані.</div><div class="modal-actions"><button class="btn secondary" id="backupCancel">Скасувати</button><button class="btn secondary" id="backupSkip">Не треба</button><button class="btn good" id="backupMake">Зробити backup</button></div></div></div>`; const done=v=>{root.innerHTML='';resolve(v)}; document.getElementById('backupCancel').onclick=()=>done('cancel');document.getElementById('backupSkip').onclick=()=>done('skip');document.getElementById('backupMake').onclick=()=>done('backup')})}
async function clearAllHistory(){if(!state.history.length&&!state.trips.length&&!(state.corrections||[]).length)return toast('Історія вже порожня'); const backupChoice=await askBackupBeforeDelete(); if(backupChoice==='cancel')return; if(backupChoice==='backup')exportBackup(false); if(backupChoice==='skip'){const really=await askConfirm('Точно видалити всю історію?','Backup не буде створено. Будуть видалені всі заправки, поїздки й корекції. Після видалення ще буде 5 секунд, щоб скасувати дію.','Так, видалити','Скасувати','danger'); if(!really)return} const prev={history:clone(state.history),trips:clone(state.trips),corrections:clone(state.corrections||[]),petrolLevels:clone(state.petrolLevels||[])}; state.history=[];state.trips=[];state.corrections=[];state.petrolLevels=[];saveState();render();toastUndo('Історію видалено.',()=>{state.history=prev.history;state.trips=prev.trips;state.corrections=prev.corrections;state.petrolLevels=prev.petrolLevels;saveState();render();toast('Видалення скасовано')},5)}
async function resetAll(){const ok=await askConfirm('Скинути всі дані програми?','Це видалить історію, поїздки, корекції й налаштування. Після скидання буде 5 секунд, щоб скасувати дію.','Скинути','Скасувати','danger'); if(!ok)return; const prev=clone(state); state=clone(defaults); saveState(); setTheme('light'); render(); setTab('gas'); toastUndo('Дані скинуто.',()=>{state=prev;saveState();setTheme(state.theme||'light');render();setTab(state.activeTab||'gas');toast('Скидання скасовано')},5)}
function toast(msg){clearTimeout(toastTimer);document.getElementById('toastRoot').innerHTML=`<div class="toast">${esc(msg)}</div>`;toastTimer=setTimeout(()=>document.getElementById('toastRoot').innerHTML='',2200)} function toastUndo(msg,undo,sec=5){clearTimeout(undoTimer);let left=sec; const root=document.getElementById('toastRoot'); const draw=()=>{root.innerHTML=`<div class="toast"><span>${esc(msg)} ${left} с</span><button id="undoBtn">Скасувати</button></div>`;document.getElementById('undoBtn').onclick=()=>{clearInterval(undoTimer);root.innerHTML='';undo()}}; draw(); undoTimer=setInterval(()=>{left--; if(left<=0){clearInterval(undoTimer);root.innerHTML=''}else draw()},1000)}
function showTip(el,text){const root=document.getElementById('tipRoot'); const r=el.getBoundingClientRect(); const left=Math.min(window.innerWidth-314,Math.max(14,r.left-260)); const top=Math.min(window.innerHeight-80,Math.max(14,r.bottom+8)); root.innerHTML=`<div class="tip-pop" style="left:${left}px;top:${top}px">${esc(text)}</div>`; clearTimeout(root._timer); root._timer=setTimeout(()=>root.innerHTML='',4200)}
document.addEventListener('click',e=>{const tip=e.target.closest('[data-tip]'); if(tip){e.preventDefault();e.stopPropagation();showTip(tip,tip.dataset.tip);return} const el=e.target.closest('[data-action]'); if(!el){if(!e.target.closest('.tip-pop'))document.getElementById('tipRoot').innerHTML=''; if(!e.target.closest('.nav-shell')){const p=document.getElementById('menuPanel'); if(p)p.classList.remove('open')} return;} e.preventDefault(); e.stopPropagation(); handleAction(el.dataset.action,el.dataset.id,el.dataset.value)}); document.getElementById('menuToggle').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.getElementById('menuPanel').classList.toggle('open')}); document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab))); document.getElementById('themeBtn').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));

// Odometer widget state
let _odoDelta=0;
let _odoHoldTimer=null;
let _odoHoldInterval=null;

function setOdoMode(m){state._odoMode=m;const mc=document.getElementById('odoModeCity'),mr=document.getElementById('odoModeRoad'),cf=document.getElementById('odoConfirm');if(mc)mc.classList.toggle('active',m==='city');if(mr)mr.classList.toggle('active',m==='road');if(cf){cf.className='odo-confirm '+m}}

function odoStep(dir){
  _odoDelta=Math.max(0,_odoDelta+dir);
  const base=current().odometer;
  const disp=document.getElementById('odoDisplay');
  const delta=document.getElementById('odoDelta');
  if(disp){disp.textContent=mileageFmt(base+_odoDelta)+' км';disp.classList.remove('bump');void disp.offsetWidth;disp.classList.add('bump')}
  if(delta){delta.textContent=(_odoDelta>0?'+':'')+_odoDelta+' км';delta.style.color=_odoDelta>0?'var(--gas)':'var(--muted)'}
  if(navigator.vibrate)navigator.vibrate(6);
}

let _odoHoldFired=false;
function odoStartHold(dir){
  _odoHoldFired=false;
  _odoHoldTimer=setTimeout(()=>{_odoHoldFired=true;_odoHoldInterval=setInterval(()=>odoStep(dir*10),500)},200);
}
function odoStopHold(dir){clearTimeout(_odoHoldTimer);clearInterval(_odoHoldInterval);if(!_odoHoldFired&&dir!==undefined)odoStep(dir)}

function bindOdoWidget(){
  const plus=document.getElementById('odoPlus');
  const minus=document.getElementById('odoMinus');
  const confirm=document.getElementById('odoConfirm');
  if(!plus||!minus||!confirm)return;
  _odoDelta=0;
  const updateDisplay=()=>{const base=current().odometer;const disp=document.getElementById('odoDisplay');const delta=document.getElementById('odoDelta');if(disp)disp.textContent=mileageFmt(base)+' км';if(delta)delta.textContent='+0 км'};
  updateDisplay();
  plus.addEventListener('mousedown',()=>odoStartHold(1));
  plus.addEventListener('touchstart',e=>{e.preventDefault();odoStartHold(1)},{passive:false});
  minus.addEventListener('mousedown',()=>odoStartHold(-1));
  minus.addEventListener('touchstart',e=>{e.preventDefault();odoStartHold(-1)},{passive:false});
  plus.addEventListener('mouseup',()=>odoStopHold(1));
  plus.addEventListener('mouseleave',()=>odoStopHold());
  plus.addEventListener('touchend',()=>odoStopHold(1));
  plus.addEventListener('touchcancel',()=>odoStopHold());
  minus.addEventListener('mouseup',()=>odoStopHold(-1));
  minus.addEventListener('mouseleave',()=>odoStopHold());
  minus.addEventListener('touchend',()=>odoStopHold(-1));
  minus.addEventListener('touchcancel',()=>odoStopHold());
  confirm.addEventListener('click',()=>{
    if(_odoDelta<=0)return toast('Натисни + щоб додати кілометри');
    const mode=state._odoMode||'city';
    addTripRecord({km:_odoDelta,mode,date:today(),comment:''});
    _odoDelta=0;
    const disp=document.getElementById('odoDisplay');
    const delta=document.getElementById('odoDelta');
    if(delta)delta.textContent='+0 км';
    // display updated by render() inside addTripRecord
  });
}


