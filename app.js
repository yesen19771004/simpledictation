const STORAGE_KEY = 'dictation-app-v1';
const PRESET_KEY = 'dictation-preset-imported-v1';
const LIBRARIES_KEY = 'dictation-libraries-v1';

// PRESET_LESSONS 定义在 preset-lessons.js 中，按 CEFR 级别组织

// 兼容旧格式（旧格式为 { presetId: sessionId }）
function loadPresetImportedMap() {
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data && Object.keys(data).length > 0 && !data.default) {
      const firstVal = Object.values(data)[0];
      if (typeof firstVal === 'string') {
        return { default: data };
      }
    }
    return data || {};
  } catch { return {}; }
}
function savePresetImportedMap(map) {
  localStorage.setItem(PRESET_KEY, JSON.stringify(map));
}
function getPresetImportedForLibrary(libraryId) {
  const map = loadPresetImportedMap();
  return map[libraryId] || {};
}
function setPresetImportedForLibrary(libraryId, libraryMap) {
  const map = loadPresetImportedMap();
  map[libraryId] = libraryMap;
  savePresetImportedMap(map);
}

// 资料库管理
function loadLibraries() {
  try {
    const data = JSON.parse(localStorage.getItem(LIBRARIES_KEY));
    if (data && Array.isArray(data.libraries)) return data;
  } catch {}
  return { libraries: [], activeLibraryId: 'default' };
}
function saveLibraries(data) {
  localStorage.setItem(LIBRARIES_KEY, JSON.stringify(data));
}
function getActiveLibrary() {
  const data = loadLibraries();
  if (data.activeLibraryId === 'default') {
    return { id: 'default', name: '默认资料库', type: 'default', lessons: PRESET_LESSONS };
  }
  const lib = data.libraries.find(l => l.id === data.activeLibraryId);
  if (lib) return { ...lib, type: 'imported' };
  return { id: 'default', name: '默认资料库', type: 'default', lessons: PRESET_LESSONS };
}
function getAllLibraries() {
  const data = loadLibraries();
  return [
    { id: 'default', name: '默认资料库', type: 'default', lessons: PRESET_LESSONS },
    ...data.libraries.map(l => ({ ...l, type: 'imported' }))
  ];
}

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }

// ============================================================
// Mistakes tracking
// ============================================================
const MISTAKES_KEY = 'dictation-mistakes-v1';

function loadMistakes() {
  try { return JSON.parse(localStorage.getItem(MISTAKES_KEY)) || {}; } catch { return {}; }
}
function saveMistakes(m) {
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(m));
}
function addMistakeWords(wordList) {
  const m = loadMistakes();
  const now = Date.now();
  wordList.forEach(w => {
    const clean = stripPunctuation(w);
    const key = normalizeWord(clean);
    if (!key) return;
    if (!m[key]) m[key] = { word: clean, count: 0, lastAt: now };
    m[key].count += 1;
    m[key].lastAt = now;
  });
  saveMistakes(m);
}
function updateMistakeFromDrill(correctWords, wrongWords) {
  const m = loadMistakes();
  const now = Date.now();
  correctWords.forEach(w => {
    const clean = stripPunctuation(w);
    const key = normalizeWord(clean);
    if (m[key]) {
      m[key].count -= 1;
      m[key].lastAt = now;
      if (m[key].count <= 0) delete m[key];
    }
  });
  wrongWords.forEach(w => {
    const clean = stripPunctuation(w);
    const key = normalizeWord(clean);
    if (m[key]) {
      m[key].count += 1;
      m[key].lastAt = now;
    }
  });
  saveMistakes(m);
}
function getTopMistakes(n = 30) {
  const m = loadMistakes();
  return Object.values(m)
    .sort((a, b) => b.count - a.count || b.lastAt - a.lastAt)
    .slice(0, n);
}
function getMistakeWordsForPrompt(maxWords = 30) {
  const m = loadMistakes();
  let words = Object.values(m)
    .sort((a, b) => b.count - a.count || b.lastAt - a.lastAt)
    .map(x => x.word);
  // Only truncate when there are too many words to keep prompt concise
  if (words.length > maxWords) {
    words = words.slice(0, maxWords);
  }
  return words;
}

// ============================================================
// Data import / export
// ============================================================
function exportMyData() {
  const data = {
    version: 1,
    exportedAt: Date.now(),
    sessions: loadSessions(),
    mistakes: loadMistakes()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dictation-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据已导出');
}

async function importMyData(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data.sessions || !data.mistakes) {
    showToast('数据文件格式不正确');
    return;
  }
  const mode = confirm('点击「确定」覆盖现有数据，点击「取消」合并导入。');
  if (mode) {
    saveSessions(data.sessions);
    saveMistakes(data.mistakes);
    showToast('数据已覆盖导入');
  } else {
    const existingSessions = loadSessions();
    const existingMistakes = loadMistakes();
    const sessionMap = new Map();
    existingSessions.forEach(s => sessionMap.set(s.id, s));
    data.sessions.forEach(s => sessionMap.set(s.id, s));
    saveSessions(Array.from(sessionMap.values()));

    const mergedMistakes = { ...existingMistakes };
    Object.entries(data.mistakes).forEach(([key, val]) => {
      if (mergedMistakes[key]) {
        mergedMistakes[key].count = Math.max(mergedMistakes[key].count, val.count);
        if (val.lastAt > mergedMistakes[key].lastAt) {
          mergedMistakes[key].lastAt = val.lastAt;
          mergedMistakes[key].word = val.word;
        }
      } else {
        mergedMistakes[key] = val;
      }
    });
    saveMistakes(mergedMistakes);
    showToast('数据已合并导入');
  }
}

const ICONS = {
  play: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  home: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  skipForward: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  rotateCcw: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  bookOpen: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  library: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  help: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  target: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  clipboardCheck: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  list: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  message: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  database: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
};

function splitSentences(text) {
  // 按句子结束标点 .!? 分割，保留紧跟的引号
  const parts = text.match(/[^.!?]+[.!?]+['"]?|[^.!?]+/g) || [];
  const trimmed = parts.map(s => s.trim()).filter(s => s.length > 0);

  // 合并孤立的小片段（如引语后面的 'she said.' 合并到前一句）
  const result = [];
  for (const s of trimmed) {
    if (result.length > 0) {
      const last = result[result.length - 1];
      const wordCount = s.split(/\s+/).length;
      if (wordCount <= 3 && /['"]$/.test(last) && !/^['"]/.test(s)) {
        result[result.length - 1] = last + ' ' + s;
        continue;
      }
    }
    result.push(s);
  }
  return result;
}

const NUM_WORDS = {
  'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
  'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
  'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
  'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
  'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
  'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
  'eighty': '80', 'ninety': '90'
};

function normalizeWord(word) {
  let w = word.trim().toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  // 英文数字 ↔ 阿拉伯数字 归一化，如 "five" 与 "5" 视为相等
  if (NUM_WORDS[w] !== undefined) return NUM_WORDS[w];
  return w;
}
function stripPunctuation(word) {
  return word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
}

function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

let currentPage = 'home';
let activeSessionId = null;
let currentTogglePlay = null;

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (currentPage !== 'practice' && currentPage !== 'drill-practice') return;

  // Enter: focus first input when not already in one
  if (e.code === 'Enter' && !e.ctrlKey && !e.shiftKey) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag !== 'textarea' && tag !== 'input') {
      e.preventDefault();
      const firstInput = document.querySelector('#full-input, #drill-input, .word-gap');
      if (firstInput) firstInput.focus();
    }
    return;
  }

  // Space: play/pause
  if (e.code === 'Space' && currentTogglePlay) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'textarea' || tag === 'input') {
      // In input field: require Shift+Space to avoid typing conflicts
      if (!e.shiftKey) return;
    }
    e.preventDefault();
    currentTogglePlay();
  }
});

