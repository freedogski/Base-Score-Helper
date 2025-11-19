(() => {
  // --- Global toggle flags ---
  let debugEnabled = false;    // Controls visibility of red debug labels, OFF by defauflt
  let scriptEnabled = true;   // Controls whether summing and panel are active

  // --- Helper: Extract numeric value from input or display element ---
  const getDisplayedNumber = (el) => {
    if (!el) return 0;

    // If it's an input field, read its numeric value
    if (el.tagName === 'INPUT') return parseFloat(el.value) || 0;

    // Some scores may be inside SPAN or DIV elements
    const child = el.querySelector('span, div');
    if (child) {
      const num = parseFloat(child.innerText.replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) return num;
    }

    // Some pages use data-value attributes
    if (el.dataset?.value) return parseFloat(el.dataset.value) || 0;

    return 0;
  };

  // --- Detect top 3 user-entered inputs positioned visibly on left side ---
  const getTopThreeInputs = () => {
    return [...document.querySelectorAll('input')]
      .filter(inp =>
        !inp.readOnly &&
        !inp.disabled &&
        inp.getBoundingClientRect().left < 200 // Only left-side fields
      )
      .map(inp => ({ el: inp, top: inp.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top)          // Top-most inputs first
      .slice(0, 3)                            // Take only first 3
      .map(x => x.el);                        // Return elements only
  };

  // --- Create draggable Base Score panel (only once) ---
  let panel = document.getElementById('baseScorePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'baseScorePanel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '160px',
      left: '10px',
      width: '130px',
      padding: '6px',
      background: '#ffffcc',
      border: '1px solid #999',
      borderRadius: '6px',
      textAlign: 'center',
      zIndex: 9999,
      boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
      cursor: 'move',
    });
    document.body.appendChild(panel);

    // Title text inside panel
    const baseLabel = document.createElement('div');
    baseLabel.innerText = 'Base Score';
    Object.assign(baseLabel.style, {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '6px',
      fontFamily: 'Arial, sans-serif',
    });
    panel.appendChild(baseLabel);

    // The sum display input box
    const sumBox = document.createElement('input');
    sumBox.id = 'sumBox';
    sumBox.readOnly = true;
    Object.assign(sumBox.style, {
      padding: '8px 12px',
      fontSize: '20px',
      fontWeight: 'bold',
      width: '100%',
      textAlign: 'center',
      borderRadius: '4px',
      border: '1px solid #999',
    });
    panel.appendChild(sumBox);
  }

  // --- Make Base Score panel draggable ---
  (() => {
    let offsetX = 0, offsetY = 0, isDragging = false;

    panel.addEventListener('mousedown', (e) => {
      if (e.target.id === 'sumBox') return; // Prevent dragging by clicking in sum field
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
      panel.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  })();

  // --- Debug label: small red tags next to inputs ---
  const ensureLabel = (el, text) => {
    if (!debugEnabled) return; // Skip if debug mode is off

    let label = el._debugLabel;
    if (!label) {
      label = document.createElement('div');
      Object.assign(label.style, {
        position: 'absolute',
        background: 'rgba(255,0,0,0.85)',
        color: '#fff',
        fontSize: '11px',
        padding: '2px 5px',
        borderRadius: '3px',
        zIndex: 99999,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      });
      el._debugLabel = label;
      document.body.appendChild(label);
    }

    const rect = el.getBoundingClientRect();
    label.style.left = `${rect.left + window.scrollX - 2}px`;
    label.style.top = `${rect.top + window.scrollY - rect.height * 0.9}px`;
    label.textContent = text;
    label.style.display = 'block';
  };

  // --- Main function: calculates sum and updates display ---
  const updateSum = () => {
    if (!scriptEnabled) return;

    const inputs = getTopThreeInputs();
    const sum = inputs.reduce((a, el) => a + getDisplayedNumber(el), 0);

    // Update sum box
    const sumBox = document.getElementById('sumBox');
    if (sumBox) sumBox.value = sum.toFixed(1);

    // Clear previous outlines and labels
    document.querySelectorAll('.sum-highlight').forEach(el => {
      el.style.outline = '';
      if (el._debugLabel) el._debugLabel.style.display = 'none';
    });

    // Highlight and label the top 3 inputs
    inputs.forEach((el, idx) => {
      el.classList.add('sum-highlight');
      el.style.outline = '2px solid red';
      if (debugEnabled) {
        ensureLabel(el, `${idx + 1}: ${getDisplayedNumber(el).toFixed(1)}`);
      }
    });
  };

  // --- Update repeatedly for real-time scoring (light CPU load) ---
  setInterval(updateSum, 200);

  // --- Hotkey toggles: D = Debug labels, S = Entire script on/off ---
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
      debugEnabled = !debugEnabled;
      console.log('Debug labels:', debugEnabled);
      updateSum();
    }
    if (e.key.toLowerCase() === 's') {
      scriptEnabled = !scriptEnabled;
      console.log("Script Enabled:", scriptEnabled);
      if (panel) {
        panel.style.display = scriptEnabled ? "block" : "none";
      }
      updateSum();
    }
  });

  // --- Run immediately ---
  updateSum();
})();
