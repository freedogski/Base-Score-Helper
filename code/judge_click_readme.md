# Judge_Click_in_console.js

## Overview
This script enhances the Judge Click scoring interface by automatically detecting and summing the **top three left-side score inputs** in real time. It displays the live calculated **Base Score** in a draggable floating panel. It is optimized to be pasted into the **browser console**, supports toggle hotkeys, and does not require any extensions.

---

## Key Features
- 🎯 **Auto Sum of Top 3 Inputs** — Always detects the top three editable score fields.
- 📦 **Floating Base Score Panel** — Draggable, always on top, very light and readable.
- 🔴 **Debug Mode (D key)** — Shows live input ranks and values directly on screen.
- ⛔ **Script Toggle (S key)** — Hide/show the Base Score box and stop/start updates.
- ⚡ **Very lightweight** — Updates every 200ms, minimal impact on performance.
- 🧠 **No Tampermonkey needed** — Works via copy-paste into console.

---

## How to Use
### 🔹 Version 2.0 (Judge Click right-side score area)
1. Use the script file: **Judge_Click_in_console_v2.0.js**.
2. Open Judge Click and paste that file content into the browser console.
3. Press Enter.

What changed in v2.0:
- Detects the 3 score values from the **right-side** score area first.
- Keeps fallback behavior if right-side detection is unavailable.
- Opens the Base Score panel in the **lower-right corner** by default.

### 🔹 Option 1: Paste into Browser Console (Not Recommended - unless troubleshooting enhancements)
1. Open Google Chrome (or Edge, Firefox).
2. Go to the Judge Click scoring page.
3. Open **Developer Tools → Console** (`F12` or `Ctrl+Shift+I`).
4. Paste the entire script.
5. Hit **Enter** — it starts working immediately.

---

### 🔹 Option 2: Use as a Bookmarklet  (Recommended)
You can convert this script into a one-line compressed bookmarklet.

For the ready-made v2 bookmarklet one-liner, use this shorter minified file (recommended):
- [code/bookmarklet_v2.0.min.txt](code/bookmarklet_v2.0.min.txt)

Fallback (no-encoding variant):
- [code/bookmarklet_v2.0.min.raw.txt](code/bookmarklet_v2.0.min.raw.txt)

If the bookmarklet does not run:
1. Remove the old bookmark and create a new one.
2. Verify the bookmark URL begins with `javascript:`.
3. Try the raw fallback file above.

See steps here:  https://github.com/freedogski/Base-Score-Helper/blob/main/Base_Score_Helper_bookmarklet_Readme.md


---

## Hotkey Controls
| Key | Function |
|------|----------|
| **D** | Toggle debug labels on/off |
| **S** | Toggle script (Base Score UI) on/off |

---

## Script Behavior
| Feature | Behavior |
|---------|----------|
| Score Detection | Original script: left side. v2.0 script: right-side score area first (with fallback). |
| Panel Dragging | Drag from the yellow background (not from the sum box) |
| Debug Labels | Display ranking & numeric value ribbon above inputs |
| Real-time Updates | 5 updates per second (200ms interval) |

---

## File Naming Convention
📄 Recommended filename: `Paste_WORKING_Judge_Click_in_console.js`

---

## Code
The code is fully self-contained, readable, and documented with inline comments.

*(See main repository file for complete source code.)*

---

## Enhancements Roadmap
🔹 Add local storage to remember panel position between sessions
🔹 Add color themes (light/contrast/large text)
🔹 Add drag handles on debug labels for repositioning
🔹 Convert to full Chrome extension (with manifest v3)

---

## License
MIT License — free to use, modify, share.

---

## Author
Created with assistance from ChatGPT (OpenAI), optimized for real competition scoring workflows.

---

### 💡 Need more features?
To request improvements (like auto-national deductions, penalty detection, or clipboard data export), just open an issue or ask on ChatGPT! 🎯

