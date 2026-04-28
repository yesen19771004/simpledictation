const LANG_PREFIX = 'zh_';
const STORAGE_KEY = LANG_PREFIX + 'dictation-app-v1';
const PRESET_KEY = LANG_PREFIX + 'dictation-preset-imported-v1';
const LIBRARIES_KEY = LANG_PREFIX + 'dictation-libraries-v1';

// ===== 界面语言（i18n）=====
const DISPLAY_LANG_KEY = LANG_PREFIX + 'display-lang';
let displayLang = (() => { try { return localStorage.getItem(DISPLAY_LANG_KEY) || 'zh'; } catch { return 'zh'; } })();

const LANG_STRINGS = {
  zh: {
    home: '我的听写',
    library: '资料库',
    drill: '专项训练',
    help: '帮助',
    newDictation: '新建听写',
    emptyTitle: '开始你的第一次听写',
    emptyDesc: '从资料库选择适合你的课程，或者粘贴自己的中文文本开始练习。',
    browseLibrary: '浏览资料库',
    importFromLibrary: '从资料库导入',
    importBackup: '已有备份？可导入历史数据',
    importMyData: '导入我的数据',
    myDictations: '我的听写',
    completed: '已完成',
    continue: '继续',
    restart: '重练',
    delete: '删除',
    newDictationBtn: '新建听写',
    myData: '我的数据',
    myDataDesc: '导出、导入或清空你的听写记录和错误数据。',
    exportMyData: '导出我的数据',
    clearData: '清空数据',
    submitCheck: '提交检查',
    playPause: '播放/暂停',
    startInput: '开始输入',
    inInputField: '在输入框内',
    showOriginal: '显示原文',
    originalText: '原文',
    translation: '翻译',
    enter: 'Enter',
    space: 'Space',
    shift: 'Shift',
    ctrl: 'Ctrl',
    createDictation: '新建听写',
    createDictationDesc: '输入中文原文，系统会自动按句切分，生成听写练习。',
    titleLabel: '标题',
    titlePlaceholder: '给这次练习起个名字',
    textLabel: '中文原文',
    textPlaceholder: '在此粘贴或输入中文文本……',
    generateBtn: '生成练习',
    fullMatch: '全对！进入下一句',
    correctNofM: (correct, total) => `对了 ${correct}/${total} 个字符，继续补全`,
    continueFill: '继续补全',
    pleaseInput: '请输入内容',
    resultTitle: '练习完成！',
    resultDesc: '所有句子均已通过，表现不错！',
    accuracy: '正确率',
    sentencesCount: '句子数',
    mistakes: '错误',
    mistakesRecorded: '错误记录',
    backToHome: '返回首页',
    prevSentence: '上一句',
    nextSentence: '下一句',
    playing: '播放中…',
    selectLevel: '选择级别',
    startFromLibrary: '从资料库开始',
    tapToStart: '点击开始',
    clickWordForTrans: '点击单词查看释义',
    speedLabel: '语速',
    voiceLabel: '语音',
    confirmDelete: '确定删除此练习吗？',
    confirmDeleteDrill: '确定删除此专项训练吗？',
    confirmClearAll: '确定清空所有数据吗？\n\n这将删除：\n· 所有听写记录\n· 所有错误记录\n· 所有资料库导入映射\n\n此操作不可恢复，请确认已导出备份。',
    deleted: '已删除',
    clickSelectBatchDelete: '（点击选中，批量删除）',
    mistakeCount: n => `出错 ${n} 次`,
    dataCleared: '数据已清空',
    importFailed: msg => `导入失败：${msg}`,
    importSuccess: '导入成功',
    copied: '已复制',
    copyFailed: '复制失败',
    exportDesc: '导出我的听写记录和错题数据',
    notSupported: '当前浏览器不支持语音播放',
    voiceNotReady: '语音引擎尚未就绪',
    libraryImport: '导入资料库',
    libraryImportDesc: '选择 JSON 格式的资料库文件导入',
    importFile: '导入',
    switchLibrary: '切换资料库',
    defaultLibrary: '默认资料库',
    deleteLibrary: '删除资料库',
    deleteLibraryConfirm: '确定删除此资料库吗？删除后不可恢复。',
    libraryDeleted: '资料库已删除',
    lessonProgress: '进度',
    notStarted: '未开始',
    completedShort: '已完成',
    drillTitle: '专项训练',
    drillDesc: '在常规听写练习中，系统会自动记录你听写出错的词汇。积累足够错误记录后，来这里进行专项突破。',
    goToLibrary: '去资料库',
    goToLibraryDrill: '去资料库',
    drillPlaceholder: '暂无错误记录，完成一些听写后再来。',
    drillGenerate: '生成提示词',
    drillStart: '开始专项训练',
    drillRemaining: '个待训练词汇',
    drillWrongWords: '个出错词汇',
    drillSelectLevel: '选择难度级别',
    drillCopyPrompt: '复制提示词',
    drillYourArticle: '你的文章',
    drillYourArticlePlaceholder: '将 LLM 生成的文章粘贴到这里……',
    drillNoMistakes: '暂无错误记录',
    drillToday: '今天',
    drillYesterday: '昨天',
    drillDaysAgo: n => `${n} 天前`,
    helpTitle: '帮助',
    helpHowTo: '如何使用',
    helpStep1: '从资料库选择一篇文章，或输入自己的中文文本创建听写',
    helpStep2: '播放句子，在输入框中写下你听到的内容',
    helpStep3: '提交检查，正确的字符自动锁定，错误的变为空格',
    helpStep4: '补全空格后再次提交，全对自动进入下一句',
    helpShortcuts: '快捷键',
    helpEnter: '聚焦到输入框',
    helpSpace: n => `${n} 播放/暂停`,
    helpShiftSpace: '在输入框内播放/暂停',
    helpCtrlEnter: '提交检查',
    langSwitch: 'English',
    backToLangs: 'English',
    language: '语言',
    voiceMale: '男声',
    voiceFemale: '女声',
    yourArticle: '你的文章',
    generatePrompt: '生成提示词',
    startPractice: '开始练习',
    copyPrompt: '复制提示词',
    selectDifficulty: '选择难度',
    promptCopied: '提示词已复制到剪贴板',
    promptCopyFailed: '复制失败，请手动复制',
    score: '得分',
    correctCount: '正确数',
    totalCount: '总数',
    imported: '资料库',
    cancel: '取消',
    noSentences: '未能识别到句子',
    prevTitle: '上一句',
    nextTitle: '下一句',
    backTitle: '返回',
    playTitle: '播放',
    skipBtn: '跳过',
    loading: '加载中...',
    fullInputPlaceholder: '听完后在此输入完整句子...',
    listenFullSentence: '请听写整句',
    confirmSkip: '确定跳过本句吗？进度将标记为跳过。',
    translateFailed: '翻译失败',
    noTranslation: '（暂无翻译）',
    fullyComplete: '全部完成',
    practiceComplete: '练习完成',
    completedLabel: '已完成',
    totalSentences: '总句数',
    completionRate: '完成率',
    practiceAgain: '再次练习',
    importLibrary: '导入资料库',
    libraryLabel: '资料库：',
    allLevels: '全部',
    noData: '该级别暂无数据',
    startPractice: '开始练习',
    resetBtn: '重置',
    noWordsToTrain: '暂无待训练词汇',
    wordsToTrain: '个待训练词汇',
    selectDifficulty: '选择文章难度',
    pasteArticle: '粘贴 LLM 返回的文章',
    pasteArticlePlaceholder: '将大语言模型生成的文章粘贴到这里...',
    startDrill: '开始专项训练',
    selectAll: '全选',
    deselectAll: '取消全选',
    deleteSelected: '删除选中',
    exitTitle: '退出',
    drillOnlyOnce: '仅一次机会',
    drillComplete: '专项训练完成',
    correctWords: '正确词',
    wrongWords: '错误词',
    correctRate: '正确率',
    drillAgain: '再来一轮',
    sentenceProgress: (idx, total, pct) => `第 ${idx}/${total} 句 · 已完成 ${pct}%`,
    drillProgress: (idx, total) => `第 ${idx}/${total} 句 · 仅一次机会`,
    countLessons: n => `${n} 篇`,
    progressPercent: n => `进度 ${n}%`,
    totalSentencesShort: n => `共 ${n} 句`,
    selectedCount: n => `已选 ${n} 个`,
    confirmDeleteSelected: n => `确定删除选中的 ${n} 个错误记录吗？`,
    confirmDeleteLibrary: name => `确定删除资料库 "${name}" 吗？相关的练习映射将被清理。`,
    drillResultDesc: pct => `薄弱词汇已更新，正确率 ${pct}%`,
    promptLabel: n => `LLM 提示词（包含 ${n} 个错词）`,
    promptLabelTruncated: (n, total) => `LLM 提示词（已从 ${total} 个错词中筛选出 ${n} 个）`,
    currentLibrary: (name, count) => `当前：${name} · 共 ${count} 篇`,
  },
  en: {
    home: 'My Dictations',
    library: 'Library',
    drill: 'Drill',
    help: 'Help',
    newDictation: 'New Dictation',
    emptyTitle: 'Start Your First Dictation',
    emptyDesc: 'Pick a lesson from the library, or paste your own Chinese text to practice.',
    browseLibrary: 'Browse Library',
    importFromLibrary: 'Import from Library',
    importBackup: 'Have a backup? Import your data',
    importMyData: 'Import My Data',
    myDictations: 'My Dictations',
    completed: 'Completed',
    continue: 'Continue',
    restart: 'Restart',
    delete: 'Delete',
    newDictationBtn: 'New Dictation',
    myData: 'My Data',
    myDataDesc: 'Export, import or clear your dictation records and mistake data.',
    exportMyData: 'Export My Data',
    clearData: 'Clear Data',
    submitCheck: 'Submit & Check',
    playPause: 'Play/Pause',
    startInput: 'Start typing',
    inInputField: 'in input field',
    showOriginal: 'Show Original',
    originalText: 'Original',
    translation: 'Translation',
    enter: 'Enter',
    space: 'Space',
    shift: 'Shift',
    ctrl: 'Ctrl',
    createDictation: 'New Dictation',
    createDictationDesc: 'Paste Chinese text, the system will split it into sentences automatically.',
    titleLabel: 'Title',
    titlePlaceholder: 'Name this exercise',
    textLabel: 'Chinese Text',
    textPlaceholder: 'Paste or type Chinese text here...',
    generateBtn: 'Generate',
    fullMatch: 'All correct! Moving to next sentence.',
    correctNofM: (correct, total) => `${correct}/${total} correct, fill in the rest`,
    continueFill: 'fill in the rest',
    pleaseInput: 'Please enter some text',
    resultTitle: 'Practice Complete!',
    resultDesc: 'All sentences passed. Great job!',
    accuracy: 'Accuracy',
    sentencesCount: 'Sentences',
    mistakes: 'Mistakes',
    mistakesRecorded: 'Mistakes',
    backToHome: 'Back to Home',
    prevSentence: 'Previous',
    nextSentence: 'Next',
    playing: 'Playing...',
    selectLevel: 'Select Level',
    startFromLibrary: 'Start from Library',
    tapToStart: 'Tap to start',
    clickWordForTrans: 'Click a word for translation',
    speedLabel: 'Speed',
    voiceLabel: 'Voice',
    confirmDelete: 'Delete this exercise?',
    confirmDeleteDrill: 'Delete this drill?',
    confirmClearAll: 'Clear all data?\n\nThis will delete:\n· All dictation records\n· All mistake records\n· All library import mappings\n\nThis cannot be undone. Please export a backup first.',
    deleted: 'Deleted',
    clickSelectBatchDelete: '(Click to select, batch delete)',
    mistakeCount: n => `Wrong ${n} times`,
    dataCleared: 'Data cleared',
    importFailed: msg => `Import failed: ${msg}`,
    importSuccess: 'Import successful',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    exportDesc: 'Export my dictation records and mistake data',
    notSupported: 'Speech synthesis not supported in this browser',
    voiceNotReady: 'Voice engine not ready yet',
    libraryImport: 'Import Library',
    libraryImportDesc: 'Select a JSON library file to import',
    importFile: 'Import',
    switchLibrary: 'Switch Library',
    defaultLibrary: 'Default Library',
    deleteLibrary: 'Delete Library',
    deleteLibraryConfirm: 'Delete this library? This cannot be undone.',
    libraryDeleted: 'Library deleted',
    lessonProgress: 'Progress',
    notStarted: 'Not started',
    completedShort: 'Done',
    drillTitle: 'Drill',
    drillDesc: 'The system tracks words you get wrong during dictation. When you have enough, come here for targeted practice.',
    goToLibrary: 'Go to Library',
    goToLibraryDrill: 'Go to Library',
    drillPlaceholder: 'No mistakes recorded yet. Complete some dictations first.',
    drillGenerate: 'Generate Prompt',
    drillStart: 'Start Drill',
    drillRemaining: 'words to train',
    drillWrongWords: 'wrong words',
    drillSelectLevel: 'Select Difficulty',
    drillCopyPrompt: 'Copy Prompt',
    drillYourArticle: 'Your Article',
    drillYourArticlePlaceholder: 'Paste the article generated by LLM here...',
    drillNoMistakes: 'No mistakes recorded',
    drillToday: 'Today',
    drillYesterday: 'Yesterday',
    drillDaysAgo: n => `${n} days ago`,
    helpTitle: 'Help',
    helpHowTo: 'How to Use',
    helpStep1: 'Pick a lesson from the library or paste your own Chinese text',
    helpStep2: 'Listen to the sentence and type what you hear',
    helpStep3: 'Submit to check, correct characters lock, wrong ones become blanks',
    helpStep4: 'Fill in the blanks and re-submit until all correct',
    helpShortcuts: 'Keyboard Shortcuts',
    helpEnter: 'Focus input field',
    helpSpace: n => `${n} Play/Pause`,
    helpShiftSpace: 'Play/Pause while in input field',
    helpCtrlEnter: 'Submit and check',
    langSwitch: '中文',
    backToLangs: '中文',
    language: 'Language',
    voiceMale: 'Male',
    voiceFemale: 'Female',
    yourArticle: 'Your Article',
    generatePrompt: 'Generate Prompt',
    startPractice: 'Start Practice',
    copyPrompt: 'Copy Prompt',
    selectDifficulty: 'Select Difficulty',
    promptCopied: 'Prompt copied to clipboard',
    promptCopyFailed: 'Copy failed, please copy manually',
    score: 'Score',
    correctCount: 'Correct',
    totalCount: 'Total',
    imported: 'Library',
    cancel: 'Cancel',
    noSentences: 'No sentences found',
    prevTitle: 'Previous',
    nextTitle: 'Next',
    backTitle: 'Back',
    playTitle: 'Play',
    skipBtn: 'Skip',
    loading: 'Loading...',
    fullInputPlaceholder: 'Type the full sentence here after listening...',
    listenFullSentence: 'Write the full sentence',
    confirmSkip: 'Skip this sentence? Progress will be marked as skipped.',
    translateFailed: 'Translation failed',
    noTranslation: '(No translation)',
    fullyComplete: 'All Complete',
    practiceComplete: 'Practice Complete',
    completedLabel: 'Completed',
    totalSentences: 'Total Sentences',
    completionRate: 'Completion Rate',
    practiceAgain: 'Practice Again',
    importLibrary: 'Import Library',
    libraryLabel: 'Library:',
    allLevels: 'All',
    noData: 'No data for this level',
    startPractice: 'Start',
    resetBtn: 'Reset',
    noWordsToTrain: 'No words to train',
    wordsToTrain: 'words to train',
    selectDifficulty: 'Select Difficulty',
    pasteArticle: 'Paste LLM Article',
    pasteArticlePlaceholder: 'Paste the article generated by LLM here...',
    startDrill: 'Start Drill',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    exitTitle: 'Exit',
    drillOnlyOnce: 'One chance only',
    drillComplete: 'Drill Complete',
    correctWords: 'Correct',
    wrongWords: 'Wrong',
    correctRate: 'Accuracy',
    drillAgain: 'Drill Again',
    sentenceProgress: (idx, total, pct) => `Sentence ${idx}/${total} · ${pct}% done`,
    drillProgress: (idx, total) => `Sentence ${idx}/${total} · One chance only`,
    countLessons: n => `${n} lessons`,
    progressPercent: n => `Progress ${n}%`,
    totalSentencesShort: n => `${n} sentences`,
    selectedCount: n => `${n} selected`,
    confirmDeleteSelected: n => `Delete ${n} selected mistake records?`,
    confirmDeleteLibrary: name => `Delete library "${name}"? Related exercise mappings will be removed.`,
    drillResultDesc: pct => `Weak words updated, accuracy ${pct}%`,
    promptLabel: n => `LLM Prompt (${n} words)`,
    promptLabelTruncated: (n, total) => `LLM Prompt (${n} of ${total} words selected)`,
    currentLibrary: (name, count) => `Current: ${name} · ${count} lessons`,
  }
};

