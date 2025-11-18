# ReadMe\_BaseScore\_Helper\_Bookmarklet

### Demo Screenshots / GIF

**Base Score Box Active (GIF Example):**  
`![Base Score Box Demo](screenshots/base_score_demo.gif)`

**Base Score Box Example:**  
`![Debug Drag Demo](screenshots/BaseScore.png)`


## Overview

This bookmarklet enhances the Judge Click scoring interface by automatically detecting and summing the **top three left-side score inputs** in real time. It displays the live calculated **Base Score** in a draggable floating panel. It is optimized to be pasted into the **browser console**, supports toggle hotkeys, and does not require any extensions.

---

## Key Features

- 🎯 **Auto Sum of Top 3 Inputs** — Always detects the top three editable score fields.
- 📦 **Floating Base Score Panel** — Draggable, always on top, very light and readable.
- 🔴 **Debug Mode (D key)** — Shows live input ranks and values directly on screen.
- ⛔ **Script Toggle (S key)** — Hide/show the Base Score box and stop/start updates.
- ⚡ **Very lightweight** — Updates every 200ms, minimal impact on performance.
- 🧠 **No Tampermonkey needed** — Works via copy-paste into console.

---

## To Use

1. Open Judge Click Tool
2. Click you Bookmarklet (see instructions below)

   Note: Bookmarklet tool will only activate with Judge Click - deactivated for other URLs (will warn with "Tool only runs on judge.click")

---

## Bookmarklet Instructions

To use this script as a bookmarklet:

1. Copy the full one-line compressed bookmarklet code below.
2. Open your browser and create a new bookmark.
3. Name the bookmark (e.g., **Base Score Tool**).   or whatever you prefer
4. In the URL/location field of the bookmark, paste the code exactly as it appears. (code below)
5. While on the Judge Click scoring page, simply click the bookmark to activate the script.

### Bookmarklet Code

