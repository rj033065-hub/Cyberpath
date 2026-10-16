const fs = require('fs');

const labFiles = ['SQLiLab.jsx', 'XSSLab.jsx', 'IDORLab.jsx', 'AuthCheckpointLab.jsx'];
labFiles.forEach(f => {
  const c = fs.readFileSync('src/pages/labs/' + f, 'utf8');
  const colorMatches = c.match(/\b(bg|text|border|ring|from|to|via)-(red|blue|green|purple|yellow|emerald|amber|rose|sky|cyan|indigo)-[^\s\"]+/g) || [];
  console.log(f + ': ' + (Array.from(new Set(colorMatches)).join(', ') || 'none'));
});