function t(key, ...args) {
  const s = LANG_STRINGS[displayLang][key];
  if (typeof s === 'function') return s(...args);
  return s !== undefined ? s : key;
}

function setDisplayLang(lang) {
  displayLang = lang;
  try { localStorage.setItem(DISPLAY_LANG_KEY, lang); } catch {}
  updateUILabels();
  renderMain();
}

function updateUILabels() {
  // 更新导航标签
  const nav = document.getElementById('nav-tabs');
  if (nav) {
    const map = { home: 'home', library: 'library', drill: 'drill', help: 'help' };
    nav.querySelectorAll('button').forEach(b => {
      const key = map[b.dataset.page];
      if (key) b.textContent = t(key);
    });
  }
  // 更新显示语言按钮
  const btn = document.getElementById('btn-display-lang');
  if (btn) btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' + t('langSwitch');
}

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
    return { id: 'default', name: t('defaultLibrary'), type: 'default', lessons: PRESET_LESSONS };
  }
  const lib = data.libraries.find(l => l.id === data.activeLibraryId);
  if (lib) return { ...lib, type: 'imported' };
  return { id: 'default', name: t('defaultLibrary'), type: 'default', lessons: PRESET_LESSONS };
}
function getAllLibraries() {
  const data = loadLibraries();
  return [
    { id: 'default', name: t('defaultLibrary'), type: 'default', lessons: PRESET_LESSONS },
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
const MISTAKES_KEY = LANG_PREFIX + 'dictation-mistakes-v1';

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
  const mode = confirm(t('importMode'));
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
  // 中文句末标点：。！？； 也支持英文标点：.!?
  const raw = text.split(/(?<=[。！？；!?])\s*/).filter(s => s.trim().length > 0);

  if (raw.length <= 1) {
    return [text.trim()];
  }

  // 合并过短片段（比如引号内的句号导致的分割）
  const result = [];
  for (const p of raw) {
    const t = p.trim();
    if (!t) continue;
    if (result.length > 0) {
      const lastP = result[result.length - 1];
      if (t.length < 10 && /["'']$/.test(lastP)) {
        result[result.length - 1] = lastP + t;
        continue;
      }
    }
    result.push(t);
  }
  return result.length > 0 ? result : [text.trim()];
}

// 中文数字映射
const CN_NUM_WORDS = {
  '零': '0', '〇': '0', '○': '0',
  '一': '1', '二': '2', '三': '3', '四': '4',
  '五': '5', '六': '6', '七': '7', '八': '8', '九': '9',
  '十': '10', '百': '100', '千': '1000'
};

function normalizeWord(word) {
  let w = word.trim();
  if (CN_NUM_WORDS[w] !== undefined) return CN_NUM_WORDS[w];
  if (/^\d+$/.test(w)) return w;
  // 中文：不做标点剥离，原样比对（用户漏写标点会留空待补）
  return w;
}

// 尝试从 tokens[start] 开始解析一个数字短语（如 "nineteen eighty-five" → "1985"）
// 返回 { value: string, consumed: number } 或 null
// 中文数字短语解析（简化版本）
function tryParseNumberPhrase(tokens, start) {
  // 对于中文听写，数字处理简化：单字符数字映射由 normalizeWord 处理
  // 这里不做复杂短语解析，直接返回 null 让每个字符单独处理
  return null;
}

function normalizeTokensWithMap(tokens) {
  return { tokens, map: tokens.map((_, i) => [i, i]) };
}

function stripPunctuation(word) {
  // 保留中英文和数字，仅剥离首尾标点
  return word.trim().replace(/^[^\w\u4e00-\u9fff]+|[^\w\u4e00-\u9fff]+$/g, '');
}

// 中文分词：按字符分割（保留标点）
function tokenizeChinese(text) {
  if (!text) return [];
  // 使用 Array.from 正确处理 Unicode 代理对
  const chars = Array.from(text.trim());
  return chars.filter(c => c.trim().length > 0);
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
  try { localStorage.setItem(LANG_PREFIX + 'dictation-theme', theme); } catch {}
}
function initTheme() {
  let theme = 'light';
  try {
    const saved = localStorage.getItem(LANG_PREFIX + 'dictation-theme');
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

  // 显示语言切换
  const langBtn = document.getElementById('btn-display-lang');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setDisplayLang(displayLang === 'zh' ? 'en' : 'zh');
    });
  }

  // 初始化导航标签
  updateUILabels();
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
        const words = tokenizeChinese(session.sentences[idx]);
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
        <h3>${t('emptyTitle')}</h3>
        <p>${t('emptyDesc')}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="setPage('library')">${ICONS.bookOpen}${t('browseLibrary')}</button>
          <button class="btn btn-secondary" onclick="setPage('create')">${ICONS.pencil}${t('newDictationBtn')}</button>
          <button class="btn btn-secondary" onclick="setPage('library')">${ICONS.bookOpen}${t('importFromLibrary')}</button>
        </div>
        <div style="margin-top:20px;padding-top:20px;border-top:1.5px solid var(--border)">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:10px">${t('importBackup')}</div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-secondary" id="btn-import-data-empty">${ICONS.upload}${t('importMyData')}</button>
            <input type="file" id="data-file-input-empty" accept=".json" style="display:none">
          </div>
        </div>
      </div>`;
  } else {
    // 分组：进行中 vs 已完成
    const inProgress = [];
    const completed = [];
    sessions.forEach(s => {
      const progress = s.progress || {};
      const done = (progress.completedSentences || []).filter(Boolean).length;
      const total = s.sentences.length;
      const percent = total ? Math.round(done / total * 100) : 0;
      const item = { ...s, done, total, percent };
      if (percent === 100) completed.push(item); else inProgress.push(item);
    });

    function sessionItemHtml(s) {
      return `<div class="session-item">
        <div class="session-info">
          <div class="session-title">${escapeHtml(s.title || t('newDictation'))}<span style="font-size:12px;color:var(--text-muted);font-weight:400;margin-left:6px">${s.libraryName && s.level ? escapeHtml(s.libraryName + ' · ' + s.level) : ''}</span></div>
          <div class="session-meta">
            <span>${t('totalSentencesShort', s.total)}</span>
            <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;"></span>
            <span>${t('completedShort')} ${s.percent}%</span>
            <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;"></span>
            <span>${new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="progress-track" style="margin-top:8px;max-width:240px">
            <div class="progress-fill" style="width:${s.percent}%"></div>
          </div>
        </div>
        <div class="session-actions">
          <button class="btn btn-primary" data-action="continue" data-id="${s.id}">${ICONS.play}${t('continue')}</button>
          <button class="btn btn-secondary" data-action="restart" data-id="${s.id}">${ICONS.rotateCcw}${t('restart')}</button>
          <button class="btn btn-danger" data-action="delete" data-id="${s.id}">${ICONS.trash}${t('delete')}</button>
        </div>
      </div>`;
    }

    let html = `<div class="card-title" style="margin-bottom:16px">${t('myDictations')}</div>`;

    if (inProgress.length) {
      html += `<div class="session-list">${inProgress.map(sessionItemHtml).join('')}</div>`;
    }

    if (completed.length) {
      html += `
      <details style="margin-top:${inProgress.length ? '20' : '0'}px">
        <summary style="cursor:pointer;font-size:14px;font-weight:600;color:var(--text-secondary);padding:8px 0;user-select:none;list-style:none;display:flex;align-items:center;gap:6px">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          ${t('completed')} <span style="background:var(--bg);color:var(--success,#52c41a);padding:1px 8px;border-radius:10px;font-size:12px;font-weight:700">${completed.length}</span>
        </summary>
        <div class="session-list" style="margin-top:8px">${completed.map(sessionItemHtml).join('')}</div>
      </details>`;
    }

    html += `
    <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="setPage('create')">${ICONS.plus}${t('newDictationBtn')}</button>
      <button class="btn btn-secondary" onclick="setPage('library')">${ICONS.bookOpen}${t('importFromLibrary')}</button>
    </div>
    <div style="margin-top:28px;padding-top:24px;border-top:1.5px solid var(--border)">
      <div style="font-size:16px;font-weight:700;margin-bottom:6px;color:var(--text)">${t('myData')}</div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">${t('myDataDesc')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-export-data">${ICONS.download}${t('exportMyData')}</button>
        <button class="btn btn-secondary" id="btn-import-data">${ICONS.upload}${t('importMyData')}</button>
        <button class="btn btn-danger" id="btn-clear-data">${ICONS.trash}${t('clearData')}</button>
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
        showToast(t('importFailed', err.message || 'unknown'));
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
        showToast(t('importFailed', err.message || 'unknown'));
      }
      dataFileInputEmpty.value = '';
    });
  }

  // Clear data handler
  const clearBtn = card.querySelector('#btn-clear-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm(t('confirmClearAll'))) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MISTAKES_KEY);
        localStorage.removeItem(PRESET_KEY);
        localStorage.removeItem(LIBRARIES_KEY);
        try { localStorage.removeItem(LANG_PREFIX + 'dictation-theme'); } catch {}
        try { localStorage.removeItem(LANG_PREFIX + 'dictation-voice-name'); } catch {}
        try { localStorage.removeItem(DISPLAY_LANG_KEY); } catch {}
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
      if (confirm(t('confirmDelete'))) {
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
    <div class="card-title">${t('createDictation')}</div>
    <div class="card-desc">${t('createDictationDesc')}</div>
    <div class="form-group">
      <label>${t('titleLabel')}</label>
      <input type="text" id="create-title" placeholder="${t('titlePlaceholder')}">
    </div>
    <div class="form-group">
      <label>${t('textLabel')}</label>
      <textarea id="create-text" placeholder="${t('textPlaceholder')}"></textarea>
    </div>
    <div class="action-bar" style="padding:0;border:none;background:transparent">
      <button class="btn btn-primary" id="btn-create">${ICONS.sparkles}${t('generateBtn')}</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.x}${t('cancel')}</button>
    </div>
  `;
  container.appendChild(card);

  card.querySelector('#btn-create').addEventListener('click', () => {
    const title = document.getElementById('create-title').value.trim() || t('newDictation');
    const text = document.getElementById('create-text').value.trim();
    if (!text) { showToast(t('pleaseInput')); return; }
    const sentences = splitSentences(text);
    if (!sentences.length) { showToast(t('noSentences')); return; }
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

// 基于贪心正向匹配的字符级 diff，返回原文中匹配上的索引集合
function diffWords(src, tgt) {
  const nSrc = normalizeTokensWithMap(src);
  const nTgt = normalizeTokensWithMap(tgt);
  const matchedNorm = new Set();
  let j = 0;
  for (let i = 0; i < nSrc.tokens.length; i++) {
    // 在当前用户位置 j 往后查找匹配的字符
    let found = -1;
    for (let k = j; k < nTgt.tokens.length; k++) {
      if (normalizeWord(nSrc.tokens[i]) === normalizeWord(nTgt.tokens[k])) {
        found = k;
        break;
      }
    }
    if (found >= 0) {
      matchedNorm.add(i);
      j = found + 1;  // 用户已匹配的字符不再参与后续匹配
    }
    // 没找到：源文本的这个字符即是用户漏写的 gap
  }
  // 通过映射展开为原始 src 的索引
  const matched = new Set();
  for (const idx of matchedNorm) {
    const [start, end] = nSrc.map[idx];
    for (let k = start; k <= end; k++) matched.add(k);
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

function getChineseVoices() {
  if (!window.speechSynthesis) return [];
  return (window.speechSynthesis.getVoices() || []).filter(v =>
    v.lang && (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().startsWith('cmn'))
  );
}

function pickBestVoice() {
  const cnVoices = getChineseVoices();
  if (cnVoices.length === 0) return null;
  // 1. Microsoft Online (Natural) - 质量最好
  const msOnline = cnVoices.find(v => /microsoft/i.test(v.name) && /online|natural/i.test(v.name) && /zh-CN/i.test(v.lang));
  if (msOnline) return msOnline;
  // 2. Google 普通话
  const google = cnVoices.find(v => /google/i.test(v.name) && /mandarin|普通话|putonghua|zh/i.test(v.name + ' ' + v.lang));
  if (google) return google;
  // 3. 任意 Microsoft zh-CN 语音
  const ms = cnVoices.find(v => /microsoft/i.test(v.name) && /zh-CN/i.test(v.lang));
  if (ms) return ms;
  // 4. 任意 Google 中文语音
  const anyGoogle = cnVoices.find(v => /google/i.test(v.name));
  if (anyGoogle) return anyGoogle;
  return cnVoices[0];
}

function initVoices() {
  selectedVoice = pickBestVoice();
}

// 中文听写不需要音色选择
function buildVoiceToggleHTML() { return ''; }
function attachVoiceToggleListeners() {}

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

  const voice = pickBestVoice();
  if (voice) selectedVoice = voice;

  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  if (selectedVoice) {
    u.voice = selectedVoice;
    u.lang = selectedVoice.lang || 'zh-CN';
  } else {
    u.lang = 'zh-CN';
  }
  if (onEnd) {
    u.onend = onEnd;
    u.onerror = onEnd;
  }
  window.speechSynthesis.speak(u);
  return true;
}

let translationCache = {};
async function translateText(text, from = 'zh', to = 'en') {
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
  const words = tokenizeChinese(sentence);
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
        <div class="practice-title">${escapeHtml(session.title || t('newDictation'))}</div>
        <div class="practice-subtitle">${t('sentenceProgress', idx + 1, session.sentences.length, totalPercent)}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${totalPercent}%"></div>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-sm btn-secondary btn-icon" id="btn-prev" ${idx <= 0 ? 'disabled' : ''} title="${t('prevTitle')}">${ICONS.chevronLeft}</button>
        <button class="btn btn-sm btn-secondary btn-icon" id="btn-next" ${idx >= session.sentences.length - 1 ? 'disabled' : ''} title="${t('nextTitle')}">${ICONS.chevronRight}</button>
        <button class="btn btn-sm btn-secondary btn-icon" onclick="setPage('home')" title="${t('backTitle')}">${ICONS.home}</button>
      </div>
    </div>
    <div class="player-bar">
      <button class="player-btn" id="btn-play" title="${t("playTitle")}">
        <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <svg class="pause-icon" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </button>
      <div class="speed-control">
        <label>${t("speedLabel")}</label>
        <input type="range" id="rate" min="0.5" max="1.5" step="0.1" value="1">
        <span class="speed-value" id="rate-value">1.0x</span>
      </div>
      ${buildVoiceToggleHTML()}
      <span id="play-status" style="font-size:13px;color:var(--text-muted);font-weight:500"></span>
    </div>
    <div class="dictation-area" id="dictation-area"></div>
    <div class="action-bar">
      <button class="btn btn-primary" id="btn-check">${ICONS.check}${t('submitCheck')}</button>
      <button class="btn btn-secondary" id="btn-show-original">${ICONS.eye}${t('showOriginal')}</button>
      <button class="btn btn-secondary" id="btn-skip">${ICONS.skipForward}${t('skipBtn')}</button>
    </div>
    <div class="side-panel" id="side-panel" style="display:none">
      <div id="word-chips-area" style="padding:16px 24px;display:flex;flex-wrap:wrap;gap:8px"></div>
      <div id="sentence-trans" style="padding:0 24px 16px"><div class="translation-text">${t('loading')}</div></div>
    </div>
  `;
  container.appendChild(card);

  const dictationArea = card.querySelector('#dictation-area');
  if (!hasHistory) {
    dictationArea.innerHTML = `
      <div class="form-group" style="margin-bottom:0">
        <label style="margin-bottom:10px">${t('listenFullSentence')}</label>
        <textarea class="dictation-full" id="full-input" placeholder="${t('fullInputPlaceholder')}"></textarea>
        <div class="keyboard-hint"><kbd>${t('enter')}</kbd> ${t('startInput')} · <kbd>${t('space')}</kbd> ${t('playPause')} · <kbd>${t('shift')}</kbd>+<kbd>${t('space')}</kbd> ${t('inInputField')} ${t('playPause')} · <kbd>${t('ctrl')}</kbd>+<kbd>${t('enter')}</kbd> ${t('submitCheck')}</div>
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
    hint.innerHTML = '<kbd>' + t('enter') + '</kbd> ' + t('startInput') + ' · <kbd>' + t('space') + '</kbd> ' + t('playPause') + ' · <kbd>' + t('shift') + '</kbd>+<kbd>' + t('space') + '</kbd> ' + t('inInputField') + ' ' + t('playPause') + ' · <kbd>' + t('ctrl') + '</kbd>+<kbd>' + t('enter') + '</kbd> ' + t('submitCheck');
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
    playStatus.textContent = playing ? t('playing') : '';
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
    const showing = sidePanel.style.display === 'none';
    sidePanel.style.display = showing ? 'block' : 'none';
    if (showing && !sidePanel.dataset.loaded) {
      sidePanel.dataset.loaded = '1';
      // 生成单词卡片
      const chipsArea = card.querySelector('#word-chips-area');
      words.forEach(w => {
        const wrapper = document.createElement('span');
        wrapper.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center';
        const chip = document.createElement('span');
        chip.className = 'word-chip';
        chip.textContent = w;
        const tip = document.createElement('span');
        tip.className = 'word-tip';
        tip.style.display = 'none';
        chip.addEventListener('click', async () => {
          if (tip.style.display !== 'none') { tip.style.display = 'none'; return; }
          tip.textContent = '…';
          tip.style.display = '';
          const t = await translateText(w);
          tip.textContent = t || t('noTranslation');
        });
        wrapper.appendChild(chip);
        wrapper.appendChild(tip);
        chipsArea.appendChild(wrapper);
      });
      // 加载句子翻译
      loadTranslations(sentence, card);
    }
  });

  // Check / Submit logic
  function doCheck() {
    if (!hasHistory) {
      const fullText = card.querySelector('#full-input').value.trim();
      if (!fullText) { showToast('请输入内容'); return; }
      const userWords = tokenizeChinese(fullText);
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
      showToast(t('correctNofM', newLocked.length, words.length));
    } else {
      const inputs = card.querySelectorAll('.word-gap');
      const lockedSet = new Set(locked);
      const newDrafts = {};
      let added = 0;
      inputs.forEach(inp => {
        const indices = JSON.parse(inp.dataset.indices);
        const val = inp.value.trim();
        if (!val) return;
        // 用 diffWords（贪心匹配）比对该 gap 内的原文与用户输入
        const srcWords = indices.map(i => words[i]);
        const userWords = tokenizeChinese(val);
        const matched = diffWords(srcWords, userWords);
        // matched 是 srcWords 中匹配上的索引（相对于 srcWords 的偏移）
        if (matched.size === indices.length) {
          // 全部匹配
          indices.forEach(srcIdx => lockedSet.add(srcIdx));
        } else {
          // 部分匹配：只锁定匹配上的
          let anyMatched = false;
          matched.forEach(localIdx => {
            lockedSet.add(indices[localIdx]);
            anyMatched = true;
          });
          if (!anyMatched) {
            newDrafts[indices[0]] = val;
          }
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
      showToast(t('correctNofM', newLocked.length, words.length));
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
    if (confirm(t('confirmSkip'))) {
      markSentenceDone(progress, idx);
      updateSessionProgress(activeSessionId, progress);
      renderMain();
    }
  });

  // Voice picker
  attachVoiceToggleListeners(card);

  // 自动播放 + 自动聚焦输入框
  setTimeout(() => {
    const rate = parseFloat(rateInput.value);
    const ok = speak(sentence, rate, () => { if (isPlaying) setPlaying(false); });
    if (ok) setPlaying(true);
    const target = card.querySelector('#full-input') || card.querySelector('.word-gap');
    if (target) target.focus();
  }, 200);
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

async function loadTranslations(sentence, card) {
  const el = card.querySelector('#sentence-trans');
  const t = await translateText(sentence);
  el.innerHTML = `<div class="translation-text">${escapeHtml(t || t('translateFailed'))}</div>`;
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
    <h2>${accuracy === 100 ? '🎉 ' + t('fullyComplete') : t('practiceComplete')}</h2>
    <p>${escapeHtml(session.title || t('newDictation'))}</p>
    <div class="result-stats">
      <div class="stat-item">
        <div class="stat-value">${done}</div>
        <div class="stat-label">${t('completedLabel')}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${total}</div>
        <div class="stat-label">${t('totalSentences')}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${accuracy}%</div>
        <div class="stat-label">${t('completionRate')}</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" id="btn-restart">${ICONS.rotateCcw}${t('practiceAgain')}</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}${t('backToHome')}</button>
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
  const levels = ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6'];

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
    let html = `<div class="card-title">${t("library")}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px">
      <div class="card-desc" style="margin-bottom:0">${t('currentLibrary', escapeHtml(activeLibrary.name), lessons.length)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sm btn-secondary" id="btn-import-library">${ICONS.upload}${t('importLibrary')}</button>
        <input type="file" id="library-file-input" accept=".json" style="display:none">
      </div>
    </div>`;

    // Library selector
    html += `<div class="level-filter" style="margin-bottom:16px;padding:12px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border);align-items:center">
      <span style="font-size:13px;color:var(--text-muted);font-weight:600;white-space:nowrap">${t("libraryLabel")}</span>`;
    allLibraries.forEach(lib => {
      const isActive = lib.id === activeLibrary.id;
      html += `<button class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}" data-switch-lib="${lib.id}" style="position:relative">
        ${escapeHtml(lib.name)}${lib.type === 'imported' ? ` <span data-delete-lib="${lib.id}" style="margin-left:6px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;opacity:0.7" title="${t('delete')}" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--danger)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>` : ''}
      </button>`;
    });
    html += `</div>`;

    // 动态级别列表
    const hskOrder = ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6'];
    const displayLevels = [...new Set(lessons.map(l => l.level).filter(Boolean))].sort((a, b) => {
      const ia = hskOrder.indexOf(a);
      const ib = hskOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    // Level filter
    html += `<div class="level-filter">
      <button class="btn btn-sm ${activeLevel === 'all' ? 'btn-primary' : 'btn-secondary'}" data-level="all">${t("allLevels")}</button>
      ${displayLevels.map(lv => `<button class="btn btn-sm ${activeLevel === lv ? 'btn-primary' : 'btn-secondary'}" data-level="${lv}">${lv}</button>`).join('')}
    </div>`;

    const groups = {};
    lessons.forEach(l => {
      if (activeLevel !== 'all' && l.level !== activeLevel) return;
      if (!groups[l.level]) groups[l.level] = [];
      groups[l.level].push(l);
    });

    if (Object.keys(groups).length === 0) {
      html += `<div class="empty-state"><p>${t("noData")}</p></div>`;
    } else {
      displayLevels.forEach(lv => {
        if (!groups[lv]) return;
        html += `<div class="level-section" style="margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
            <span class="level-badge level-${lv.toLowerCase()}">${lv}</span>
            <span style="font-size:13px;color:var(--text-muted)">${t('countLessons', groups[lv].length)}</span>
          </div>
          <div class="session-list">`;
        groups[lv].forEach(l => {
          const st = getSessionStatus(l.id);
          const percent = st.total ? Math.round(st.done / st.total * 100) : 0;
          let statusBadge = '';
          if (!st.imported) statusBadge = `<span style="font-size:12px;color:var(--text-muted)">${t("notStarted")}</span>`;
          else if (percent === 100) statusBadge = `<span style="font-size:12px;color:var(--success);font-weight:600">${t("completedShort")}</span>`;
          else statusBadge = `<span style="font-size:12px;color:var(--primary);font-weight:600">${t("progressPercent", percent)}</span>`;

          html += `<div class="session-item">
            <div class="session-info">
              <div class="session-title">${escapeHtml(l.title)}</div>
              <div class="session-meta">
                <span>${st.total ? t('totalSentencesShort', st.total) : ''}</span>
                <span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;display:inline-block;opacity:0.5"></span>
                ${statusBadge}
              </div>
            </div>
            <div class="session-actions">
              <button class="btn btn-primary" data-action="start" data-id="${l.id}">${st.imported ? ICONS.play + t("continue") : ICONS.play + t("startPractice")}</button>
              ${st.imported ? `<button class="btn btn-secondary" data-action="restart" data-id="${l.id}">${ICONS.rotateCcw}${t('resetBtn')}</button>` : ''}
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
      showToast(t('imported') + ' ' + name);
      renderMain();
    } catch (err) {
      showToast(t('importFailed', err.message || 'unknown'));
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
      if (confirm(t("confirmDeleteLibrary", lib.name))) {
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
        <h3>${t("noWordsToTrain")}</h3>
        <p>${t("drillDesc")}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="setPage('library')">${ICONS.bookOpen}${t("goToLibrary")}</button>
        </div>
      </div>`;
    container.appendChild(card);
    return;
  }

  const savedLevel = (() => {
    try { return localStorage.getItem(LANG_PREFIX + 'dictation-drill-level') || ''; } catch { return ''; }
  })();
  const levels = ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6'];
  const defaultLevel = savedLevel && levels.includes(savedLevel) ? savedLevel : 'HSK3';

  const MAX_PROMPT_WORDS = 30;
  const promptWords = getMistakeWordsForPrompt(MAX_PROMPT_WORDS);
  const allPromptWords = Object.values(loadMistakes());
  const isTruncated = allPromptWords.length > MAX_PROMPT_WORDS;

  function buildPromptText(level) {
    const levelDesc = {
      HSK1: '使用HSK1级词汇（约150词），极简单句，适合零起点学习者',
      HSK2: '使用HSK2级词汇（约300词），简单句型，句子较短',
      HSK3: '使用HSK3级词汇（约600词），中等难度，句子结构适中',
      HSK4: '使用HSK4级词汇（约1200词），较丰富词汇，包含复合句',
      HSK5: '使用HSK5级词汇（约2500词），较高级词汇和复杂句型',
      HSK6: '使用HSK6级词汇（约5000词），高级词汇，句式复杂多变'
    };
    if (!promptWords.length) return '';
    return `请写一段自然流畅的中文短文，尽量包含以下词语：${promptWords.join('、')}。这些词语是我正在听写训练中的重点词汇，请确保它们在语境中自然出现。\n\n文章难度要求：HSK ${level} 级别。${levelDesc[level]}。短文长度适中（约 100-200 字），主题围绕中国文化，语气自然即可。`;
  }

  const promptText = buildPromptText(defaultLevel);

  card.innerHTML = `
    <div class="card-title">${t('drillTitle')}</div>
    <div class="card-desc">${t('drillDesc')}</div>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:var(--bg);border-radius:var(--radius);border:1.5px solid var(--border)">
      <div style="width:48px;height:48px;border-radius:50%;background:var(--danger-soft);color:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICONS.target}</div>
      <div>
        <div style="font-size:20px;font-weight:800;color:var(--text);line-height:1">${list.length}</div>
        <div style="font-size:13px;color:var(--text-muted)">${t("wordsToTrain")}</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" id="btn-gen-prompt" ${promptWords.length ? '' : 'disabled'}>${ICONS.sparkles}${t("generatePrompt")}</button>
      </div>
    </div>

    <div id="prompt-area" style="display:none;margin-bottom:20px">
      <div class="form-group" style="margin-bottom:12px">
        <label>${t("selectDifficulty")}</label>
        <div class="level-filter" id="drill-level-filter" style="margin-bottom:0">
          ${levels.map(lv => `<button class="btn btn-sm ${lv === defaultLevel ? 'btn-primary' : 'btn-secondary'}" data-level="${lv}">${lv}</button>`).join('')}
        </div>
      </div>
      <div class="form-group" style="margin-bottom:8px">
        <label>${isTruncated ? t("promptLabelTruncated", promptWords.length, allPromptWords.length) : t("promptLabel", promptWords.length)}</label>
        <textarea id="drill-prompt" readonly style="min-height:120px;background:var(--bg);cursor:text">${escapeHtml(promptText)}</textarea>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" id="btn-copy-prompt">${ICONS.copy}${t("copyPrompt")}</button>
      </div>
    </div>

    <div class="form-group" style="margin-bottom:16px">
      <label>${t("pasteArticle")}</label>
      <textarea id="drill-text" placeholder="${t("pasteArticlePlaceholder")}"></textarea>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="btn-start-drill">${ICONS.zap}${t("startDrill")}</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}${t('backToHome')}</button>
    </div>

    <div style="margin-top:24px">
      <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;display:flex;align-items:center;gap:6px">${ICONS.list}${t('mistakesRecorded')} <span style="font-weight:400;color:var(--text-muted);font-size:12px">${t('clickSelectBatchDelete')}</span></div>
      <div id="mistake-chips" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        ${list.map(m => `<span class="mistake-chip" data-key="${normalizeWord(m.word)}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:var(--bg);border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;color:var(--text-secondary);cursor:pointer;user-select:none;transition:all .15s"><strong style="color:var(--text)">${escapeHtml(m.word)}</strong><span style="width:4px;height:4px;background:var(--text-muted);border-radius:50%;opacity:0.5"></span>${t('mistakeCount', m.count)}</span>`).join('')}
      </div>
      <div id="batch-actions" style="display:none;gap:8px;align-items:center">
        <span style="font-size:13px;color:var(--text-muted)" id="selected-count">${t('selectedCount', 0)}</span>
        <button class="btn btn-sm btn-secondary" id="btn-select-all">${t("selectAll")}</button>
        <button class="btn btn-sm btn-secondary" id="btn-deselect-all">${t("deselectAll")}</button>
        <button class="btn btn-sm btn-danger" id="btn-batch-delete">${ICONS.trash}${t("deleteSelected")}</button>
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
      try { localStorage.setItem(LANG_PREFIX + 'dictation-drill-level', currentLevel); } catch {}
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
      showToast(t('promptCopied'));
    } catch {
      showToast('复制失败，请手动复制');
    }
  });

  // --- 错误记录选中与批量删除 ---
  const selectedKeys = new Set();
  const chipsContainer = card.querySelector('#mistake-chips');
  const batchActions = card.querySelector('#batch-actions');
  const selectedCountEl = card.querySelector('#selected-count');

  function updateChipStyles() {
    chipsContainer.querySelectorAll('.mistake-chip').forEach(chip => {
      const key = chip.dataset.key;
      if (selectedKeys.has(key)) {
        chip.style.background = 'var(--danger-soft)';
        chip.style.borderColor = 'var(--danger)';
        chip.style.color = 'var(--danger)';
      } else {
        chip.style.background = '';
        chip.style.borderColor = '';
        chip.style.color = '';
      }
    });
    batchActions.style.display = selectedKeys.size > 0 ? 'flex' : 'none';
    selectedCountEl.textContent = t("selectedCount", selectedKeys.size);
  }

  chipsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.mistake-chip');
    if (!chip) return;
    const key = chip.dataset.key;
    if (selectedKeys.has(key)) selectedKeys.delete(key); else selectedKeys.add(key);
    updateChipStyles();
  });

  card.querySelector('#btn-select-all').addEventListener('click', () => {
    chipsContainer.querySelectorAll('.mistake-chip').forEach(c => selectedKeys.add(c.dataset.key));
    updateChipStyles();
  });
  card.querySelector('#btn-deselect-all').addEventListener('click', () => {
    selectedKeys.clear();
    updateChipStyles();
  });
  card.querySelector('#btn-batch-delete').addEventListener('click', () => {
    if (!selectedKeys.size) return;
    if (!confirm(t("confirmDeleteSelected", selectedKeys.size))) return;
    const m = loadMistakes();
    selectedKeys.forEach(k => delete m[k]);
    saveMistakes(m);
    showToast(`已删除 ${selectedKeys.size} 条记录`);
    renderMain();
  });

  // Start drill
  card.querySelector('#btn-start-drill').addEventListener('click', () => {
    const text = card.querySelector('#drill-text').value.trim();
    if (!text) { showToast('请粘贴 LLM 返回的文章'); return; }
    const sentences = splitSentences(text);
    if (!sentences.length) { showToast('未能识别到句子'); return; }
    drillSession = {
      title: t('drillTitle'),
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
  const words = tokenizeChinese(sentence);

  const card = document.createElement('div');
  card.className = 'practice-card';
  card.innerHTML = `
    <div class="practice-header">
      <div>
        <div class="practice-title">${t('drillTitle')}</div>
        <div class="practice-subtitle">${t('drillProgress', idx + 1, drillSession.sentences.length)}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${Math.round((idx / drillSession.sentences.length) * 100)}%"></div>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-sm btn-secondary btn-icon" onclick="setPage('drill')" title="${t('exitTitle')}">${ICONS.x}</button>
      </div>
    </div>
    <div class="player-bar">
      <button class="player-btn" id="btn-play" title="${t("playTitle")}">
        <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <svg class="pause-icon" viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </button>
      <div class="speed-control">
        <label>${t('speedLabel')}</label>
        <input type="range" id="rate" min="0.5" max="1.5" step="0.1" value="1">
        <span class="speed-value" id="rate-value">1.0x</span>
      </div>
      ${buildVoiceToggleHTML()}
    </div>
    <div class="dictation-area">
      <div class="form-group" style="margin-bottom:0">
        <label style="margin-bottom:10px">${t('drillOnlyOnce')}</label>
        <textarea class="dictation-full" id="drill-input" placeholder="${t('fullInputPlaceholder')}"></textarea>
        <div class="keyboard-hint"><kbd>${t('enter')}</kbd> ${t('startInput')} · <kbd>${t('space')}</kbd> ${t('playPause')} · <kbd>${t('shift')}</kbd>+<kbd>${t('space')}</kbd> ${t('inInputField')} ${t('playPause')} · <kbd>${t('ctrl')}</kbd>+<kbd>${t('enter')}</kbd> ${t('submitCheck')}</div>
      </div>
    </div>
    <div class="action-bar">
      <button class="btn btn-primary" id="btn-drill-check">${ICONS.check}${t('submitCheck')}</button>
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
    const userWords = tokenizeChinese(fullText);
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
  const totalWords = drillSession.results.reduce((s, r) => s + tokenizeChinese(r.sentence).length, 0);
  const accuracy = totalWords ? Math.round(totalCorrect / totalWords * 100) : 0;

  const main = document.getElementById('main');
  main.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card result-card';
  card.innerHTML = `
    <h2>${accuracy === 100 ? '🎉 ' + t('drillComplete') : t('drillComplete')}</h2>
    <p>${t('drillResultDesc', accuracy)}</p>
    <div class="result-stats">
      <div class="stat-item"><div class="stat-value">${totalCorrect}</div><div class="stat-label">${t('correctWords')}</div></div>
      <div class="stat-item"><div class="stat-value">${totalWords - totalCorrect}</div><div class="stat-label">${t('wrongWords')}</div></div>
      <div class="stat-item"><div class="stat-value">${accuracy}%</div><div class="stat-label">${t('correctRate')}</div></div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="setPage('drill')">${ICONS.target}${t('drillAgain')}</button>
      <button class="btn btn-secondary" onclick="setPage('home')">${ICONS.home}${t('backToHome')}</button>
    </div>
  `;
  main.appendChild(card);
  drillSession = null;
  currentPage = 'drill-result'; // Not a real page, just for display
}

function renderHelp(container) {
  const card = document.createElement('div');
  card.className = 'card';
  let html = `<div class="card-title">${t('helpTitle')}</div>
    <div class="card-desc">${t('helpHowTo')}</div>
    <div style="display:grid;gap:16px">
      <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">1</div>
        <div>
          <div style="font-weight:600;font-size:15px;margin-bottom:3px;color:var(--text)">${t('helpStep1')}</div>
        </div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">2</div>
        <div>
          <div style="font-weight:600;font-size:15px;margin-bottom:3px;color:var(--text)">${t('helpStep2')}</div>
        </div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">3</div>
        <div>
          <div style="font-weight:600;font-size:15px;margin-bottom:3px;color:var(--text)">${t('helpStep3')}</div>
        </div>
      </div>
      <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-hover));color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">4</div>
        <div>
          <div style="font-weight:600;font-size:15px;margin-bottom:3px;color:var(--text)">${t('helpStep4')}</div>
        </div>
      </div>
    </div>`;
  card.innerHTML = html;
  container.appendChild(card);
}

// Init
setPage('home');
