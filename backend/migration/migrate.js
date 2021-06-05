require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {knex} = require('../src/common/db');

async function createMigrationTableIfNotExists() {
    await knex.raw(`
        CREATE TABLE IF NOT EXISTS migration (
            name VARCHAR NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS migration_name_uniq ON migration (name);
    `);
}

async function runMigrationFiles() {
    let lastMigrationFile = await fetchLastMigrationFile();
    let sqlFiles = path.join(__dirname, 'sql_files');
    let files = fs.readdirSync(sqlFiles);
    for (const file of files) {
        if (lastMigrationFile >= file) {
            continue;
        }
        try {
            await runMigrationFile(path.join(sqlFiles, file));
        } catch (e) {
            console.log(e);
            break;
        }
    }
}

async function fetchLastMigrationFile() {
    let row = await knex('migration').orderBy('name', 'desc').first();
    return row == null ? null : row.name;
}

async function runMigrationFile(filePath) {
    let fileName = path.basename(filePath);
    let sql = fs.readFileSync(filePath).toString();
    let result = await knex.raw(sql);
    await knex('migration').insert({name: fileName});
    console.log('Completed', filePath);
}

async function migrate() {
    await createMigrationTableIfNotExists();
    await runMigrationFiles();
    process.exit();
}
migrate();