const fs = require('fs');
const path = require('path');

// Find all JS files in src/
function scanDir(dir) {
  const results = [];
  function walk(d) {
    try {
      const items = fs.readdirSync(d);
      for (const item of items) {
        const full = path.join(d, item);
        if (item === 'node_modules' || item === '.next') continue;
        try {
          if (fs.statSync(full).isDirectory()) walk(full);
          else if (item.endsWith('.js') || item.endsWith('.jsx')) results.push(full);
        } catch(e) {}
      }
    } catch(e) {}
  }
  walk(dir);
  return results;
}

const files = scanDir('src');
let totalFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;

  // The key pattern to catch: fetch(apiUrl("..." + someExpr);
  // These are cases where apiUrl() closes but fetch() doesn't
  // Pattern: fetch(apiUrl( ANYTHING ); → fetch(apiUrl( ANYTHING ));
  // We use a smart approach — find all "await fetch(apiUrl(" and ensure they're properly closed
  
  // Fix: fetch(apiUrl("string"); → fetch(apiUrl("string"));
  content = content.replace(/fetch\(apiUrl\("([^"]+)"\);/g, 'fetch(apiUrl("$1"));');
  
  // Fix: fetch(apiUrl(`string`); → fetch(apiUrl(`string`));
  content = content.replace(/fetch\(apiUrl\(`([^`]+)`\);/g, 'fetch(apiUrl(`$1`));');

  // Fix: fetch(apiUrl("path" + expr); → fetch(apiUrl("path" + expr));
  // More general: look for fetch(apiUrl(NONPAREN_STUFF); where NONPAREN_STUFF has unbalanced parens from apiUrl
  // Specifically: the string concat pattern like fetch(apiUrl("..." + p.toString());
  content = content.replace(/fetch\(apiUrl\(("(?:[^"]+)"[^)]*)\);/g, (match, inner) => {
    return `fetch(apiUrl(${inner}));`;
  });
  
  // Fix: fetch(apiUrl(`...` + expr); 
  content = content.replace(/fetch\(apiUrl\((`(?:[^`]+)`[^)]*)\);/g, (match, inner) => {
    return `fetch(apiUrl(${inner}));`;
  });

  // Fix: fetch(apiUrl("path").then → fetch(apiUrl("path")).then (missing close for fetch)
  content = content.replace(/fetch\(apiUrl\("([^"]+)"\)\.then/g, 'fetch(apiUrl("$1")).then');
  content = content.replace(/fetch\(apiUrl\(`([^`]+)`\)\.then/g, 'fetch(apiUrl(`$1`)).then');

  // Fix: fetch(apiUrl("path", {options}) → fetch(apiUrl("path"), {options})
  content = content.replace(/fetch\(apiUrl\("([^"]+)",\s*\{/g, 'fetch(apiUrl("$1"), {');
  content = content.replace(/fetch\(apiUrl\(`([^`]+)`,\s*\{/g, 'fetch(apiUrl(`$1`), {');

  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    const relPath = path.relative('src', file);
    console.log('FIXED:', relPath);
    // Show what was changed
    const beforeLines = before.split('\n');
    const afterLines = content.split('\n');
    for (let i = 0; i < Math.max(beforeLines.length, afterLines.length); i++) {
      if (beforeLines[i] !== afterLines[i]) {
        console.log(`  Line ${i+1} BEFORE: ${(beforeLines[i] || '').trim()}`);
        console.log(`  Line ${i+1} AFTER:  ${(afterLines[i] || '').trim()}`);
      }
    }
    totalFixed++;
  }
}

console.log(`\nTotal files fixed: ${totalFixed}`);
if (totalFixed === 0) {
  console.log('All files look correct!');
}
