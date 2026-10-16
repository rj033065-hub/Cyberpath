const fs = require('fs');

const files = [
  'src/pages/Dashboard.jsx',
  'src/pages/PathCurriculum.jsx',
  'src/pages/LessonView.jsx',
  'src/pages/ResourceExplorer.jsx',
  'src/pages/Profile.jsx',
  'src/pages/LabCatalog.jsx',
  'src/pages/labs/SQLiLab.jsx',
  'src/pages/labs/XSSLab.jsx',
  'src/pages/labs/IDORLab.jsx',
  'src/pages/labs/AuthCheckpointLab.jsx',
  'src/components/labs/LabLayout.jsx',
  'src/components/labs/ChallengeFeedback.jsx',
  'src/components/labs/HintPanel.jsx',
  'src/components/labs/KnowledgeCheck.jsx',
  'src/components/labs/LabCompletionSummary.jsx',
  'src/components/labs/MissionBriefing.jsx',
  'src/components/labs/SimulatedTarget.jsx',
  'src/components/background/DashboardBackdrop.tsx',
  'src/components/background/HexGridBackground.tsx',
  'src/components/background/PacketNetworkBackground.tsx',
  'src/components/background/RadarScan.tsx',
  'src/components/background/AstronautIllustration.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f + ' does not exist');
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const twColors = content.match(/\b(text|bg|border|ring|from|to|via|fill|stroke|shadow|decoration|outline)-(blue|sky|cyan|indigo|purple|violet|teal|emerald|green|yellow|amber|orange|red|rose|pink)-[a-z0-9\/\.]+\b/gi) || [];
  const hexes = content.match(/#[0-9a-fA-F]{3,8}\b/gi) || [];
  const rgbs = content.match(/rgba?\([^)]+\)/gi) || [];
  
  console.log(`=== ${f} ===`);
  console.log(`  Tailwind color classes (${twColors.length}):`, Array.from(new Set(twColors)).join(', '));
  console.log(`  Hex codes (${hexes.length}):`, Array.from(new Set(hexes)).join(', '));
  console.log(`  RGB/A codes (${rgbs.length}):`, Array.from(new Set(rgbs)).slice(0, 5).join(', '));
});
