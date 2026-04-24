const fs = require('fs');

const html = fs.readFileSync('articles_final.html', 'utf-8');

let text = html
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const rawLines = text.split('\n');
const lines = [];
for (let i = 0; i < rawLines.length; i++) {
  const trimmed = rawLines[i].trim();
  if (trimmed.length > 0) {
    lines.push(trimmed);
  }
}

const lessons = [];
let currentLesson = null;
let currentTextLines = [];
const seenIds = new Set();
let iv27Handled = false; // Book IV 第一个 Lesson 27 已处理标记

function saveCurrentLesson() {
  if (currentLesson && currentTextLines.length > 0) {
    currentLesson.text = currentTextLines.join(' ');
    lessons.push(currentLesson);
  }
}

const lessonRegex = /^Book\s+(I|II|III|IV)\s+Lesson\s+(\d+)(?::\s*(.*))?$/i;
const bookToLevel = { 'I': '1', 'II': '2', 'III': '3', 'IV': '4' };

// 标题不完整结尾词（小写）
const incompleteEndings = /\b(the|a|an|in|of|for|with|by|to|from|on|at|when|and|or|s|alfred|william|modern|gifted)$/i;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(lessonRegex);
  if (match) {
    saveCurrentLesson();
    const book = match[1];
    const rawLessonNum = parseInt(match[2], 10);
    let lessonNum = rawLessonNum;
    let title = (match[3] || '').trim();

    if (book === 'IV') {
      // Book IV：不使用内容中的短句作为标题，统一用 Lesson X
      title = '';
      // 处理重复的 Lesson 27：第一篇编号为 26
      if (lessonNum === 27 && !iv27Handled) {
        lessonNum = 26;
        iv27Handled = true;
      }
    } else {
      // Book I/II/III：同一行有内容则保留
      if (title) {
        if (title.length < 8 || (incompleteEndings.test(title) && title.length < 45)) {
          title = '';
        }
      }
      // 检查下一行是否有短标题
      if (!title && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (!nextLine.match(lessonRegex) && nextLine.length < 55) {
          title = nextLine;
          i++; // 跳过这行
        }
      }
    }

    if (!title) {
      title = `Lesson ${lessonNum}`;
    }

    let id = `nce-${book.toLowerCase()}-${String(lessonNum).padStart(3, '0')}`;
    if (seenIds.has(id)) {
      let suffix = 1;
      while (seenIds.has(`${id}-${suffix}`)) {
        suffix++;
      }
      id = `${id}-${suffix}`;
    }
    seenIds.add(id);

    currentLesson = {
      id: id,
      level: bookToLevel[book],
      title: title,
      text: ''
    };
    currentTextLines = [];
  } else if (currentLesson) {
    currentTextLines.push(line);
  }
}

saveCurrentLesson();

const library = {
  name: "新概念英语（全四册）",
  lessons: lessons
};

fs.writeFileSync('nce-library.json', JSON.stringify(library, null, 2), 'utf-8');

console.log(`已生成 nce-library.json，共 ${lessons.length} 课`);

const levelCounts = {};
for (const l of lessons) {
  levelCounts[l.level] = (levelCounts[l.level] || 0) + 1;
}
for (const [level, count] of Object.entries(levelCounts).sort()) {
  console.log(`  Level ${level}: ${count} 课`);
}
