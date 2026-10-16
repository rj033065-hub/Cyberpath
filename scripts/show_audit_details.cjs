const fs = require('fs');
const audit = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));
const files = [
  'src/components/badges/BadgeCard.jsx',
  'src/components/badges/BadgeEmblem.jsx',
  'src/components/badges/badgeProgressHelper.js',
  'src/components/badges/NextBadgeFeatured.jsx',
  'src/components/ui/dotted-trail-cursor.tsx',
  'src/components/background/AstronautIllustration.tsx',
  'src/pages/ResourceExplorer.jsx',
  'src/pages/LandingPage.jsx'
];
files.forEach(f => {
  console.log('=== ' + f + ' ===');
  (audit[f] || []).forEach(item => {
    console.log(`L${item.line}: ${item.matches.join(', ')} -> ${item.text}`);
  });
});
