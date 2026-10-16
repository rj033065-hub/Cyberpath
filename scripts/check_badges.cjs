const fs = require('fs');
const path = require('path');

['src/components/learning', 'src/components/badges'].forEach(dir => {
  fs.readdirSync(dir).forEach(f => {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    const colorMatches = c.match(/\b(bg|text|border|ring|from|to|via)-(red|blue|green|purple|yellow|emerald|amber|rose|sky|cyan|indigo)-[^\s\"]+/g) || [];
    console.log(f + ': ' + (Array.from(new Set(colorMatches)).join(', ') || 'none'));
  });
});
