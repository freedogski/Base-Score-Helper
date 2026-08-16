(() => {
  // Only run on judge.click
  if (!window.location.href.startsWith('https://judge.click/')) {
    alert('This tool only runs on judge.click');
    return;
  }

  let debugEnabled = false;   // Toggle debug labels
  let scriptEnabled = true;   // Toggle summing and panel visibility

  const isVisibleInput = (el) => {
    if (!el || el.tagName !== 'INPUT') return false;
    if (el.readOnly || el.disabled) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

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

  const pickColumnTopThree = (inputs) => {
    if (inputs.length < 3) return [];

    const mapped = inputs.map((inp) => {
      const rect = inp.getBoundingClientRect();
      return { el: inp, left: rect.left, top: rect.top };
    });

    // Group inputs by x-position so we can pick the likely score column.
    const bins = new Map();
    for (const item of mapped) {
      const key = Math.round(item.left / 30);
      if (!bins.has(key)) bins.set(key, []);
      bins.get(key).push(item);
    }

    let best = [];
    for (const group of bins.values()) {
      if (
        group.length > best.length ||
        (group.length === best.length && group.length > 0 && group[0].left > (best[0]?.left ?? -Infinity))
      ) {
        best = group;
      }
    }

    if (best.length >= 3) {
      return best.sort((a, b) => a.top - b.top).slice(0, 3).map((x) => x.el);
    }

    return [];
  };

  // --- v2.0 target: top three score inputs from right-side score area ---
  const getTopThreeInputs = () => {
    const allInputs = [...document.querySelectorAll('input')].filter(isVisibleInput);

    const rightSideInputs = allInputs.filter((inp) => {
      const rect = inp.getBoundingClientRect();
      return rect.left > window.innerWidth * 0.5;
    });

    const rightColumn = pickColumnTopThree(rightSideInputs);
    if (rightColumn.length === 3) return rightColumn;

    // Fallback: preserve original behavior if right area is not detected.
    const legacyLeftInputs = allInputs.filter((inp) => inp.getBoundingClientRect().left < 200);
    const legacyColumn = pickColumnTopThree(legacyLeftInputs);
    if (legacyColumn.length === 3) return legacyColumn;

    // Final fallback: pick first top three visible inputs.
    return allInputs
      .map((inp) => ({ el: inp, top: inp.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top)
      .slice(0, 3)
      .map((x) => x.el);
  };

  // --- Create Base Score panel ---
  let panel = document.getElementById('baseScorePanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'baseScorePanel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '30px',
      right: '10px',
      width: '140px',
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
    baseLabel.innerText = 'Base Score v2';
    Object.assign(baseLabel.style, {
      fontSize: '17px',
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
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    const startDrag = (clientX, clientY) => {
      isDragging = true;
      offsetX = clientX - panel.getBoundingClientRect().left;
      offsetY = clientY - panel.getBoundingClientRect().top;
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDragging) return;
      panel.style.left = `${clientX - offsetX}px`;
      panel.style.top = `${clientY - offsetY}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    };

    panel.addEventListener('mousedown', (e) => {
      if (e.target.id === 'sumBox') return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

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

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
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

    document.querySelectorAll('.sum-highlight').forEach((el) => {
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
      const panelEl = document.getElementById('baseScorePanel');
      if (panelEl) panelEl.style.display = scriptEnabled ? 'block' : 'none';
      updateSum();
    }
  });

  // Initial update
  updateSum();
})();
