# ReadMe\_BaseScore\_Helper\_Bookmarklet

---
## Overview

This bookmarklet enhances the Judge Click scoring interface by automatically detecting and summing the **top three left-side score inputs** in real time. It displays the live calculated **Base Score** in a draggable floating panel. It is optimized to be to be run as a  **browser bookmarklet**, supports toggle hotkeys, and does not require any extensions.

---

| **Summary** | **Base Score Example:** |
|----------|----------|
| Enhaces the Judge Click interfaces by summing the three Turns Categories into a single  Base Score box    | ![Base Score UI](screenshots/BaseScore.png) |

---

## Key Features

- 🎯 **Auto Sum of Top 3 Inputs** — Always detects the top three editable score fields.
- 📦 **Floating Base Score Panel** — Draggable, always on top, very light and readable.
- 🔴 **Debug Mode (D key)** — Shows live input ranks and values directly on screen.
- ⛔ **Script Toggle (S key)** — Hide/show the Base Score box and stop/start updates.
- ⚡ **Very lightweight** — Updates every 200ms, minimal impact on performance.

---

## To Use

1. Open Judge Click Tool
2. Click your Bookmark (see instructions below on how to creaate)
---

Note: Bookmarklet tool will only activate with Judge Click
- Bookmarklets are deactivated for other Websites/URLs (will warn with "Tool only runs on judge.click")

---

## To Disable

Browser Refresh -->  Press F5


---

## Supported devices
   Supported in **Windows PC** (win11) and **macOS** (MacBook Pro and simliar)
   - Bookmarklets created in Chrome on Windows → syncs to Chrome on macOS → will work just fine
   
   **Mobile devices** - No guarantee that this will work on Android phones, tablets or iPad**, iPhones as the smaller screens may inhibit proper operation

** One quirk to note with iPad (after limited testing) - Windows Chrome bookmark synced to iPad Chrome will **not** work due to differences in iPadOS

To overcome this with **iPad**, always create bookmarklets in Safari first.
1. Even if you want them in Chrome on iPad
2. Create/Save the bookmarklet in Safari.
3. Edit the URL and paste your bookmarklet code.
4. Test it — it will work.
5. Copy that code into Chrome’s bookmark manually - to use in Chrome iPad.

---

## Bookmarklet Instructions

TInstruction to create a bookmarklet:

1. Copy the full one-line compressed bookmarklet code below.
2. Open your browser and create a new bookmark.
3. Name the bookmark (e.g., **Base Score Tool**).   or whatever you prefer
4. In the URL/location field of the bookmark, paste the code exactly as it appears. (code below)
5. While on the Judge Click scoring page, simply click the bookmark to activate the script.

### Bookmarklet Code

```
javascript:(()=>{if(!window.location.href.startsWith('https://judge.click/')){alert("This tool only runs on judge.click");return}let%20debugEnabled=false,scriptEnabled=true;const%20getDisplayedNumber=e=>{if(!e)return%200;if(e.tagName==="INPUT")return%20parseFloat(e.value)||0;const%20t=e.querySelector("span,%20div");if(t){const%20n=parseFloat(t.innerText.replace(/[^\d.-]/g,""));if(!isNaN(n))return%20n}return%20e.dataset?.value?parseFloat(e.dataset.value)||0:0};const%20getTopThreeInputs=()=>[...document.querySelectorAll("input")].filter(e=>!e.readOnly&&!e.disabled&&e.getBoundingClientRect().left<200).map(e=>({el:e,top:e.getBoundingClientRect().top})).sort((e,t)=>e.top-t.top).slice(0,3).map(e=>e.el);let%20panel=document.getElementById("baseScorePanel");if(!panel){panel=document.createElement("div");panel.id="baseScorePanel";Object.assign(panel.style,{position:"fixed",bottom:"160px",left:"10px",width:"130px",padding:"6px",background:"#ffffcc",border:"1px%20solid%20#999",borderRadius:"6px",textAlign:"center",zIndex:9999,boxShadow:"2px%202px%208px%20rgba(0,0,0,0.3)",cursor:"move"});document.body.appendChild(panel);const%20e=document.createElement("div");e.innerText="Base%20Score";Object.assign(e.style,{fontSize:"18px",fontWeight:"600",color:"#333",marginBottom:"6px",fontFamily:"Arial,%20sans-serif"}),panel.appendChild(e);const%20t=document.createElement("input");t.id="sumBox",t.readOnly=!0,Object.assign(t.style,{padding:"8px%2012px",fontSize:"20px",fontWeight:"bold",width:"100%",textAlign:"center",borderRadius:"4px",border:"1px%20solid%20#999"}),panel.appendChild(t)}(()=>{let%20e=0,t=0,n=!1;panel.addEventListener("mousedown",a=>{if(a.target.id==="sumBox")return;n=!0,e=a.clientX-panel.getBoundingClientRect().left,t=a.clientY-panel.getBoundingClientRect().top,a.preventDefault()}),window.addEventListener("mousemove",a=>{if(!n)return;panel.style.left=`${a.clientX-e}px`,panel.style.top=`${a.clientY-t}px`,panel.style.bottom="auto"}),window.addEventListener("mouseup",()=>{n=!1})})();const%20ensureLabel=(e,t)=>{if(!debugEnabled)return;let%20n=e._debugLabel;n||(n=document.createElement("div"),Object.assign(n.style,{position:"absolute",background:"rgba(255,0,0,0.85)",color:"#fff",fontSize:"11px",padding:"2px%205px",borderRadius:"3px",zIndex:99999,whiteSpace:"nowrap",pointerEvents:"none"}),e._debugLabel=n,document.body.appendChild(n));const%20a=e.getBoundingClientRect();n.style.left=`${a.left+window.scrollX-2}px`,n.style.top=`${a.top+window.scrollY-a.height*.9}px`,n.textContent=t,n.style.display="block"};const%20updateSum=()=>{if(!scriptEnabled)return;const%20e=getTopThreeInputs(),t=e.reduce((a,o)=>a+getDisplayedNumber(o),0),n=document.getElementById("sumBox");n&&(n.value=t.toFixed(1)),document.querySelectorAll(".sum-highlight").forEach(a=>{a.style.outline="",a._debugLabel&&(a._debugLabel.style.display="none")}),e.forEach((a,o)=>{a.classList.add("sum-highlight"),a.style.outline="2px%20solid%20red",debugEnabled&&ensureLabel(a,`${o+1}: ${getDisplayedNumber(a).toFixed(1)}`)})};setInterval(updateSum,200),document.addEventListener("keydown",e=>{e.key.toLowerCase()==="d"&&(debugEnabled=!debugEnabled,console.log("Debug labels:",debugEnabled),updateSum()),e.key.toLowerCase()==="s"&&(scriptEnabled=!scriptEnabled,console.log("Script active:",scriptEnabled),document.getElementById("baseScorePanel")&&(document.getElementById("baseScorePanel").style.display=scriptEnabled?"block":"none"),updateSum())}),updateSum()})();


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

Created by freedogski, optimized for real competition scoring workflows.

---

