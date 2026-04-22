const STORAGE_KEY = 'dictation-app-v1';

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }

function splitSentences(text) {
  const parts = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [];
  return parts.map(s => s.trim()).filter(s => s.length > 0);
}

function normalizeWord(word) {
  return word.trim().toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
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
  nav.style.display = (page === 'home' || page === 'create' || page === 'help') ? 'flex' : 'none';
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
  else if (currentPage === 'help') renderHelp(main);
}

function renderHome(container) {
  const sessions = loadSessions();
  const card = document.createElement('div');
  card.className = 'card';
  if (sessions.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <h3>暂无练习</h3>
        <p>点击下方按钮创建你的第一个英语听写练习。</p>
        <button class="btn btn-primary" onclick="setPage('create')" style="margin-top:12px">新建练习</button>
      </div>`;
  } else {
    let html = `<h2 style="margin-bottom:12px;font-size:18px">已有练习</h2>
      <div class="session-list">`;
    sessions.forEach(s => {
      const progress = s.progress || {};
      const done = (progress.completedSentences || []).filter(Boolean).length;
      const total = s.sentences.length;
      const percent = total ? Math.round(done / total * 100) : 0;
      html += `<div class="session-item">
        <div class="session-info">
          <div class="session-title">${escapeHtml(s.title || '未命名练习')}</div>
          <div class="session-meta">共 ${total} 句 · 进度 ${percent}% · ${new Date(s.createdAt).toLocaleString()}</div>
        </div>
        <div class="session-actions">
          <button class="btn btn-primary" data-action="continue" data-id="${s.id}">继续</button>
          <button class="btn btn-secondary" data-action="restart" data-id="${s.id}">重练</button>
          <button class="btn btn-danger" data-action="delete" data-id="${s.id}">删除</button>
        </div>
      </div>`;
    });
    html += `</div>
    <div style="margin-top:16px">
      <button class="btn btn-primary" onclick="setPage('create')">新建练习</button>
    </div>`;
    card.innerHTML = html;
  }
  container.appendChild(card);

  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'delete') {
      if (confirm('确定删除此练习吗？')) {
        saveSessions(loadSessions().filter(x => x.id !== id));
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
    <h2 style="margin-bottom:12px;font-size:18px">新建练习</h2>
    <div class="form-group">
      <label>标题（可选）</label>
      <input type="text" id="create-title" placeholder="例如：新概念英语 Lesson 1">
    </div>
    <div class="form-group">
      <label>英文原文</label>
      <textarea id="create-text" placeholder="请输入一段英文，系统会自动按句子切分..."></textarea>
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="btn-create">生成练习</button>
      <button class="btn btn-secondary" onclick="setPage('home')">取消</button>
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

// 基于 LCS 的单词级 diff，返回原文中匹配上的索引集合
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

function speak(text, rate = 1.0, onEnd) {
  if (!window.speechSynthesis) { return false; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
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
  // 兼容旧数据结构
  let locked = [];
  let gapDrafts = {};
  const hasHistory = Array.isArray(state.lockedIndices);
  if (hasHistory) {
    locked = state.lockedIndices;
    gapDrafts = state.gapDrafts || {};
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="practice-header">
      <div class="progress-info">第 ${idx + 1} / ${session.sentences.length} 句</div>
      <div class="actions-row">
        <button class="btn btn-secondary" id="btn-prev" ${idx <= 0 ? 'disabled' : ''}>上一句</button>
        <button class="btn btn-secondary" id="btn-next" ${idx >= session.sentences.length - 1 ? 'disabled' : ''}>下一句</button>
        <button class="btn btn-secondary" onclick="setPage('home')">首页</button>
      </div>
    </div>
    <div class="player-bar">
      <button class="btn btn-primary" id="btn-play">▶ 播放</button>
      <label class="speed">语速 <input type="range" id="rate" min="0.5" max="1.5" step="0.1" value="1"></label>
      <span id="play-status" style="font-size:13px;color:#64748b"></span>
    </div>
    <div style="margin-bottom:16px">
      <div id="dictation-area"></div>
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="btn-check">提交检查</button>
      <button class="btn btn-secondary" id="btn-show-original">显示原文</button>
      <button class="btn btn-secondary" id="btn-skip">跳过本句</button>
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
          <div id="word-trans" style="margin-top:8px;font-size:14px;color:#334155"></div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(card);

  const dictationArea = card.querySelector('#dictation-area');
  if (!hasHistory) {
    dictationArea.innerHTML = `
      <div class="form-group">
        <label>请听写整句</label>
        <textarea id="full-input" placeholder="听完后在此输入完整句子..."></textarea>
      </div>
    `;
  } else {
    const line = document.createElement('div');
    line.className = 'words-line';
    const lockedSet = new Set(locked);
    words.forEach((w, i) => {
      if (lockedSet.has(i)) {
        const span = document.createElement('span');
        span.className = 'word-lock';
        span.textContent = w;
        line.appendChild(span);
      } else {
        const input = document.createElement('input');
        input.className = 'word-gap';
        input.dataset.srcIndex = i;
        input.value = gapDrafts[i] || '';
        input.size = Math.max(3, w.length);
        input.placeholder = '?';
        line.appendChild(input);
      }
    });
    dictationArea.appendChild(line);
  }

  // Play / Stop
  const playBtn = card.querySelector('#btn-play');
  const playStatus = card.querySelector('#play-status');
  let isPlaying = false;
  function setPlaying(playing) {
    isPlaying = playing;
    playBtn.textContent = playing ? '⏹ 停止' : '▶ 播放';
    playStatus.textContent = playing ? '播放中...' : '';
  }
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      const rate = parseFloat(card.querySelector('#rate').value);
      const ok = speak(sentence, rate, () => {
        if (isPlaying) setPlaying(false);
      });
      if (!ok) { showToast('当前浏览器不支持语音播放'); return; }
      setPlaying(true);
    }
  });

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
      wordTrans.textContent = '查询中...';
      const t = await translateText(w);
      wordTrans.innerHTML = `<strong>${escapeHtml(w)}</strong>：${escapeHtml(t || '（暂无翻译）')}`;
    });
    wordList.appendChild(chip);
  });

  // Check / Submit
  card.querySelector('#btn-check').addEventListener('click', () => {
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
        const si = +inp.dataset.srcIndex;
        const val = inp.value.trim();
        if (normalizeWord(val) === normalizeWord(words[si])) {
          lockedSet.add(si);
          added++;
        } else {
          newDrafts[si] = ''; // 错误的清空，继续要求填写
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
      progress.sentenceStates[idx] = { lockedIndices: newLocked, gapDrafts: newDrafts };
      updateSessionProgress(activeSessionId, progress);
      renderMain();
      showToast(`对了 ${newLocked.length}/${words.length} 个词，继续补全`);
    }
  });

  // Skip
  card.querySelector('#btn-skip').addEventListener('click', () => {
    if (confirm('确定跳过本句吗？进度将标记为跳过。')) {
      markSentenceDone(progress, idx);
      updateSessionProgress(activeSessionId, progress);
      renderMain();
    }
  });
}

function saveCurrentDraft(progress, idx, words, card) {
  if (!card) return;
  const state = progress.sentenceStates[idx];
  if (!state || !Array.isArray(state.lockedIndices)) return;
  const inputs = card.querySelectorAll('.word-gap');
  const drafts = {};
  inputs.forEach(inp => {
    const i = +inp.dataset.srcIndex;
    drafts[i] = inp.value.trim();
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
  const card = document.createElement('div');
  card.className = 'card result-summary';
  card.innerHTML = `
    <h2>练习完成</h2>
    <p>已完成 ${done} / ${total} 句</p>
    <div class="actions-row" style="justify-content:center">
      <button class="btn btn-primary" id="btn-restart">再次练习</button>
      <button class="btn btn-secondary" onclick="setPage('home')">返回首页</button>
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

function renderHelp(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2 style="margin-bottom:12px;font-size:18px">帮助</h2>
    <p style="margin-bottom:8px">1. 点击“新建练习”输入英文原文，系统会自动分句。</p>
    <p style="margin-bottom:8px">2. 播放按钮朗读当前句子，可调整语速。</p>
    <p style="margin-bottom:8px">3. 首次听写输入整句，提交后系统会自动对齐单词，正确的词锁定，缺失或错误的词变成空格，分别填入即可。</p>
    <p style="margin-bottom:8px">4. 点击“显示原文”可查看原文、句子翻译及单词翻译。</p>
    <p style="margin-bottom:8px">5. 进度自动保存，退出后下次可继续。</p>
    <p>6. 再次练习会清空当前进度重新开始。</p>
  `;
  container.appendChild(card);
}

// Init
setPage('home');
