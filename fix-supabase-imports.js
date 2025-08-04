import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get all files with Supabase imports (both .tsx and .ts)
const files = execSync('find client/src \\( -name "*.tsx" -o -name "*.ts" \\) -type f -exec grep -l "@/lib/supabase" {} \\;')
  .toString()
  .trim()
  .split('\n')
  .filter(file => file.length > 0);

console.log(`Found ${files.length} files with Supabase imports`);

const replacements = [
  // Basic service imports
  { from: /from ['"]@\/lib\/supabase['"];?/g, to: 'from "@/lib/database";' },
  { from: /from ['"]@\/lib\/supabase\/client['"];?/g, to: 'from "@/lib/database";' },
  
  // Specific service imports
  { from: /from ['"]@\/lib\/supabase\/([^'"]+)['"];?/g, to: 'from "@/lib/database";' },
  
  // Individual service destructuring - replace with database services
  { from: /import\s*{\s*supabase\s*}\s*from\s*['"]@\/lib\/supabase\/client['"];?/g, to: 'import { databaseService } from "@/lib/database";' },
  
  // Replace supabase usage with databaseService
  { from: /\bsupabase\./g, to: 'databaseService.' },
  { from: /\bsupabase\b(?!\.)/, to: 'databaseService' },
];

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('✅ All Supabase imports have been replaced!');
