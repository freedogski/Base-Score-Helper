(() => {
  // Only run on judge.click
  if (!window.location.href.startsWith('https://judge.click/')) {
    alert("This tool only runs on judge.click");
    return;
  }

  let debugEnabled = false;   // Toggle debug labels
  let scriptEnabled = true;   // Toggle summing and panel visibility

  // --- Helper: read number from input/div/span ---
  const getDisplayedNumber = (el) => {
    if (!el) return 0;
    if (el.tagName === 'INPUT') return parseFloat(el.value) || 0;
    const child = el.querySelector('span, div');
    if (child) {
      const num = parseFloat(child.innerText.replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) return num;
    }
    if (el.dataset?.value) return parseFloat(el.dataset.value) || 0;
    return 0;
  };

  // --- Get top three leftmost inputs ---
  const getTopThreeInputs = () => {
    return [...document.querySelectorAll('input')]
      .filter(inp => !inp.readOnly && !inp.disabled && inp.getBoundingClientRect().left < 200)
      .map(inp => ({ el: inp, top: inp.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top)
      .slice(0, 3)
      .map(x => x.el);
  };

  // --- Create Base Score panel ---
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

  // --- Make panel draggable (mouse + touch) ---
  (() => {
    let offsetX = 0, offsetY = 0, isDragging = false;

    const startDrag = (clientX, clientY) => {
      isDragging = true;
      offsetX = clientX - panel.getBoundingClientRect().left;
      offsetY = clientY - panel.getBoundingClientRect().top;
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDragging) return;
      panel.style.left = `${clientX - offsetX}px`;
      panel.style.top = `${clientY - offsetY}px`;
      panel.style.bottom = 'auto';
    };

    // Mouse events
    panel.addEventListener('mousedown', (e) => {
      if (e.target.id === 'sumBox') return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events for iPad / touchscreen
    panel.addEventListener('touchstart', (e) => {
      if (e.target.id === 'sumBox') return;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }, { passive: false });
    window.addEventListener('touchend', () => { isDragging = false; });

  })();

  // --- Show debug label above element ---
  const ensureLabel = (el, text) => {
    if (!debugEnabled) return;
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

  // --- Main sum update ---
  const updateSum = () => {
    if (!scriptEnabled) return;

    const inputs = getTopThreeInputs();
    const sum = inputs.reduce((a, el) => a + getDisplayedNumber(el), 0);

    const sumBox = document.getElementById('sumBox');
    if (sumBox) sumBox.value = sum.toFixed(1);

    document.querySelectorAll('.sum-highlight').forEach(el => {
      el.style.outline = '';
      if (el._debugLabel) el._debugLabel.style.display = 'none';
    });

    inputs.forEach((el, idx) => {
      el.classList.add('sum-highlight');
      el.style.outline = '2px solid red';
      if (debugEnabled) {
        ensureLabel(el, `${idx + 1}: ${getDisplayedNumber(el).toFixed(1)}`);
      }
    });
  };

  // --- Interval for live summing ---
  setInterval(updateSum, 200);

  // --- Hotkeys ---
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
      debugEnabled = !debugEnabled;
      console.log('Debug labels:', debugEnabled);
      updateSum();
    }
    if (e.key.toLowerCase() === 's') {
      scriptEnabled = !scriptEnabled;
      console.log('Script active:', scriptEnabled);
      const panel = document.getElementById('baseScorePanel');
      if (panel) panel.style.display = scriptEnabled ? 'block' : 'none';
      updateSum();
    }
  });

  // Initial update
  updateSum();
})();