```
javascript:(function(){if(!/judge\.click/.test(location.href)){alert('This tool only runs on judge.click');return;}if(window._judgeBaseScore)return;window._judgeBaseScore=true;let debugEnabled=true,scriptEnabled=true,debounceTime=100,updateTimeout;const getDisplayedNumber=el=>{if(!el)return 0;if(el.tagName==='INPUT')return parseFloat(el.value)||0;const child=el.querySelector('span,div');if(child){const num=parseFloat(child.innerText.replace(/[^\d.-]/g,''));if(!isNaN(num))return num;}if(el.dataset?.value)return parseFloat(el.dataset.value)||0;return 0};const getTopThreeInputs=()=>[...document.querySelectorAll('input')].filter(inp=>!inp.readOnly&&!inp.disabled&&inp.getBoundingClientRect().left<200).map(inp=>({el:inp,top:inp.getBoundingClientRect().top})).sort((a,b)=>a.top-b.top).slice(0,3).map(x=>x.el);let panel=document.getElementById('baseScorePanel');if(!panel){panel=document.createElement('div');panel.id='baseScorePanel';Object.assign(panel.style,{position:'fixed',bottom:'160px',left:'10px',width:'130px',padding:'6px',background:'#ffffcc',border:'1px solid #999',borderRadius:'6px',textAlign:'center',zIndex:9999,boxShadow:'2px 2px 8px rgba(0,0,0,0.3)',cursor:'move'});document.body.appendChild(panel);const baseLabel=document.createElement('div');baseLabel.id='baseLabel';baseLabel.innerText='Base Score';Object.assign(baseLabel.style,{fontSize:'18px',fontWeight:'600',color:'#333',marginBottom:'6px',fontFamily:'Arial, sans-serif'});panel.appendChild(baseLabel);const sumBox=document.createElement('input');sumBox.id='sumBox';sumBox.readOnly=true;sumBox.placeholder='Sum';Object.assign(sumBox.style,{padding:'8px 12px',fontSize:'20px',fontWeight:'bold',width:'100%',boxSizing:'border-box',textAlign:'center',borderRadius:'4px',border:'1px solid #999',cursor:'default'});panel.appendChild(sumBox);}(()=>{const dragPanel=panel;let offsetX=0,offsetY=0,isDragging=false;dragPanel.addEventListener('mousedown',e=>{if(e.target.id==='sumBox')return;isDragging=true;offsetX=e.clientX-dragPanel.getBoundingClientRect().left;offsetY=e.clientY-dragPanel.getBoundingClientRect().top;dragPanel.style.transition='none';e.preventDefault();});window.addEventListener('mousemove',e=>{if(!isDragging)return;dragPanel.style.left=`${e.clientX-offsetX}px`;dragPanel.style.top=`${e.clientY-offsetY}px`;dragPanel.style.bottom='auto';});window.addEventListener('mouseup',()=>{if(isDragging)isDragging=false;});})();const ensureLabel=(el,text)=>{if(!debugEnabled)return;let label=el._debugLabel;if(!label){label=document.createElement('div');label.className='debug-label';Object.assign(label.style,{position:'absolute',background:'rgba(255,0,0,0.85)',color:'#fff',fontSize:'11px',padding:'2px 5px',borderRadius:'3px',zIndex:99999,pointerEvents:'none',whiteSpace:'nowrap'});el._debugLabel=label;document.body.appendChild(label);}const rect=el.getBoundingClientRect();const scrollLeft=window.scrollX||document.documentElement.scrollLeft;const scrollTop=window.scrollY||document.documentElement.scrollTop;label.style.left=`${rect.left+scrollLeft-2}px`;label.style.top=`${rect.top+scrollTop-rect.height*0.8}px`;label.textContent=text;label.style.display='block';};const updateSum=()=>{if(!scriptEnabled)return;if(updateTimeout)clearTimeout(updateTimeout);updateTimeout=setTimeout(()=>{const inputs=getTopThreeInputs();const sum=inputs.reduce((a,el)=>a+getDisplayedNumber(el),0);const sumBox=document.getElementById('sumBox');if(sumBox)sumBox.value=sum.toFixed(1);document.querySelectorAll('.sum-highlight').forEach(el=>{el.classList.remove('sum-highlight');el.style.outline='';if(el._debugLabel)el._debugLabel.style.display='none';});inputs.forEach((el,idx)=>{el.classList.add('sum-highlight');el.style.outline='2px solid red';ensureLabel(el,`${idx+1}: ${getDisplayedNumber(el).toFixed(1)}`);});},debounceTime);};setInterval(updateSum,200);updateSum();document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='d'){debugEnabled=!debugEnabled;console.log('Debug:',debugEnabled);updateSum();}if(e.key.toLowerCase()==='s'){scriptEnabled=!scriptEnabled;console.log('Script Enabled:',scriptEnabled);if(panel)panel.style.display=scriptEnabled?'block':'none';updateSum();}});})();

```

## Hotkey Controls

| Key   | Function                             |
| ----- | ------------------------------------ |
| **D** | Toggle debug labels on/off           |
| **S** | Toggle script (Base Score UI) on/off |

---

## Script Behavior

| Feature           | Behavior                                               |
| ----------------- | ------------------------------------------------------ |
| Score Detection   | Picks the top 3 visible input fields on the left side  |
| Panel Dragging    | Drag from the yellow background (not from the sum box) |
| Debug Labels      | Display ranking & numeric value ribbon above inputs    |
| Real-time Updates | 5 updates per second (200ms interval)                  |

---

## Disable the scripts

Browser Refresh -->  Press F5

---

## Code

The code is fully self-contained, readable, and documented with inline comments.

*(See main repository file for complete source code.)*

---

## Enhancements Roadmap

🔹 Add local storage to remember panel position between sessions 🔹 Add color themes (light/contrast/large text) 🔹 Add drag handles on debug labels for repositioning 🔹 Convert to full Chrome extension (with manifest v3)

---

## License

MIT License — free to use, modify, share.

---

## Author

Created with assistance from ChatGPT (OpenAI), optimized for real competition scoring workflows.

---

### 💡 Need more features?

To request improvements (like auto-national deductions, penalty detection, or clipboard data export), just open an issue or ask on ChatGPT! 🎯