// Theme
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('dictation-theme', theme); } catch {}
}
function initTheme() {
  let theme = 'light';
  try {
    const saved = localStorage.getItem('dictation-theme');
    if (saved) theme = saved;
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
  } catch {}
  applyTheme(theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
});

function setPage(page) {
  if (currentPage === 'practice' && activeSessionId && page !== 'practice') {
    const main = document.getElementById('main');
    const card = main.querySelector('.card');
    const session = getSession(activeSessionId);
    if (session && card) {
      const progress = session.progress || initProgress(session.sentences.length);
      const idx = progress.currentSentenceIdx || 0;
      if (idx < session.sentences.length) {
        const words = session.sentences[idx].trim().split(/\s+/);
        saveCurrentDraft(progress, idx, words, card);
        updateSessionProgress(activeSessionId, progress);
      }
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
  currentPage = page;
  const nav = document.getElementById('nav-tabs');
  nav.style.display = (page === 'home' || page === 'library' || page === 'drill' || page === 'help') ? 'flex' : 'none';
  nav.querySelectorAll('button').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  renderMain();
}

document.getElementById('nav-tabs').addEventListener('click', (e) => {
  if (e.target.dataset.page) setPage(e.target.dataset.page);
});

function renderMain() {
  const main = document.getElementById('main');
  main.innerHTML = '';
  if (currentPage === 'home') renderHome(main);
  else if (currentPage === 'create') renderCreate(main);
  else if (currentPage === 'practice') renderPractice(main);
  else if (currentPage === 'result') renderResult(main);
  else if (currentPage === 'library') renderLibrary(main);
  else if (currentPage === 'drill') renderDrill(main);
  else if (currentPage === 'drill-practice') renderDrillPractice(main);
  else if (currentPage === 'help') renderHelp(main);
}

function renderHome(container) {
  const sessions = loadSessions();
  const card = document.createElement('div');
  card.className = 'card';
  if (sessions.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <h3>开始你的第一次听写</h3>
        <p>从资料库选择适合你的课程，或者粘贴自己的英文文本开始练习。</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="setPage('library')">${ICONS.bookOpen}浏览资料库</button>
          <button class="btn btn-secondary" onclick="setPage('create')">${ICONS.pencil}新建听写</button>
          <button class="btn btn-secondary" onclick="setPage('library')">${ICONS.bookOpen}从资料库导入</button>
        </div>
        <div style="margin-top:20px;padding-top:20px;border-top:1.5px solid var(--border)">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px">已有备份？可导入历史数据</div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-secondary" id="btn-import-data-empty">${ICONS.upload}导入我的数据</button>
            <input type="file" id="data-file-input-empty" accept=".json" style="display:none">
          </div>
        </div>
      </div>`;
  } else {
    let html = `<div class="card-title" style="margin-bottom:16px">我的听写</div>
      <div class="session-list">`;
    sessions.forEach(s => {
      const progress = s.progress || {};
      const done = (progress.completedSentences || []).filter(Boolean).length;
      const total = s.sentences.length;
      const percent = total ? Math.round(done / total * 100) : 0;
      html += `<div class="session-item">
        <div class="session-info">
          <div class="session-title">${escapeHtml(s.title || '未命名练习')}<span style="font-size:12px;color:var(--text-muted);font-weight:400;margin-left:6px">${s.libraryName && s.level ? escapeHtml(s.libraryName + ' · ' + s.level) : ''}</span></div>
          <div class="session-meta">
            <span>共 ${total} 句</span>
            <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;"></span>
            <span>${percent}% 完成</span>
            <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;"></span>
            <span>${new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="progress-track" style="margin-top:8px;max-width:240px">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
        </div>
        <div class="session-actions">
          <button class="btn btn-primary" data-action="continue" data-id="${s.id}">${ICONS.play}继续</button>
          <button class="btn btn-secondary" data-action="restart" data-id="${s.id}">${ICONS.rotateCcw}重练</button>
          <button class="btn btn-danger" data-action="delete" data-id="${s.id}">${ICONS.trash}删除</button>
        </div>
      </div>`;
    });
    html += `</div>
    <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="setPage('create')">${ICONS.plus}新建听写</button>
      <button class="btn btn-secondary" onclick="setPage('library')">${ICONS.bookOpen}从资料库导入</button>
    </div>
    <div style="margin-top:28px;padding-top:24px;border-top:1.5px solid var(--border)">
      <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">我的数据</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">导出、导入或清空你的听写记录和错题数据。</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-export-data">${ICONS.download}导出我的数据</button>
        <button class="btn btn-secondary" id="btn-import-data">${ICONS.upload}导入我的数据</button>
        <button class="btn btn-danger" id="btn-clear-data">${ICONS.trash}清空数据</button>
        <input type="file" id="data-file-input" accept=".json" style="display:none">
      </div>
    </div>`;
    card.innerHTML = html;
  }
  container.appendChild(card);

  // Export / import handlers
  const exportBtn = card.querySelector('#btn-export-data');
  if (exportBtn) exportBtn.addEventListener('click', () => exportMyData());

  const importBtn = card.querySelector('#btn-import-data');
  const dataFileInput = card.querySelector('#data-file-input');
  if (importBtn && dataFileInput) {
    importBtn.addEventListener('click', () => dataFileInput.click());
    dataFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await importMyData(file);
        renderMain();
      } catch (err) {
        showToast('导入失败：' + (err.message || '未知错误'));
      }
      dataFileInput.value = '';
    });
  }

  // Empty state import handler
  const importBtnEmpty = card.querySelector('#btn-import-data-empty');
  const dataFileInputEmpty = card.querySelector('#data-file-input-empty');
  if (importBtnEmpty && dataFileInputEmpty) {
    importBtnEmpty.addEventListener('click', () => dataFileInputEmpty.click());
    dataFileInputEmpty.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await importMyData(file);
        renderMain();
      } catch (err) {
        showToast('导入失败：' + (err.message || '未知错误'));
      }
      dataFileInputEmpty.value = '';
    });
  }

  // Clear data handler
  const clearBtn = card.querySelector('#btn-clear-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('确定清空所有数据吗？\n\n这将删除：\n· 所有听写记录\n· 所有错题记录\n· 所有资料库导入映射\n\n此操作不可恢复，请确认已导出备份。')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MISTAKES_KEY);
        localStorage.removeItem(PRESET_KEY);
        localStorage.removeItem(LIBRARIES_KEY);
        showToast('数据已清空');
        renderMain();
      }
    });
  }

  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'delete') {
      if (confirm('确定删除此练习吗？')) {
        saveSessions(loadSessions().filter(x => x.id !== id));
        // 清理资料库导入映射
        const allLibs = getAllLibraries();
        for (const lib of allLibs) {
          const map = getPresetImportedForLibrary(lib.id);
          let changed = false;
          for (const [presetId, sessionId] of Object.entries(map)) {
            if (sessionId === id) {
              delete map[presetId];
              changed = true;
            }
          }
          if (changed) setPresetImportedForLibrary(lib.id, map);
        }
        renderMain();
        showToast('已删除');
      }
    } else if (action === 'restart') {
      const sessions = loadSessions();
      const s = sessions.find(x => x.id === id);
      if (!s) return;
      s.progress = initProgress(s.sentences.length);
      saveSessions(sessions);
      activeSessionId = id;
      setPage('practice');
    } else if (action === 'continue') {
      activeSessionId = id;
      setPage('practice');
    }
  });
}

function renderCreate(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-title">新建听写</div>
    <div class="card-desc">输入英文原文，系统会自动按句切分，生成听写练习。</div>
    <div class="form-group">
      <label>标题（可选）</label>
      <input type="text" id="create-title" placeholder="例如：每日英语新闻">
    </div>
    <div class="form-group">
      <label>英文原文</label>
      <textarea id="create-text" placeholder="在此粘贴一段英文..."></textarea>
    </div>
    <div class="action-bar" style="padding:0;border:none;background:transparent">
      <button class="btn btn-primary" id="btn-create">${ICONS.sparkles}生成练习</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.x}取消</button>
    </div>
  `;
  container.appendChild(card);

  card.querySelector('#btn-create').addEventListener('click', () => {
    const title = document.getElementById('create-title').value.trim() || '未命名练习';
    const text = document.getElementById('create-text').value.trim();
    if (!text) { showToast('请输入英文原文'); return; }
    const sentences = splitSentences(text);
    if (!sentences.length) { showToast('未能识别到句子'); return; }
    const session = {
      id: generateId(),
      title,
      text,
      sentences,
      progress: initProgress(sentences.length),
      createdAt: Date.now()
    };
    const sessions = loadSessions();
    sessions.unshift(session);
    saveSessions(sessions);
    activeSessionId = session.id;
    setPage('practice');
  });
}

function initProgress(n) {
  return {
    currentSentenceIdx: 0,
    completedSentences: Array(n).fill(false),
    sentenceStates: Array.from({ length: n }, () => ({}))
  };
}

// 基于 LCS 的单词级 diff,返回原文中匹配上的索引集合
function diffWords(src, tgt) {
  const m = src.length, n = tgt.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normalizeWord(src[i - 1]) === normalizeWord(tgt[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const matched = new Set();
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (normalizeWord(src[i - 1]) === normalizeWord(tgt[j - 1])) {
      matched.add(i - 1);
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return matched;
}

function getSession(id) {
  return loadSessions().find(s => s.id === id);
}

function updateSessionProgress(id, progress) {
  const sessions = loadSessions();
  const s = sessions.find(x => x.id === id);
  if (s) { s.progress = progress; saveSessions(sessions); }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let selectedVoice = null;

function getVoiceByRegion(region) {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (enVoices.length === 0) return null;
  if (region === 'GB') {
    const v = enVoices.find(v => v.name === 'Google UK English Male');
    if (v) return v;
    return enVoices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-gb')) || enVoices[0];
  }
  // US default
  const v = enVoices.find(v => v.name === 'Google US English');
  if (v) return v;
  return enVoices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-us')) || enVoices[0];
}

function getSavedVoiceRegion() {
  try { return localStorage.getItem('dictation-voice-region') || 'US'; } catch { return 'US'; }
}

function pickBestVoice() {
  return getVoiceByRegion(getSavedVoiceRegion());
}

function initVoices() {
  selectedVoice = pickBestVoice();
}

function buildVoiceToggleHTML() {
  const region = getSavedVoiceRegion();
  return `<div class="voice-toggle"><button class="voice-chip ${region === 'US' ? 'active' : ''}" data-region="US">US</button><button class="voice-chip ${region === 'GB' ? 'active' : ''}" data-region="GB">GB</button></div>`;
}

function attachVoiceToggleListeners(container) {
  const toggle = container.querySelector('.voice-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-region]');
    if (!btn) return;
    const region = btn.dataset.region;
    const voice = getVoiceByRegion(region);
    if (voice) {
      selectedVoice = voice;
      try { localStorage.setItem('dictation-voice-region', region); } catch {}
      toggle.querySelectorAll('.voice-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.region === region);
      });
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('Hello');
        u.voice = voice;
        u.volume = 0.3;
        window.speechSynthesis.speak(u);
      }
    }
  });
}

// macOS Chrome 第一次 getVoices() 可能为空，需要等 voiceschanged
if (window.speechSynthesis) {
  initVoices();
  if (!selectedVoice || window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', initVoices, { once: true });
  }
}

function speak(text, rate = 1.0, onEnd) {
  if (!window.speechSynthesis) { return false; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  if (selectedVoice) {
    u.voice = selectedVoice;
    u.lang = selectedVoice.lang || 'en-US';
  } else {
    u.lang = 'en-US';
  }
  if (onEnd) {
    u.onend = onEnd;
    u.onerror = onEnd;
  }
  window.speechSynthesis.speak(u);
  return true;
}

let translationCache = {};
async function translateText(text, from = 'en', to = 'zh') {
  if (!text) return '';
  const key = `${from}|${to}|${text}`;
  if (translationCache[key]) return translationCache[key];
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data?.responseData?.translatedText || '';
    translationCache[key] = result;
    return result;
  } catch {
    return '';
  }
}

function renderPractice(container) {
  const session = getSession(activeSessionId);
  if (!session) { setPage('home'); return; }

  const progress = session.progress || initProgress(session.sentences.length);
  const idx = progress.currentSentenceIdx || 0;
  if (idx >= session.sentences.length) { setPage('result'); return; }

  const sentence = session.sentences[idx];
  const words = sentence.trim().split(/\s+/);
  const state = progress.sentenceStates[idx] || {};
  let locked = [];
  let gapDrafts = {};
  const hasHistory = Array.isArray(state.lockedIndices);
  if (hasHistory) {
    locked = state.lockedIndices;
    gapDrafts = state.gapDrafts || {};
  }

  const totalDone = (progress.completedSentences || []).filter(Boolean).length;
  const totalPercent = session.sentences.length ? Math.round(totalDone / session.sentences.length * 100) : 0;

  const card = document.createElement('div');
  card.className = 'practice-card';
  card.innerHTML = `
    <div class="practice-header">
      <div>
        <div class="practice-title">${escapeHtml(session.title || '未命名练习')}</div>
        <div class="practice-subtitle">第 ${idx + 1} / ${session.sentences.length} 句 · 已完成 ${totalPercent}%</div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${totalPercent}%"></div>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-sm btn-secondary btn-icon" id="btn-prev" ${idx <= 0 ? 'disabled' : ''} title="上一句">${ICONS.chevronLeft}</button>
        <button class="btn btn-sm btn-secondary btn-icon" id="btn-next" ${idx >= session.sentences.length - 1 ? 'disabled' : ''} title="下一句">${ICONS.chevronRight}</button>
        <button class="btn btn-sm btn-secondary btn-icon" onclick="setPage('home')" title="返回">${ICONS.home}</button>
      </div>
    </div>
    <div class="player-bar">
      <button class="player-btn" id="btn-play" title="播放">
        <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <svg class="pause-icon" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </button>
      <div class="speed-control">
        <label>语速</label>
        <input type="range" id="rate" min="0.5" max="1.5" step="0.1" value="1">
        <span class="speed-value" id="rate-value">1.0x</span>
      </div>
      ${buildVoiceToggleHTML()}
      <span id="play-status" style="font-size:13px;color:var(--text-muted);font-weight:500"></span>
    </div>
    <div class="dictation-area" id="dictation-area"></div>
    <div class="action-bar">
      <button class="btn btn-primary" id="btn-check">${ICONS.check}提交检查</button>
      <button class="btn btn-secondary" id="btn-show-original">${ICONS.eye}显示原文</button>
      <button class="btn btn-secondary" id="btn-skip">${ICONS.skipForward}跳过</button>
    </div>
    <div class="side-panel" id="side-panel" style="display:none">
      <div class="accordion">
        <button class="accordion-header" id="acc-original-btn">原文</button>
        <div class="accordion-body" id="acc-original">${escapeHtml(sentence)}</div>
      </div>
      <div class="accordion">
        <button class="accordion-header" id="acc-trans-btn">句子翻译</button>
        <div class="accordion-body" id="acc-trans"><div class="translation-text">加载中...</div></div>
      </div>
      <div class="accordion">
        <button class="accordion-header" id="acc-words-btn">单词翻译（点击单词查看）</button>
        <div class="accordion-body" id="acc-words">
          <div class="word-list" id="word-list"></div>
          <div id="word-trans"></div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(card);

  const dictationArea = card.querySelector('#dictation-area');
  if (!hasHistory) {
    dictationArea.innerHTML = `
      <div class="form-group" style="margin-bottom:0">
        <label style="margin-bottom:10px">请听写整句</label>
        <textarea class="dictation-full" id="full-input" placeholder="听完后在此输入完整句子..."></textarea>
        <div class="keyboard-hint"><kbd>Enter</kbd> 开始输入 · <kbd>Space</kbd> 播放/暂停 · <kbd>Shift</kbd>+<kbd>Space</kbd> 在输入框内播放/暂停 · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 提交检查</div>
      </div>
    `;
  } else {
    const line = document.createElement('div');
    line.className = 'words-line';
    const lockedSet = new Set(locked);
    let wi = 0;
    while (wi < words.length) {
      if (lockedSet.has(wi)) {
        const span = document.createElement('span');
        span.className = 'word-lock';
        span.textContent = words[wi];
        line.appendChild(span);
        wi++;
      } else {
        const start = wi;
        let charCount = 0;
        const indices = [];
        while (wi < words.length && !lockedSet.has(wi)) {
          charCount += words[wi].length;
          indices.push(wi);
          wi++;
        }
        const spaceCount = Math.max(0, indices.length - 1);
        const totalLen = charCount + spaceCount;
        const input = document.createElement('input');
        input.className = 'word-gap';
        input.dataset.indices = JSON.stringify(indices);
        input.value = gapDrafts[start] || '';
        input.size = Math.max(3, totalLen + 2);
        input.placeholder = '?';
        line.appendChild(input);
      }
    }
    dictationArea.appendChild(line);
    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.innerHTML = '<kbd>Enter</kbd> 开始输入 · <kbd>Space</kbd> 播放/暂停 · <kbd>Shift</kbd>+<kbd>Space</kbd> 在输入框内播放/暂停 · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 提交检查';
    dictationArea.appendChild(hint);
  }

  // Play / Stop
  const playBtn = card.querySelector('#btn-play');
  const playStatus = card.querySelector('#play-status');
  const rateInput = card.querySelector('#rate');
  const rateValue = card.querySelector('#rate-value');
  let isPlaying = false;

  rateInput.addEventListener('input', () => {
    rateValue.textContent = parseFloat(rateInput.value).toFixed(1) + 'x';
  });

  function setPlaying(playing) {
    isPlaying = playing;
    playBtn.classList.toggle('playing', playing);
    playStatus.textContent = playing ? '播放中…' : '';
  }

  function togglePlay() {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      const rate = parseFloat(rateInput.value);
      const ok = speak(sentence, rate, () => {
        if (isPlaying) setPlaying(false);
      });
      if (!ok) { showToast('当前浏览器不支持语音播放'); return; }
      setPlaying(true);
    }
  }
  currentTogglePlay = togglePlay;
  playBtn.addEventListener('click', togglePlay);

  // Navigation
  card.querySelector('#btn-prev').addEventListener('click', () => {
    saveCurrentDraft(progress, idx, words, card);
    progress.currentSentenceIdx = idx - 1;
    updateSessionProgress(activeSessionId, progress);
    renderMain();
  });
  card.querySelector('#btn-next').addEventListener('click', () => {
    saveCurrentDraft(progress, idx, words, card);
    progress.currentSentenceIdx = idx + 1;
    updateSessionProgress(activeSessionId, progress);
    renderMain();
  });

  // Show original / side panel
  const sidePanel = card.querySelector('#side-panel');
  card.querySelector('#btn-show-original').addEventListener('click', () => {
    sidePanel.style.display = sidePanel.style.display === 'none' ? 'block' : 'none';
    loadTranslations(sentence, words, card);
  });

  // Accordion toggle
  ['original', 'trans', 'words'].forEach(key => {
    const btn = card.querySelector(`#acc-${key}-btn`);
    const body = card.querySelector(`#acc-${key}`);
    if (btn && body) {
      btn.addEventListener('click', () => {
        body.classList.toggle('hidden');
        btn.classList.toggle('expanded', !body.classList.contains('hidden'));
      });
    }
  });

  // Word chips click
  const wordList = card.querySelector('#word-list');
  const wordTrans = card.querySelector('#word-trans');
  words.forEach(w => {
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.textContent = w;
    chip.addEventListener('click', async () => {
      wordTrans.textContent = '查询中…';
      const t = await translateText(w);
      wordTrans.innerHTML = `<strong>${escapeHtml(w)}</strong>：${escapeHtml(t || '（暂无翻译）')}`;
    });
    wordList.appendChild(chip);
  });

  // Check / Submit logic
  function doCheck() {
    if (!hasHistory) {
      const fullText = card.querySelector('#full-input').value.trim();
      if (!fullText) { showToast('请输入内容'); return; }
      const userWords = fullText.split(/\s+/);
      const matchedSet = diffWords(words, userWords);
      const newLocked = Array.from(matchedSet);
      if (newLocked.length === words.length) {
        markSentenceDone(progress, idx);
        showToast('全对！进入下一句');
        updateSessionProgress(activeSessionId, progress);
        renderMain();
        return;
      }
      // Record unmatched words as mistakes
      const unmatchedWords = words.filter((_, i) => !matchedSet.has(i));
      addMistakeWords(unmatchedWords);
      progress.sentenceStates[idx] = { lockedIndices: newLocked, gapDrafts: {} };
      updateSessionProgress(activeSessionId, progress);
      renderMain();
      showToast(`对了 ${newLocked.length}/${words.length} 个词，请补全剩余部分`);
    } else {
      const inputs = card.querySelectorAll('.word-gap');
      const lockedSet = new Set(locked);
      const newDrafts = {};
      let added = 0;
      inputs.forEach(inp => {
        const indices = JSON.parse(inp.dataset.indices);
        const val = inp.value.trim();
        const userWords = val.split(/\s+/);
        let blockMatchAll = true;
        indices.forEach((srcIdx, k) => {
          const uw = userWords[k] || '';
          if (normalizeWord(uw) === normalizeWord(words[srcIdx])) {
            lockedSet.add(srcIdx);
            added++;
          } else {
            blockMatchAll = false;
          }
        });
        if (!blockMatchAll) {
          newDrafts[indices[0]] = val;
        }
      });
      const newLocked = Array.from(lockedSet).sort((a, b) => a - b);
      if (newLocked.length === words.length) {
        markSentenceDone(progress, idx);
        showToast('全对！进入下一句');
        updateSessionProgress(activeSessionId, progress);
        renderMain();
        return;
      }
      // Record still-unmatched words as mistakes
      const unmatchedWords = words.filter((_, i) => !lockedSet.has(i));
      addMistakeWords(unmatchedWords);
      progress.sentenceStates[idx] = { lockedIndices: newLocked, gapDrafts: newDrafts };
      updateSessionProgress(activeSessionId, progress);
      renderMain();
      showToast(`对了 ${newLocked.length}/${words.length} 个词，继续补全`);
    }
  }

  card.querySelector('#btn-check').addEventListener('click', doCheck);

  // Keyboard shortcut: Ctrl+Enter to submit
  function handleKeydown(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      doCheck();
    }
  }
  if (!hasHistory) {
    const fullInput = card.querySelector('#full-input');
    fullInput.addEventListener('keydown', handleKeydown);
  } else {
    card.querySelectorAll('.word-gap').forEach(inp => {
      inp.addEventListener('keydown', handleKeydown);
    });
  }

  // Skip
  card.querySelector('#btn-skip').addEventListener('click', () => {
    if (confirm('确定跳过本句吗？进度将标记为跳过。')) {
      markSentenceDone(progress, idx);
      updateSessionProgress(activeSessionId, progress);
      renderMain();
    }
  });

  // Voice picker
  attachVoiceToggleListeners(card);
}

function saveCurrentDraft(progress, idx, words, card) {
  if (!card) return;
  const state = progress.sentenceStates[idx];
  if (!state || !Array.isArray(state.lockedIndices)) return;
  const inputs = card.querySelectorAll('.word-gap');
  const drafts = {};
  inputs.forEach(inp => {
    const indices = JSON.parse(inp.dataset.indices);
    drafts[indices[0]] = inp.value.trim();
  });
  state.gapDrafts = drafts;
  progress.sentenceStates[idx] = state;
}

function markSentenceDone(progress, idx) {
  progress.completedSentences[idx] = true;
  // advance
  let next = idx + 1;
  while (next < progress.completedSentences.length && progress.completedSentences[next]) next++;
  progress.currentSentenceIdx = next < progress.completedSentences.length ? next : progress.completedSentences.length;
}

async function loadTranslations(sentence, words, card) {
  const transBody = card.querySelector('#acc-trans');
  const t = await translateText(sentence);
  transBody.innerHTML = `<div class="translation-text">${escapeHtml(t || '翻译失败')}</div>`;
}

function renderResult(container) {
  const session = getSession(activeSessionId);
  if (!session) { setPage('home'); return; }
  const total = session.sentences.length;
  const done = (session.progress?.completedSentences || []).filter(Boolean).length;
  const accuracy = total ? Math.round(done / total * 100) : 0;
  const card = document.createElement('div');
  card.className = 'card result-card';
  card.innerHTML = `
    <h2>${accuracy === 100 ? '🎉 全部完成' : '练习完成'}</h2>
    <p>${escapeHtml(session.title || '未命名练习')}</p>
    <div class="result-stats">
      <div class="stat-item">
        <div class="stat-value">${done}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${total}</div>
        <div class="stat-label">总句数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${accuracy}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" id="btn-restart">${ICONS.rotateCcw}再次练习</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}返回</button>
    </div>
  `;
  container.appendChild(card);
  card.querySelector('#btn-restart').addEventListener('click', () => {
    const sessions = loadSessions();
    const s = sessions.find(x => x.id === activeSessionId);
    if (s) {
      s.progress = initProgress(s.sentences.length);
      saveSessions(sessions);
    }
    setPage('practice');
  });
}

function renderLibrary(container) {
  const activeLibrary = getActiveLibrary();
  const lessons = activeLibrary.lessons || [];
  let importedMap = getPresetImportedForLibrary(activeLibrary.id);
  const sessions = loadSessions();
  const allLibraries = getAllLibraries();
  const card = document.createElement('div');
  card.className = 'card';

  let activeLevel = 'all';
  const levels = ['A1','A2','B1','B2','C1','C2'];

  function getSessionStatus(presetId) {
    const sessionId = importedMap[presetId];
    if (!sessionId) return { imported: false, done: 0, total: 0 };
    const s = sessions.find(x => x.id === sessionId);
    if (!s) return { imported: false, done: 0, total: 0 };
    const total = s.sentences.length;
    const done = (s.progress?.completedSentences || []).filter(Boolean).length;
    return { imported: true, done, total, sessionId };
  }

  function buildHtml() {
    let html = `<div class="card-title">资料库</div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px">
      <div class="card-desc" style="margin-bottom:0">当前：${escapeHtml(activeLibrary.name)} · 共 ${lessons.length} 篇</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sm btn-secondary" id="btn-import-library">${ICONS.upload}导入资料库</button>
        <input type="file" id="library-file-input" accept=".json" style="display:none">
      </div>
    </div>`;

    // Library selector
    html += `<div class="level-filter" style="margin-bottom:16px;padding:12px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border);align-items:center">
      <span style="font-size:13px;color:var(--text-muted);font-weight:600;white-space:nowrap">资料库：</span>`;
    allLibraries.forEach(lib => {
      const isActive = lib.id === activeLibrary.id;
      html += `<button class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}" data-switch-lib="${lib.id}" style="position:relative">
        ${escapeHtml(lib.name)}${lib.type === 'imported' ? ` <span data-delete-lib="${lib.id}" style="margin-left:6px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;opacity:0.7" title="删除" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--danger)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>` : ''}
      </button>`;
    });
    html += `</div>`;

    // 动态级别列表
    const cefrOrder = ['A1','A2','B1','B2','C1','C2'];
    const displayLevels = [...new Set(lessons.map(l => l.level).filter(Boolean))].sort((a, b) => {
      const ia = cefrOrder.indexOf(a);
      const ib = cefrOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    // Level filter
    html += `<div class="level-filter">
      <button class="btn btn-sm ${activeLevel === 'all' ? 'btn-primary' : 'btn-secondary'}" data-level="all">全部</button>
      ${displayLevels.map(lv => `<button class="btn btn-sm ${activeLevel === lv ? 'btn-primary' : 'btn-secondary'}" data-level="${lv}">${lv}</button>`).join('')}
    </div>`;

    const groups = {};
    lessons.forEach(l => {
      if (activeLevel !== 'all' && l.level !== activeLevel) return;
      if (!groups[l.level]) groups[l.level] = [];
      groups[l.level].push(l);
    });

    if (Object.keys(groups).length === 0) {
      html += `<div class="empty-state"><p>该级别暂无数据</p></div>`;
    } else {
      displayLevels.forEach(lv => {
        if (!groups[lv]) return;
        html += `<div class="level-section" style="margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <span class="level-badge level-${lv.toLowerCase()}">${lv}</span>
            <span style="font-size:13px;color:var(--text-muted)">${groups[lv].length} 篇</span>
          </div>
          <div class="session-list">`;
        groups[lv].forEach(l => {
          const st = getSessionStatus(l.id);
          const percent = st.total ? Math.round(st.done / st.total * 100) : 0;
          let statusBadge = '';
          if (!st.imported) statusBadge = `<span style="font-size:12px;color:var(--text-muted)">未开始</span>`;
          else if (percent === 100) statusBadge = `<span style="font-size:12px;color:var(--success);font-weight:600">已完成</span>`;
          else statusBadge = `<span style="font-size:12px;color:var(--primary);font-weight:600">进度 ${percent}%</span>`;

          html += `<div class="session-item">
            <div class="session-info">
              <div class="session-title">${escapeHtml(l.title)}</div>
              <div class="session-meta">
                <span>${st.total ? `共 ${st.total} 句` : ''}</span>
                <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;opacity:0.5"></span>
                ${statusBadge}
              </div>
            </div>
            <div class="session-actions">
              <button class="btn btn-primary" data-action="start" data-id="${l.id}">${st.imported ? ICONS.play + '继续' : ICONS.play + '开始练习'}</button>
              ${st.imported ? `<button class="btn btn-secondary" data-action="restart" data-id="${l.id}">${ICONS.rotateCcw}重置</button>` : ''}
            </div>
          </div>`;
        });
        html += `</div></div>`;
      });
    }
    return html;
  }

  card.innerHTML = buildHtml();
  container.appendChild(card);

  async function handleLibraryFile(e) {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.name || !Array.isArray(data.lessons)) {
        showToast('资料库格式不正确：需要 name 和 lessons 字段');
        return;
      }
      for (const l of data.lessons) {
        if (!l.id || !l.level || !l.title || !l.text) {
          showToast('课程格式不正确：每课需要 id、level、title、text');
          return;
        }
      }
      const libData = loadLibraries();
      const allNames = getAllLibraries().map(l => l.name);
      let name = data.name;
      if (allNames.includes(name)) {
        name = name + ' (' + new Date().toLocaleDateString() + ')';
      }
      const newLib = {
        id: 'lib-' + generateId(),
        name,
        lessons: data.lessons
      };
      libData.libraries.push(newLib);
      saveLibraries(libData);
      showToast(`资料库 "${name}" 导入成功`);
      renderMain();
    } catch (err) {
      showToast('导入失败：' + (err.message || '未知错误'));
    }
    input.value = '';
  }

  // Import library handler
  const importBtn = card.querySelector('#btn-import-library');
  const fileInput = card.querySelector('#library-file-input');
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleLibraryFile);
  }

  card.addEventListener('click', (e) => {
    // Delete library
    const deleteBtn = e.target.closest('[data-delete-lib]');
    if (deleteBtn) {
      e.stopPropagation();
      const libId = deleteBtn.dataset.deleteLib;
      if (libId === 'default') return;
      const lib = getAllLibraries().find(l => l.id === libId);
      if (!lib) return;
      if (confirm(`确定删除资料库 "${lib.name}" 吗？相关的练习映射将被清理。`)) {
        const libData = loadLibraries();
        libData.libraries = libData.libraries.filter(l => l.id !== libId);
        if (libData.activeLibraryId === libId) {
          libData.activeLibraryId = 'default';
        }
        saveLibraries(libData);
        const presetMap = loadPresetImportedMap();
        delete presetMap[libId];
        savePresetImportedMap(presetMap);
        showToast('资料库已删除');
        renderMain();
      }
      return;
    }

    // Switch library
    const switchBtn = e.target.closest('[data-switch-lib]');
    if (switchBtn) {
      const libId = switchBtn.dataset.switchLib;
      if (libId !== activeLibrary.id) {
        const libData = loadLibraries();
        libData.activeLibraryId = libId;
        saveLibraries(libData);
        renderMain();
      }
      return;
    }

    const btn = e.target.closest('[data-level]');
    if (btn) {
      activeLevel = btn.dataset.level;
      card.innerHTML = buildHtml();
      // Re-attach import handlers after rebuild
      const newImportBtn = card.querySelector('#btn-import-library');
      const newFileInput = card.querySelector('#library-file-input');
      if (newImportBtn && newFileInput) {
        newImportBtn.addEventListener('click', () => newFileInput.click());
        newFileInput.addEventListener('change', handleLibraryFile);
      }
      return;
    }

    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const presetId = actionBtn.dataset.id;
    const preset = lessons.find(p => p.id === presetId);
    if (!preset) return;
    const action = actionBtn.dataset.action;

    if (action === 'start') {
      let sessionId = importedMap[presetId];
      if (!sessionId) {
        const sentences = splitSentences(preset.text);
        const session = {
          id: generateId(),
          title: preset.title,
          text: preset.text,
          sentences,
          progress: initProgress(sentences.length),
          createdAt: Date.now(),
          libraryName: activeLibrary.name,
          level: preset.level
        };
        const allSessions = loadSessions();
        allSessions.unshift(session);
        saveSessions(allSessions);
        sessionId = session.id;
        importedMap[presetId] = sessionId;
        setPresetImportedForLibrary(activeLibrary.id, importedMap);
      }
      activeSessionId = sessionId;
      setPage('practice');
    } else if (action === 'restart') {
      const sessionId = importedMap[presetId];
      if (!sessionId) return;
      const allSessions = loadSessions();
      const s = allSessions.find(x => x.id === sessionId);
      if (s) {
        s.progress = initProgress(s.sentences.length);
        saveSessions(allSessions);
        activeSessionId = sessionId;
        setPage('practice');
      }
    }
  });
}

