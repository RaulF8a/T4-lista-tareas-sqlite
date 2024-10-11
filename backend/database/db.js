
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tasks.db', (err) => {
    if( !err ) return;

    console.log(`Error al abrir la BD: ${err}`);
});

db.run(`
    CREATE TABLE IF NOT EXISTS tareas (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'descripcion' TEXT NOT NULL,
        'completada' INTEGER DEFAULT 0
    )
`);

module.exports = db;
