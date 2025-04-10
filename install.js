/**
 * Install-skript för en gästbok.
 */

//Importerar SQLite-databsen och aktiverar detaljerad inloggning med verbose.
const sqlite3 = require("sqlite3").verbose();

//Skapa databas
const db = new sqlite3.Database("./db/guestbook.db");

//Skapa tabell (id, name, message, posted). Seralize säkerställer att kommandona exekveras i den ordning de skrivs.
db.serialize(()=> {
    db.run("DROP TABLE IF EXISTS guestbook;");

    db.run(`
        CREATE TABLE guestbook(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `);
});

db.close();