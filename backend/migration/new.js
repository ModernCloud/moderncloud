require('dotenv').config();
const path = require('path');
const fs = require('fs');
const arguments = process.argv.slice(2);
if (arguments.length === 0) {
    console.info('\nUsage: npm run migration:new name\n');
    process.exit();
}
let filePath = path.join(__dirname, 'sql_files', `${Date.now()}_${arguments[0]}.sql`);
fs.writeFileSync(filePath, '');
console.info('Migration file has been created:', filePath);