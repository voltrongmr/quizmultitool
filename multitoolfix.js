javascript:(()=>{
  // Tool IDs and state management
  const TOOL_IDS = {
    PANEL: '__combined_quiz_tool__',
    STYLE: '__combined_quiz_tool_style__',
    CORRECT_ANSWER: '__correct_answer_card__'
  };

  // Clean up any existing instances
  window.__combinedToolStop__?.();
  document.getElementById(TOOL_IDS.PANEL)?.remove();
  document.getElementById(TOOL_IDS.STYLE)?.remove();

  // Styles for the combined tool
  const css = `
    :root { --bg:#0b1220; --panel:#0f1724; --muted:#94a3b8; --accent:#06b6d4; --danger:#ef4444; --glass: rgba(255,255,255,0.04); }
    #${TOOL_IDS.PANEL} * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #e6eef8; }
    #${TOOL_IDS.PANEL} {
      position: fixed;
      z-index: 999999;
      right: 12px;
      bottom: 12px;
  width: 420px;
      background: linear-gradient(180deg,var(--panel), #071018);
      color: #e6f0fa;
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(2,6,23,0.7);
    }
    #${TOOL_IDS.PANEL} .hdr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    #${TOOL_IDS.PANEL} .hdr h3 {
      margin: 0;
      font-size: 15px;
      color: #fff;
    }
    #${TOOL_IDS.PANEL} .body {
      padding: 12px;
    }
    #${TOOL_IDS.PANEL} .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    #${TOOL_IDS.PANEL} .tab {
      flex: 1;
      padding: 8px;
      background: var(--glass);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      font-size: 13px;
    }
    #${TOOL_IDS.PANEL} .tab.active {
      background: var(--accent);
      color: #031025;
      border-color: transparent;
    }
    #${TOOL_IDS.PANEL} label {
      display: block;
      font-size: 12px;
      color: var(--muted);
      margin-top: 8px;
      margin-bottom: 6px;
    }
    #${TOOL_IDS.PANEL} input[type="text"],
    #${TOOL_IDS.PANEL} input[type="number"],
    #${TOOL_IDS.PANEL} input[type="datetime-local"] {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.04);
      background: var(--glass);
      color: #e6eef8;
      font-size: 13px;
      outline: none;
    }
    #${TOOL_IDS.PANEL} .row {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }
    #${TOOL_IDS.PANEL} .col {
      flex: 1;
    }
    #${TOOL_IDS.PANEL} .controls {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    #${TOOL_IDS.PANEL} button {
      padding: 8px 10px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    }
    #${TOOL_IDS.PANEL} .btn-accent {
      background: linear-gradient(180deg,var(--accent), #0284c7);
      color: #031025;
    }
    #${TOOL_IDS.PANEL} .btn-ghost {
      background: transparent;
      color: var(--muted);
      border: 1px solid rgba(255,255,255,0.03);
    }
    #${TOOL_IDS.PANEL} .btn-danger {
      background: linear-gradient(180deg,var(--danger), #c02616);
      color: #fff;
    }
    #${TOOL_IDS.PANEL} .status {
      font-size: 12px;
      color: var(--muted);
      margin-top: 8px;
    }
    #${TOOL_IDS.PANEL} table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    #${TOOL_IDS.PANEL} th {
      text-align: left;
      padding: 6px 8px;
      color: var(--muted);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-weight: normal;
    }
    #${TOOL_IDS.PANEL} td {
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    #${TOOL_IDS.PANEL} .muted-small {
      display: block;
      font-size: 11px;
      color: var(--muted);
      margin-top: 2px;
    }
    #${TOOL_IDS.PANEL} .has-tooltip {
      position: relative;
      cursor: help;
    }
    #${TOOL_IDS.PANEL} .has-tooltip[title]:hover::after {
      content: attr(title);
      position: absolute;
      left: 0;
      bottom: 100%;
      white-space: nowrap;
      background: rgba(2,6,23,0.95);
      color: #e6eef8;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      transform: translateY(-8px);
      z-index: 1000000;
      box-shadow: 0 6px 20px rgba(0,0,0,0.6);
    }
    .${TOOL_IDS.CORRECT_ANSWER} {
      background-color: #E6F8EE !important;
      border-color: #198754 !important;
      border-width: 3px !important;
      color: #198754 !important;
    }
    .${TOOL_IDS.CORRECT_ANSWER} .answer-body,
    .${TOOL_IDS.CORRECT_ANSWER} .answer-body * {
      color: #198754 !important;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: var(--panel);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    }
    .modal-header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #fff;
    }
    .modal-body {
      margin-bottom: 20px;
    }
    .modal-entries {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 8px;
      background: var(--glass);
    }
    .modal-entry {
      padding: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 13px;
    }
    .modal-entry:last-child {
      border-bottom: none;
    }
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .modal-btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }
    .modal-btn-cancel {
      background: transparent;
      color: var(--muted);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .modal-btn-delete {
      background: linear-gradient(180deg,var(--danger), #c02616);
      color: #fff;
    }
  `;

  // Add styles to document
  const style = document.createElement('style');
  style.id = TOOL_IDS.STYLE;
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Create UI Panel
  const panel = document.createElement('div');
  panel.id = TOOL_IDS.PANEL;
  panel.innerHTML = `
    <div class='hdr'>
      <h3>Quiz Tool</h3>
      <button class='btn-ghost' data-close>✕</button>
    </div>
    <div class='body'>
      <div class='tabs'>
        <div class='tab active' data-tab="autoplayer">Auto Player</div>
        <div class='tab' data-tab="score">Score Injector</div>
        <div class='tab' data-tab="lookup">Score Lookup</div>
      </div>

      <div data-content="autoplayer">
        <div>
          <label>Delay before actions (seconds)</label>
          <input type='number' min='0' step='0.5' value='1.5' data-delay />
        </div>
        <div class='controls'>
          <button class='btn-accent' data-run>Run</button>
          <button class='btn-ghost' data-stop>Stop</button>
        </div>
      </div>

      <div data-content="score" style="display:none">
        <label>Display Name</label>
        <input data-name type="text" value="DemoUser" placeholder="Name or initials" />

        <div class="row">
          <div class="col">
            <label>Correct</label>
            <input data-correct type="number" min="0" value="30" />
          </div>
          <div class="col">
            <label>Total</label>
            <input data-total type="number" min="1" value="30" />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label>Duration (s)</label>
            <input data-duration type="number" min="0" value="3600" />
          </div>
          <div style="width:110px">
            <label>Units</label>
            <input data-units type="number" min="0" value="5" />
          </div>
        </div>

        <label>Timestamp (optional)</label>
        <input data-datetime type="datetime-local" />

        <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
          <input data-force type="checkbox" />
          <label style="margin:0">Force Eligible</label>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <input data-delete-before type="checkbox" />
          <label style="margin:0">Delete existing with same name</label>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <input data-bloat type="checkbox" />
          <label style="margin:0">Injection Bloat</label>
          <div data-bloat-controls style="display:none;align-items:center;gap:8px">
            <input data-bloat-count type="number" min="1" value="10" style="width:80px" />
            <label style="margin:0">entries</label>
          </div>
        </div>

        <div class="controls">
          <button class='btn-accent' data-score-submit>Submit</button>
          <button class='btn-danger' data-score-delete>Delete By Name</button>
          <button class='btn-ghost' data-score-top>Top 10</button>
        </div>
      </div>

      <div data-content="lookup" style="display:none">
        <label>Search by name</label>
        <input data-search-name type="text" placeholder="Start typing to search..." />
        <div class="search-results" data-search-results style="margin-top:12px;font-size:13px;max-height:400px;overflow-y:auto;padding:8px;border:1px solid rgba(255,255,255,0.04);border-radius:8px;background:var(--glass)">
          <div style="color:var(--muted)">Start typing to search scores...</div>
        </div>
      </div>

      <div class='status' data-status>Ready</div>
    </div>
  `;

  document.body.appendChild(panel);

  // Helper Functions
  const $ = sel => panel.querySelector(sel);
  const setStatus = s => $('[data-status]').textContent = s;
  function normalizeText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  // Quiz Functions
  function getCurrentQuestionText() {
    // Look for the text in various potential React-rendered selectors
    const selectors = [
      'main .fs-4.fw-bold.text-dark',
      '.fs-4.fw-bold.text-dark',
      '.text-dark.fw-bold',
      'div[class*="text-dark"][class*="fw-bold"]'
    ];
    let el = null;
    for (const selector of selectors) {
      el = document.querySelector(selector);
      if (el) break;
    }
    return el ? normalizeText(el.textContent) : null;
  }

  function getAnswerCards() {
    return Array.from(document.querySelectorAll('.answer-card'));
  }

  function getSubmitButton() {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => /submit answer|time's up!/i.test(b.textContent));
  }

  function getNextButton() {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => /next question|view results/i.test(b.textContent));
  }

  function highlightCorrectCard(t) {
    const cards = getAnswerCards();
    let m = null;
    for (const c of cards) {
      const p = c.querySelector('.answer-body p');
      const a = p ? normalizeText(p.textContent) : '';
      if (a && a === normalizeText(t)) {
        c.classList.add(TOOL_IDS.CORRECT_ANSWER);
        m = c;
      } else {
        c.classList.remove(TOOL_IDS.CORRECT_ANSWER);
      }
    }
    return m;
  }

  function parseData(raw) {
    if (!raw) return [];
    // Split by newline, handling both \n and potential \r\n
    const lines = raw.split(/\r?\n/);
    return lines
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length < 5) return null;
        const [question, correct, ...incorrect] = parts;
        if (!question || !correct) return null;
        return {
          question: question.trim(),
          correct: correct.trim(),
          allAnswers: [correct, ...incorrect.slice(0, 3)].map(a => a.trim())
        };
      })
      .filter(Boolean);
  }

  async function buildQuestionToAnswerMap() {
    const map = new Map();
    const UNIT_IDS = ['unit1', 'unit2', 'unit3', 'unit4', 'unit5'];
    
    console.group('Loading quiz data');
    for (const unitId of UNIT_IDS) {
      try {
        console.log(`Loading ${unitId}...`);
        const snapshot = await db.collection('quiz_units').doc(unitId).get();
        
        if (!snapshot.exists) {
          console.warn(`${unitId} not found`);
          continue;
        }
        
        const data = snapshot.data();
        const raw = data?.content;
        
        if (!raw) {
          console.warn(`${unitId} has no content`);
          continue;
        }
        
        const questions = parseData(raw);
        console.log(`${unitId}: Found ${questions.length} questions`);
        
        for (const q of questions) {
          const normalized = normalizeText(q.question);
          map.set(normalized, q.correct);
        }
      } catch (e) {
        console.error(`Error in ${unitId}:`, e);
      }
    }
    
    console.log('Map size:', map.size);
    if (map.size === 0) {
      console.warn('Warning: No questions loaded!');
    }
    console.groupEnd();
    
    return map;
  }

  // Quiz Auto-player State
  const delayInput = $('[data-delay]');
  const btnRun = $('[data-run]');
  const btnStop = $('[data-stop]');
  
  let obs = null;
  let poll = null;
  let running = false;
  let questionToAnswer = null;
  let busy = false;
  
  async function ensureMap() {
    if (questionToAnswer) return;
    setStatus('Loading questions map from Firestore...');
    questionToAnswer = await buildQuestionToAnswerMap();
    setStatus(`Ready. Loaded ${questionToAnswer.size} Qs.`);
  }
  
  async function actOnce() {
    if (!running || busy) return;
    busy = true;
    try {
      const qText = getCurrentQuestionText();
      if (!qText) { busy = false; return; }
      
      const normalized = normalizeText(qText);
      console.log('Current question:', normalized);
      
      // Try exact match first
      let correct = questionToAnswer.get(normalized);
      
      if (!correct) {
        // Log this for debugging
        console.log('No exact match found. Available questions:', Array.from(questionToAnswer.keys()));
        setStatus('No match for current question.');
        busy = false;
        return;
      }
      
      const correctCard = highlightCorrectCard(correct);
      const submitBtn = getSubmitButton();
      if (submitBtn) {
        if (!correctCard) { setStatus('Could not find the correct card in DOM.'); busy = false; return; }
        const d = Math.max(0, Number(delayInput.value) || 0) * 1000;
        setStatus(`Selecting answer in ${d/1000}s...`);
        setTimeout(() => {
          correctCard.click();
          setTimeout(() => {
            const s = getSubmitButton();
            if (s && !s.disabled) {
              s.click();
              setStatus('Submitted. Advancing...');
              setTimeout(() => {
                const n = getNextButton();
                if (n) n.click();
                setStatus('Waiting for next question...');
                busy = false;
              }, d);
            } else {
              setStatus('Submit not ready yet.');
              busy = false;
            }
          }, 150);
        }, d);
        return;
      }
      const nextBtn = getNextButton();
      if (nextBtn) {
        const d = Math.max(0, Number(delayInput.value) || 0) * 1000;
        setStatus(`Next in ${d/1000}s...`);
        setTimeout(() => {
          const n = getNextButton();
          if (n) n.click();
          setStatus('Advancing...');
          busy = false;
        }, d);
        return;
      }
      busy = false;
    } catch (e) {
      setStatus(`Error: ${e.message}`);
      busy = false;
    }
  }
  
  async function start() {
    if (running) return;
    running = true;
    btnRun.disabled = true;
    await ensureMap();
    const root = document.getElementById('root') || document.body;
    obs = new MutationObserver(() => {
      const q = getCurrentQuestionText();
      const c = q ? questionToAnswer.get(normalizeText(q)) : null;
      if (c) highlightCorrectCard(c);
    });
    obs.observe(root, { childList: true, subtree: true });
    poll = setInterval(actOnce, 400);
    setStatus('Running...');
  }
  
  function stop() {
    running = false;
    btnRun.disabled = false;
    if (obs) { obs.disconnect(); obs = null; }
    if (poll) { clearInterval(poll); poll = null; }
    setStatus('Stopped.');
  }

  // Score lookup cache and debouncing
  let cachedScores = null;
  let lastFetch = 0;
  let searchTimer = null;

  async function ensureScoreCache() {
    if (cachedScores && (Date.now() - lastFetch) < 5 * 60 * 1000) return; // Cache for 5 minutes
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      cachedScores = [];
      return;
    }
    const snapshot = await db.collection('quiz_scores')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();
    cachedScores = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    lastFetch = Date.now();
  }

  // Score Lookup Function
  async function doSearch() {
    try {
      const searchText = $('[data-search-name]').value.trim().toLowerCase();
      const resultsDiv = $('[data-search-results]');
      const lookupActive = panel.querySelector('.tab.active')?.dataset?.tab === 'lookup';

      if (!searchText) {
        resultsDiv.innerHTML = '<div style="color:var(--muted)">Start typing to search scores...</div>';
        return;
      }

      await ensureScoreCache();
      
      const matches = cachedScores.filter(doc => 
        (doc.userName || '').toLowerCase().includes(searchText)
      );

      if (matches.length === 0) {
        resultsDiv.innerHTML = '<div style="color:var(--muted)">No matching scores found</div>';
        if (lookupActive) setStatus('No results found');
        return;
      }

      // Sort matches by accuracy (desc), total (desc), duration (asc)
      matches.sort((a, b) => {
        const aAcc = a.accuracy || 0;
        const bAcc = b.accuracy || 0;
        if (aAcc !== bAcc) return bAcc - aAcc;
        const aTotal = a.total || 0;
        const bTotal = b.total || 0;
        if (aTotal !== bTotal) return bTotal - aTotal;
        return (a.duration || 0) - (b.duration || 0);
      });

      let html = '';
      if (matches.length > 1) {
        html += '<div style="margin-bottom:8px;padding:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:6px">';
        const scoreIds = matches.map(m => m.id);
        html += `<button class="btn-danger" onclick="window.__deleteAllScores('${scoreIds.join(',')}')" style="padding:6px 12px;font-size:12px">Delete All ${matches.length} Entries</button>`;
        html += '</div>';
      }
      html += '<table>';
      html += '<tr><th>Name</th><th>Score</th><th>Time</th><th>Units</th><th></th></tr>';

      matches.forEach(doc => {
        const score = `${doc.correct || 0}/${doc.total || 0}`;
        const accuracy = doc.accuracy ? ` (${doc.accuracy.toFixed(1)}%)` : '';
        const rawSeconds = Math.max(0, parseInt(doc.duration) || 0);
        let minutesStr;
        if (rawSeconds >= 60) {
          const mins = Math.floor(rawSeconds / 60);
          const secs = rawSeconds % 60;
          minutesStr = secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
        } else {
          minutesStr = `${rawSeconds}s`;
        }
        const units = doc.unitsUsedCount || '-';
        // Prepare tooltip (timestamp) if available
        let title = '';
        try {
          const ts = doc.timestamp;
          if (ts) {
            // Firestore timestamp object
            const date = ts.toDate ? ts.toDate() : new Date(ts);
            title = date.toLocaleString();
          }
        } catch (e) {
          title = '';
        }

        html += '<tr>';
        html += `<td class="has-tooltip" ${title ? `title="${title}"` : ''}>${doc.userName || ''}</td>`;
        html += `<td>${score}${accuracy}</td>`;
        // Only show muted raw seconds if it's different from the primary minutesStr
        const showMuted = minutesStr !== `${rawSeconds}s`;
        html += `<td>${minutesStr}${showMuted ? `<span class="muted-small">${rawSeconds}s</span>` : ''}</td>`;
        html += `<td>${units}</td>`;
        html += `<td><button class="btn-danger" style="padding:4px 8px" onclick="window.__deleteScore('${doc.id}')">Delete</button></td>`;
        html += '</tr>';
      });

      html += '</table>';
  resultsDiv.innerHTML = html;
  if (lookupActive) setStatus(`Found ${matches.length} matching scores`);

    } catch (e) {
      if (panel.querySelector('.tab.active')?.dataset?.tab === 'lookup') setStatus(`Error: ${e.message}`);
      resultsDiv.innerHTML = '<div style="color:var(--danger)">Error searching scores</div>';
    }
  }

  // Global handler for deleting scores from the search results
  window.__deleteScore = async (id) => {
    if (!confirm('Delete this score?')) return;
    try {
      await db.collection('quiz_scores').doc(id).delete();
      cachedScores = cachedScores.filter(d => d.id !== id);
      doSearch(); // Refresh the results
      setStatus('Score deleted successfully');
    } catch (e) {
      setStatus(`Error deleting score: ${e.message}`);
    }
  };

  // Modal functions
  function createModal(title, content, actions) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">${title}</div>
        <div class="modal-body">${content}</div>
        <div class="modal-actions">${actions}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeModal(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  // Global handler for bulk deleting scores with modal confirmation
  window.__deleteAllScores = async (scoreIdsString) => {
    // Convert comma-separated string to array
    const scoreIds = scoreIdsString.split(',');
    // Get the score data for display
    const scoresToDelete = cachedScores.filter(score => scoreIds.includes(score.id));
    
    // Create entries list HTML
    const entriesHtml = scoresToDelete.map(score => {
      const scoreText = (score.correct || 0) + '/' + (score.total || 0);
      const accuracy = score.accuracy ? ' (' + score.accuracy.toFixed(1) + '%)' : '';
      const rawSeconds = Math.max(0, parseInt(score.duration) || 0);
      let timeStr;
      if (rawSeconds >= 60) {
        const mins = Math.floor(rawSeconds / 60);
        const secs = rawSeconds % 60;
        timeStr = secs > 0 ? mins + 'm ' + secs + 's' : mins + 'm';
      } else {
        timeStr = rawSeconds + 's';
      }
      return '<div class="modal-entry" style="color: #ef4444;"><strong>' + (score.userName || 'Unknown') + '</strong> - ' + scoreText + accuracy + ' - ' + timeStr + '</div>';
    }).join('');

    const modalContent = `
      <p style="margin-bottom: 12px; color: var(--muted)">Are you sure you want to delete these entries?</p>
      <div class="modal-entries">
        ${entriesHtml}
      </div>
    `;

    const actions = `
      <button class="modal-btn modal-btn-cancel" data-cancel>Cancel</button>
      <button class="modal-btn modal-btn-delete" data-delete>Delete</button>
    `;

    const modal = createModal('Delete All Entries', modalContent, actions);
    
    // Add event listeners
    modal.querySelector('[data-cancel]').addEventListener('click', () => {
      closeModal(modal);
    });

    modal.querySelector('[data-delete]').addEventListener('click', async () => {
      closeModal(modal);
      
      // Show second confirmation modal
      const secondModalContent = '<p style="color: var(--danger); font-weight: 600;">You are about to delete ' + scoreIds.length + ' entries. Continue?</p>';
      
      const secondActions = '<button class="modal-btn modal-btn-cancel" data-cancel>Cancel</button><button class="modal-btn modal-btn-delete" data-confirm-delete>Continue</button>';
      
      const secondModal = createModal('Final Confirmation', secondModalContent, secondActions);
      
      secondModal.querySelector('[data-cancel]').addEventListener('click', () => {
        closeModal(secondModal);
      });

      secondModal.querySelector('[data-confirm-delete]').addEventListener('click', async () => {
        closeModal(secondModal);
        
        try {
          setStatus(`Deleting ${scoreIds.length} entries one by one...`);
          
          let deletedCount = 0;
          let errorCount = 0;
          
          // Delete one at a time with a small delay to avoid rate limiting
          for (let i = 0; i < scoreIds.length; i++) {
            try {
              await db.collection('quiz_scores').doc(scoreIds[i]).delete();
              deletedCount++;
              
              // Update cache immediately
              cachedScores = cachedScores.filter(d => d.id !== scoreIds[i]);
              
              // Update status every 10 deletions or on the last item
              if (deletedCount % 10 === 0 || i === scoreIds.length - 1) {
                setStatus(`Deleted ${deletedCount}/${scoreIds.length} entries...`);
              }
              
              // Small delay to avoid overwhelming Firestore
              if (i < scoreIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            } catch (error) {
              console.error(`Error deleting score ${scoreIds[i]}:`, error);
              errorCount++;
            }
          }
          
          // Refresh search results
          doSearch();
          
          if (errorCount > 0) {
            setStatus(`Deleted ${deletedCount} entries, ${errorCount} errors occurred`);
          } else {
            setStatus(`Successfully deleted ${deletedCount} entries`);
          }
        } catch (e) {
          console.error('Error in delete process:', e);
          setStatus(`Error deleting scores: ${e.message}`);
        }
      });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  };

  // Score Injection Functions
  async function submitScore() {
    // Get and validate values
    const correct = parseInt($('[data-correct]').value) || 0;
    const total = parseInt($('[data-total]').value) || 0;
    const duration = parseInt($('[data-duration]').value) || 0;
    const units = parseInt($('[data-units]').value) || 0;
    const isBloatEnabled = $('[data-bloat]').checked;
    const bloatCount = Math.max(1, parseInt($('[data-bloat-count]').value) || 1);

    // Validation
    if (!$('[data-name]').value.trim()) {
      setStatus('Error: Name is required');
      return;
    }
    if (total < correct) {
      setStatus('Error: Total cannot be less than correct answers');
      return;
    }
    if (correct < 0 || total <= 0 || duration < 0 || units < 0) {
      setStatus('Error: Invalid number values');
      return;
    }

    const data = {
      userName: $('[data-name]').value.trim(),
      correct: correct,
      total: total,
      duration: duration,
      unitsUsedCount: units,
      timestamp: $('[data-datetime]').value 
        ? firebase.firestore.Timestamp.fromDate(new Date($('[data-datetime]').value))
        : firebase.firestore.Timestamp.now(),
      isGlobalEligible: $('[data-force]').checked || (units === 5 && total >= 25),
      accuracy: total > 0 ? (correct / total * 100) : 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      setStatus('Submitting score...');
      
      if ($('[data-delete-before]').checked) {
        // Delete existing scores first
        setStatus(`Checking for existing scores for "${data.userName}"...`);
        const snapshot = await db.collection('quiz_scores')
          .where('userName', '==', data.userName)
          .get();
        
        if (snapshot.empty) {
          setStatus('No past entries found. Submitting new score...');
        } else {
          setStatus(`Found ${snapshot.size} previous entries for "${data.userName}". Deleting...`);
          const batch = db.batch();
          snapshot.docs.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
          setStatus(`Deleted ${snapshot.size} previous entries. Submitting new score...`);
          console.log(`Deleted ${snapshot.size} existing scores for ${data.userName}`);
        }
      }
      
      // Add new scores (handle bloat injection)
      if (isBloatEnabled) {
        const batch = db.batch();
        const batchSize = Math.min(500, bloatCount); // Firestore batch limit is 500
        
        setStatus(`Injecting ${batchSize} scores...`);
        
        for (let i = 0; i < batchSize; i++) {
          const docRef = db.collection('quiz_scores').doc();
          const bloatData = {
            ...data,
            timestamp: firebase.firestore.Timestamp.fromDate(
              new Date(data.timestamp.toDate().getTime() + (i * 1000))
            )
          };
          batch.set(docRef, bloatData);
        }
        
        await batch.commit();
        console.log(`${batchSize} scores added via bloat injection`);
      } else {
        // Add single score
        const docRef = await db.collection('quiz_scores').add(data);
        console.log('Score added with ID:', docRef.id);
      }
      
      // Clear the cache so the new scores show up in searches
      cachedScores = null;
      
      // Reset form fields
      if (!$('[data-delete-before]').checked) {
        $('[data-name]').value = '';
      }
      $('[data-correct]').value = '0';
      $('[data-total]').value = '0';
      $('[data-duration]').value = '0';
      $('[data-units]').value = '0';
      $('[data-datetime]').value = '';
      $('[data-force]').checked = false;
      
      setStatus('Score submitted successfully!');
    } catch (e) {
      console.error('Error submitting score:', e);
      setStatus(`Error: ${e.message}`);
    }
  }

  async function deleteScoresByName(name = null) {
    try {
      const userName = name || $('[data-name]').value;
      if (!userName.trim()) {
        setStatus('Error: Name is required for deletion');
        return;
      }

      setStatus('Deleting scores...');
      
      const snapshot = await db.collection('quiz_scores')
        .where('userName', '==', userName.trim())
        .get();

      if (snapshot.empty) {
        setStatus(`No scores found for "${userName}"`);
        return;
      }
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      
      // Clear the cache after deleting scores
      cachedScores = null;
      
      console.log(`Deleted ${snapshot.size} scores for "${userName}"`);
      setStatus(`Deleted ${snapshot.size} scores for "${userName}"`);
      
      // Clear form only if it was a direct delete (not part of submit)
      if (!name) {
        $('[data-name]').value = '';
        $('[data-correct]').value = '0';
        $('[data-total]').value = '0';
        $('[data-duration]').value = '0';
        $('[data-units]').value = '0';
        $('[data-datetime]').value = '';
        $('[data-force]').checked = false;
        $('[data-delete-before]').checked = false;
      }
    } catch (e) {
      console.error('Error deleting scores:', e);
      setStatus(`Error: ${e.message}`);
    }
  }

  async function showTopScores() {
    try {
      setStatus('Fetching top scores...');
      
      // Using exact same query as script2.js
      const snapshot = await db.collection('quiz_scores')
        .where('isGlobalEligible', '==', true)
        .orderBy('accuracy', 'desc')
        .orderBy('total', 'desc')
        .orderBy('duration', 'desc')
        .limit(10)
        .get();

      if (snapshot.empty) {
        console.log('No eligible scores found');
        setStatus('No eligible scores found');
        return;
      }
      
      // Map docs directly to console.table format, matching script2.js exactly
      const scores = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      console.group('Top 10 Global Scores');
      console.table(scores);
      console.groupEnd();
      
      setStatus(`Top ${scores.length} scores printed to console (F12)`);
    } catch (e) {
      console.error('Error fetching top scores:', e);
      setStatus(`Error: ${e.message}`);
    }
  }

  // Event Listeners
  $('[data-run]').addEventListener('click', start);
  $('[data-stop]').addEventListener('click', stop);
  $('[data-score-submit]').addEventListener('click', submitScore);
  $('[data-score-delete]').addEventListener('click', () => deleteScoresByName());
  $('[data-score-top]').addEventListener('click', showTopScores);
  
  // Toggle bloat controls visibility
  $('[data-bloat]').addEventListener('change', (e) => {
    const controls = $('[data-bloat-controls]');
    controls.style.display = e.target.checked ? 'flex' : 'none';
  });
  
  // Real-time search as user types
  $('[data-search-name]').addEventListener('input', (e) => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    // Debounce to avoid too many searches
    searchTimer = setTimeout(doSearch, 220);
  });
  
  // Tab Switching
  panel.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update tab styling
      panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show/hide content
      panel.querySelectorAll('[data-content]').forEach(content => {
        content.style.display = content.dataset.content === targetTab ? 'block' : 'none';
      });
      
      // Initialize cache if switching to lookup tab
      if (targetTab === 'lookup' && !cachedScores) {
        ensureScoreCache().catch(console.error);
      }
    });
  });

  // Close button
  $('[data-close]').addEventListener('click', () => {
    stop();
    document.getElementById(TOOL_IDS.PANEL)?.remove();
    document.getElementById(TOOL_IDS.STYLE)?.remove();
    delete window.__combinedToolStop__;
    delete window.__deleteScore;
    delete window.__deleteAllScores;
  });

  // Expose stop function globally
  window.__combinedToolStop__ = stop;

  setStatus('Tool ready. Select a tab to begin.');
})();
