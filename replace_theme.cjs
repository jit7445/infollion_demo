const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Update globals.css to force white theme and use #ec9324
const globalsPath = path.join(__dirname, 'app/globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf8');
globalsContent = globalsContent.replace(/#FF7A30/ig, '#ec9324');
// Overwrite dark mode variables to match light mode
globalsContent = globalsContent.replace(/\.dark\s*{[^}]*}/, `.dark {
  --bg:            #FFFFFF;
  --bg2:           #FAFAFA;
  --text:          #1A1208;
  --text-muted:    rgba(26,18,8,0.6);
  --text-faint:    rgba(26,18,8,0.25);
  --border:        rgba(26,18,8,0.1);
  --border-hover:  rgba(236,147,36,0.4);
  --glass:         rgba(255,255,255,0.55);
  --glass-border:  rgba(255,255,255,0.7);
  --card-bg:       rgba(255,255,255,0.45);
  --lamp-body:     #B0A090;
  --lamp-shade:    #8A7A6A;
  --lamp-glow:     rgba(255,190,80,0.55);
  --lamp-cone:     rgba(255,200,100,0.18);
  --nav-bg:        rgba(253,252,247,0.5);
  --primary:       #ec9324;
}`);
fs.writeFileSync(globalsPath, globalsContent, 'utf8');
console.log('Updated app/globals.css');

// 2. Update engagement-mode
replaceInFile(path.join(__dirname, 'app/engagement-mode/page.tsx'), [
  ['#07090f', '#ffffff'],
  ['#0d1117', '#fafafa'],
  ['#111620', '#ffffff'],
  ['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.08)'],
  ['#f0f0f0', '#111827'],
  ['#8a9bb0', '#4B5563'],
  ['#00c8c8', '#ec9324'],
  ['rgba(0, 200, 200, 0.04)', 'rgba(236, 147, 36, 0.06)'],
  ['rgba(0,200,200,0.12)', 'rgba(236,147,36,0.12)'],
  ['hover:border-[rgba(0,200,200,0.3)]', 'hover:border-[rgba(236,147,36,0.3)]'],
  ['shadow-[0_10px_40px_-10px_rgba(0,200,200,0.1)]', 'shadow-[0_10px_40px_-10px_rgba(236,147,36,0.15)]']
]);

// 3. Update layout and page with the new brand color and white footer
replaceInFile(path.join(__dirname, 'app/page.tsx'), [
  ['#FF7A30', '#ec9324'],
  ['bg-white/10', 'bg-black/5'],
  ['border-white/10', 'border-black/10']
]);

replaceInFile(path.join(__dirname, 'app/layout.tsx'), [
  ['#FF7A30', '#ec9324'],
  ['#0A0806', '#ffffff'],
  ['#1A1208', '#fafafa'],
  ['text-white', 'text-black'],
  ['text-white/50', 'text-black/60'],
  ['text-white/30', 'text-black/40'],
  ['text-white/20', 'text-black/30'],
  ['text-white/40', 'text-black/50'],
  ['border-white/5', 'border-black/5'],
  ['border-white/10', 'border-black/10'],
  ['bg-white/5', 'bg-black/5'],
  ['bg-white/[0.03]', 'bg-black/[0.03]'],
  ['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.05)'],
  ['rgba(255,255,255,0.10)', 'rgba(0,0,0,0.10)']
]);

console.log('Theme update complete!');