// ============================================================
// Drill (Weak-word training)
// ============================================================
let drillSession = null; // { title, sentences, currentIdx, text }

function renderDrill(container) {
  const mistakes = loadMistakes();
  const list = Object.values(mistakes).sort((a, b) => b.count - a.count || b.lastAt - a.lastAt);
  const card = document.createElement('div');
  card.className = 'card';

  if (list.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${ICONS.target}</div>
        <h3>暂无待训练词汇</h3>
        <p>在常规听写练习中，系统会自动记录你听写出错的单词。积累足够错题后，来这里进行专项突破。</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="setPage('library')">${ICONS.bookOpen}去资料库</button>
        </div>
      </div>`;
    container.appendChild(card);
    return;
  }

  const savedLevel = (() => {
    try { return localStorage.getItem('dictation-drill-level') || ''; } catch { return ''; }
  })();
  const levels = ['A1','A2','B1','B2','C1','C2'];
  const defaultLevel = savedLevel && levels.includes(savedLevel) ? savedLevel : 'B1';

  const MAX_PROMPT_WORDS = 30;
  const promptWords = getMistakeWordsForPrompt(MAX_PROMPT_WORDS);
  const allPromptWords = Object.values(loadMistakes());
  const isTruncated = allPromptWords.length > MAX_PROMPT_WORDS;

  function buildPromptText(level) {
    const levelDesc = {
      A1: '使用非常基础的词汇和简单句型，适合英语初学者',
      A2: '使用基础词汇和常见句型，句子较短，语法简单',
      B1: '使用中等难度词汇，句子结构适中，有一定复杂度',
      B2: '使用较丰富词汇，包含复合句和从句，难度适中偏高',
      C1: '使用较高级词汇和复杂句型，表达流畅自然',
      C2: '使用学术或高级词汇，句式复杂多变，接近母语水平'
    };
    if (!promptWords.length) return '';
    return `请写一段自然流畅的英文短文，尽量包含以下单词：${promptWords.join('、')}。这些单词是我正在听写训练中的重点词汇，请确保它们在语境中自然出现。\n\n文章难度要求：CEFR ${level} 级别。${levelDesc[level]}。短文长度适中（约 150-250 词），主题不限，语气轻松自然即可。`;
  }

  const promptText = buildPromptText(defaultLevel);

  card.innerHTML = `
    <div class="card-title">专项训练</div>
    <div class="card-desc">针对听写出错的薄弱词汇进行集中突破。系统会自动生成 LLM 提示词，让大语言模型为你量身打造训练文章。</div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:var(--bg);border-radius:var(--radius);border:1.5px solid var(--border)">
      <div style="width:48px;height:48px;border-radius:50%;background:var(--danger-soft);color:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICONS.target}</div>
      <div>
        <div style="font-size:20px;font-weight:800;color:var(--text);line-height:1">${list.length}</div>
        <div style="font-size:13px;color:var(--text-muted)">个待训练词汇</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" id="btn-gen-prompt" ${promptWords.length ? '' : 'disabled'}>${ICONS.sparkles}生成提示词</button>
      </div>
    </div>

    <div id="prompt-area" style="display:none;margin-bottom:20px">
      <div class="form-group" style="margin-bottom:12px">
        <label>选择文章难度</label>
        <div class="level-filter" id="drill-level-filter" style="margin-bottom:0">
          ${levels.map(lv => `<button class="btn btn-sm ${lv === defaultLevel ? 'btn-primary' : 'btn-secondary'}" data-level="${lv}">${lv}</button>`).join('')}
        </div>
      </div>
      <div class="form-group" style="margin-bottom:8px">
        <label>LLM 提示词${isTruncated ? `（已从 ${allPromptWords.length} 个错词中筛选出 ${promptWords.length} 个）` : `（包含 ${promptWords.length} 个错词）`}</label>
        <textarea id="drill-prompt" readonly style="min-height:120px;background:var(--bg);cursor:text">${escapeHtml(promptText)}</textarea>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" id="btn-copy-prompt">${ICONS.copy}复制提示词</button>
      </div>
    </div>

    <div class="form-group" style="margin-bottom:16px">
      <label>粘贴 LLM 返回的英文文章</label>
      <textarea id="drill-text" placeholder="将大语言模型生成的英文文章粘贴到这里..."></textarea>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="btn-start-drill">${ICONS.zap}开始专项训练</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}返回</button>
    </div>

    <div style="margin-top:24px">
      <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:flex;align-items:center;gap:6px">${ICONS.list}错题记录</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${list.map(m => `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--bg);border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;color:var(--text-secondary)"><strong style="color:var(--text)">${escapeHtml(m.word)}</strong><span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;opacity:0.5"></span>出错 ${m.count} 次</span>`).join('')}
      </div>
    </div>
  `;
  container.appendChild(card);

  let currentLevel = defaultLevel;

  // Level filter click
  const levelFilter = card.querySelector('#drill-level-filter');
  if (levelFilter) {
    levelFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-level]');
      if (!btn) return;
      currentLevel = btn.dataset.level;
      try { localStorage.setItem('dictation-drill-level', currentLevel); } catch {}
      // Update button styles
      levelFilter.querySelectorAll('button').forEach(b => {
        b.className = `btn btn-sm ${b.dataset.level === currentLevel ? 'btn-primary' : 'btn-secondary'}`;
      });
      // Regenerate prompt
      const newPrompt = buildPromptText(currentLevel);
      card.querySelector('#drill-prompt').value = newPrompt;
    });
  }

  // Toggle prompt area
  card.querySelector('#btn-gen-prompt').addEventListener('click', () => {
    const area = card.querySelector('#prompt-area');
    area.style.display = area.style.display === 'none' ? 'block' : 'none';
  });

  // Copy prompt
  card.querySelector('#btn-copy-prompt').addEventListener('click', async () => {
    const text = card.querySelector('#drill-prompt').value;
    try {
      await navigator.clipboard.writeText(text);
      showToast('提示词已复制');
    } catch {
      showToast('复制失败，请手动复制');
    }
  });

  // Start drill
  card.querySelector('#btn-start-drill').addEventListener('click', () => {
    const text = card.querySelector('#drill-text').value.trim();
    if (!text) { showToast('请粘贴 LLM 返回的文章'); return; }
    const sentences = splitSentences(text);
    if (!sentences.length) { showToast('未能识别到句子'); return; }
    drillSession = {
      title: '专项训练',
      text,
      sentences,
      currentIdx: 0,
      results: [] // { sentence, correctIndices, wrongIndices }
    };
    setPage('drill-practice');
  });
}

function renderDrillPractice(container) {
  if (!drillSession) { setPage('drill'); return; }
  const idx = drillSession.currentIdx;
  if (idx >= drillSession.sentences.length) {
    // Finish drill, update mistakes
    finishDrill();
    return;
  }

  const sentence = drillSession.sentences[idx];
  const words = sentence.trim().split(/\s+/);

  const card = document.createElement('div');
  card.className = 'practice-card';
  card.innerHTML = `
    <div class="practice-header">
      <div>
        <div class="practice-title">专项训练</div>
        <div class="practice-subtitle">第 ${idx + 1} / ${drillSession.sentences.length} 句 · 仅一次机会</div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${Math.round((idx / drillSession.sentences.length) * 100)}%"></div>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-sm btn-secondary btn-icon" onclick="setPage('drill')" title="退出">${ICONS.x}</button>
      </div>
    </div>
    <div class="player-bar">
      <button class="player-btn" id="btn-play" title="播放">
        <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <svg class="pause-icon" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </button>
      <div class="speed-control">
        <label>语速</label>
        <input type="range" id="rate" min="0.5" max="1.5" step="0.1" value="1">
        <span class="speed-value" id="rate-value">1.0x</span>
      </div>
      ${buildVoiceToggleHTML()}
    </div>
    <div class="dictation-area">
      <div class="form-group" style="margin-bottom:0">
        <label style="margin-bottom:10px">请听写整句（只有一次机会）</label>
        <textarea class="dictation-full" id="drill-input" placeholder="听完后在此输入完整句子..."></textarea>
        <div class="keyboard-hint"><kbd>Enter</kbd> 开始输入 · <kbd>Space</kbd> 播放/暂停 · <kbd>Shift</kbd>+<kbd>Space</kbd> 在输入框内播放/暂停 · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 提交检查</div>
      </div>
    </div>
    <div class="action-bar">
      <button class="btn btn-primary" id="btn-drill-check">${ICONS.check}提交核对</button>
    </div>
  `;
  container.appendChild(card);

  // Play
  const playBtn = card.querySelector('#btn-play');
  const rateInput = card.querySelector('#rate');
  const rateValue = card.querySelector('#rate-value');
  let isPlaying = false;

  rateInput.addEventListener('input', () => {
    rateValue.textContent = parseFloat(rateInput.value).toFixed(1) + 'x';
  });

  function setPlaying(playing) {
    isPlaying = playing;
    playBtn.classList.toggle('playing', playing);
  }

  function togglePlay() {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      const rate = parseFloat(rateInput.value);
      const ok = speak(sentence, rate, () => { if (isPlaying) setPlaying(false); });
      if (!ok) { showToast('当前浏览器不支持语音播放'); return; }
      setPlaying(true);
    }
  }
  currentTogglePlay = togglePlay;
  playBtn.addEventListener('click', togglePlay);

  // Keyboard shortcuts
  const input = card.querySelector('#drill-input');
  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      doDrillCheck();
    }
    if (e.code === 'Space' && e.shiftKey) {
      e.preventDefault();
      togglePlay();
    }
  });
  // Global play shortcut for drill-practice
  const oldGlobalKeydown = document.onkeydown;

  function doDrillCheck() {
    const fullText = input.value.trim();
    if (!fullText) { showToast('请输入内容'); return; }
    const userWords = fullText.split(/\s+/);
    const matchedSet = diffWords(words, userWords);
    const correctIndices = [];
    const wrongIndices = [];
    words.forEach((_, i) => {
      if (matchedSet.has(i)) correctIndices.push(i); else wrongIndices.push(i);
    });

    drillSession.results.push({ sentence, correctIndices, wrongIndices });

    // Immediately update mistake counts for this sentence
    const correctWords = correctIndices.map(i => words[i]);
    const wrongWords = wrongIndices.map(i => words[i]);
    updateMistakeFromDrill(correctWords, wrongWords);

    // Show result inline
    const dictationArea = card.querySelector('.dictation-area');
    const line = document.createElement('div');
    line.className = 'words-line';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      if (matchedSet.has(i)) {
        span.className = 'word-lock';
        span.textContent = w;
      } else {
        span.style.cssText = 'display:inline-flex;align-items:center;padding:8px 14px;background:var(--danger-soft);border:1.5px solid rgba(244,63,94,0.3);color:var(--danger);border-radius:var(--radius-sm);font-size:15px;font-weight:600;';
        span.textContent = w;
      }
      line.appendChild(span);
    });
    dictationArea.innerHTML = '';
    dictationArea.appendChild(line);

    // Disable input and button
    card.querySelector('#btn-drill-check').disabled = true;
    input.disabled = true;
    window.speechSynthesis.cancel();
    setPlaying(false);
    currentTogglePlay = null;

    // Auto advance after delay
    if (wrongIndices.length === 0) {
      showToast('全对！');
    } else {
      showToast(`${correctIndices.length}/${words.length} 正确`);
    }

    setTimeout(() => {
      drillSession.currentIdx += 1;
      renderMain();
    }, 1500);
  }

  card.querySelector('#btn-drill-check').addEventListener('click', doDrillCheck);

  // Voice picker
  attachVoiceToggleListeners(card);
}

function finishDrill() {
  // Mistakes are updated sentence-by-sentence in doDrillCheck
  const totalCorrect = drillSession.results.reduce((s, r) => s + r.correctIndices.length, 0);
  const totalWords = drillSession.results.reduce((s, r) => s + r.sentence.trim().split(/\s+/).length, 0);
  const accuracy = totalWords ? Math.round(totalCorrect / totalWords * 100) : 0;

  const main = document.getElementById('main');
  main.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card result-card';
  card.innerHTML = `
    <h2>${accuracy === 100 ? '🎉 专项训练完成' : '专项训练完成'}</h2>
    <p>薄弱词汇已更新，正确率 ${accuracy}%</p>
    <div class="result-stats">
      <div class="stat-item"><div class="stat-value">${totalCorrect}</div><div class="stat-label">正确词</div></div>
      <div class="stat-item"><div class="stat-value">${totalWords - totalCorrect}</div><div class="stat-label">错误词</div></div>
      <div class="stat-item"><div class="stat-value">${accuracy}%</div><div class="stat-label">正确率</div></div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="setPage('drill')">${ICONS.target}再来一轮</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}返回</button>
    </div>
  `;
  main.appendChild(card);
  drillSession = null;
  currentPage = 'drill-result'; // Not a real page, just for display
}

function renderHelp(container) {
  const steps = [
    { num: '1', title: '选择或创建练习', desc: '从资料库按 CEFR 级别挑选课程，或粘贴自己的英文文本创建练习。' },
    { num: '2', title: '播放与听写', desc: '点击播放按钮听句子，在输入框中写下听到的内容，可调整语速。' },
    { num: '3', title: '提交检查', desc: '首次输入整句提交，系统用 LCS 算法对齐，正确单词锁定，错误变为空格。' },
    { num: '4', title: '逐空补全', desc: '在空格里填入正确单词，再次提交，直到全对自动进入下一句。' },
    { num: '5', title: '查看辅助', desc: '点击「显示原文」可查看完整原文、句子翻译及逐词翻译。' },
    { num: '6', title: '进度管理', desc: '进度自动保存在浏览器中，关闭页面后可继续。可自由切换上下句。' }
  ];

  const card = document.createElement('div');
  card.className = 'card';
  let html = `<div class="card-title">使用帮助</div>
    <div class="card-desc">简单几步，开始高效的英语听写训练。</div>
    <div style="display:grid;gap:16px">`;

  steps.forEach(s => {
    html += `<div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">${s.num}</div>
      <div>
        <div style="font-weight:600;font-size:15px;margin-bottom:3px;color:var(--text)">${s.title}</div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.6">${s.desc}</div>
      </div>
    </div>`;
  });

  html += `</div>`;
  card.innerHTML = html;
  container.appendChild(card);
}

// Init
setPage('home');
