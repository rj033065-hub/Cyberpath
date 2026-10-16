const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', 'dist', '.git'];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(getFiles(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getFiles(process.cwd()).filter(f => {
  const ext = path.extname(f);
  return ['.jsx', '.tsx', '.js', '.ts', '.css', '.html', '.svg'].includes(ext);
});

// Color patterns
const twColorRegex = /\b(text|bg|border|ring|from|to|via|fill|stroke|shadow|decoration|outline)-(blue|sky|cyan|indigo|violet|purple|teal|emerald|amber|orange|rose|pink|yellow|green|red)-[a-z0-9\/\.]+\b/gi;

const neutralHexes = new Set([
  '000000', 'ffffff', '09090b', '101012', '1c1c20', 'fafafa', 'a1a1aa', '71717a',
  '18181b', '27272a', '3f3f46', '52525b', 'e4e4e7', 'f4f4f5', 'd4d4d8', '262626',
  '171717', '404040', '737373', 'a3a3a3', 'e5e5e5', '0a0a0a', '000', 'fff', '111', '222', '333',
  // status colors allowed sparingly
  '4ade80', 'fbbf24', 'f87171', '22c55e', '16a34a', 'ef4444', 'dc2626', 'eab308', 'ca8a04',
  // gold allowed for master badge
  'd29922', 'f2cc60', 'f8e38d', 'fae69e', 'e3b341', 'fef08a'
]);

const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;

function isNonNeutralRgb(str) {
  const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return false;
  const [_, r, g, b] = match.map(Number);
  // status colors
  if (r === 74 && g === 222 && b === 128) return false; // 4ade80
  if (r === 251 && g === 191 && b === 36) return false; // fbbf24
  if (r === 248 && g === 113 && b === 113) return false; // f87171
  if (r === 210 && g === 153 && b === 34) return false; // gold
  if (r === 227 && g === 179 && b === 65) return false; // gold
  // Grayscale check (allow tiny differences if neutral, but generally r === g === b)
  if (r === g && g === b) return false;
  // zinc/slate tones: 9,9,11 or 16,16,18 or 28,28,32 or 161,161,170 or 113,113,122
  if (Math.abs(r - g) <= 5 && Math.abs(g - b) <= 5 && Math.abs(r - b) <= 5) return false;
  return true;
}

const rgbRegex = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+[^)]*\)/gi;

const audit = {};

allFiles.forEach(file => {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const twMatches = line.match(twColorRegex) || [];
    
    const hexMatches = [];
    let h;
    while ((h = hexRegex.exec(line)) !== null) {
      const code = h[1].toLowerCase();
      if (!neutralHexes.has(code)) {
        hexMatches.push('#' + code);
      }
    }

    const rgbMatches = [];
    let r;
    while ((r = rgbRegex.exec(line)) !== null) {
      if (isNonNeutralRgb(r[0])) {
        rgbMatches.push(r[0]);
      }
    }

    const allMatches = [...twMatches, ...hexMatches, ...rgbMatches];
    if (allMatches.length > 0) {
      if (!audit[rel]) audit[rel] = [];
      audit[rel].push({ line: idx + 1, matches: allMatches, text: line.trim() });
    }
  });
});

fs.writeFileSync('audit_results.json', JSON.stringify(audit, null, 2));

console.log('AUDIT SUMMARY:');
let totalOccurrences = 0;
for (const [file, items] of Object.entries(audit)) {
  totalOccurrences += items.length;
  console.log(`${file}: ${items.length} occurrences`);
}
console.log(`\nTotal files: ${Object.keys(audit).length}, Total occurrences: ${totalOccurrences}`);
