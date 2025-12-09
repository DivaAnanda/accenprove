const Database = require('better-sqlite3');

const db = new Database('./sqlite.db');

try {
  // List all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in database:', tables);
  
  if (tables.length === 0) {
    console.log('\n⚠️  No tables found. Database might be empty.');
    db.close();
    process.exit(0);
  }
  
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasIsActive = tableInfo.some(col => col.name === 'is_active');
  
  if (hasIsActive) {
    console.log('✓ Column is_active already exists');
  } else {
    // Add the column
    db.exec('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1 NOT NULL;');
    console.log('✓ Migration applied successfully: Added is_active column');
  }
  
  // Verify
  const updatedTableInfo = db.prepare("PRAGMA table_info(users)").all();
  console.log('\nUsers table columns:');
  updatedTableInfo.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
