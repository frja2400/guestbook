/**
 * Gästbok
 */


//Importerar alla moduler jag behöver
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
//Ladda miljövariabler från .env
require('dotenv').config();

//Skapar en anslutning till databasen
const db = new sqlite3.Database(process.env.DATABASE_URL); // Använd miljövariabel för databas-URL


//Inställningar
const app = express();                                          //Skapar en ny express-applikation
const port = process.env.PORT || 3000;                          // Använd miljövariabel för port
app.set("view engine", "ejs");                                  //Anger ejs som templating engine
app.use(express.static("public"));                              //Konfigurerar Express att använda statiska filer från public-mappen.
app.use(bodyParser.urlencoded({ extended: true }));             //Använder body-parser för att hantera URL-encoded data.

//Detta definierar en route för root-URL ("/"). När någon besöker denna URL, kommer den här funktionen att köras.
app.get("/", (req, res) => {
    //Denna rad kör en SQL-fråga som hämtar alla rader från tabellen "guestbook". Resultatet av frågan skickas till callback-funktionen.
    db.all("SELECT * FROM guestbook ORDER BY id DESC;", (err, rows) => {
        //Här kontrolleras om det uppstod ett fel när SQL-frågan kördes.
        if (err) {
            console.error(err.message);
        }
        //Denna rad renderar "index.ejs"-filen och skickar med ett objekt med data till vyn.
        res.render("index", {
            //Här skickas en tom sträng som värde för "error"-nyckeln i objektet som skickas till vyn.
            error: "",
            rows: rows
        });
    });
});

//Skapa nya inlägg
app.post("/", (req, res) => {
    let name = req.body.name;
    let message = req.body.message;
    let error = "";

    //Kontrollera input
    if (name != "" && message != "") {
        //Korrekt - lagra i db
        const statement = db.prepare("INSERT INTO guestbook(name, message)VALUES(?,?);");
        statement.run(name, message);
        statement.finalize();
    } else {
        error = "Du måste fylla i både namn och meddelande!"
    }

    res.redirect("/");
});

//Radera inlägg
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    db.run("DELETE FROM guestbook WHERE id=?;", id, (err) => {
        if (err) {
            console.error(err.message);
        }

        //Redirect till startsida
        res.redirect("/");
    });
});

//Starta applikationen.
//Startar servern och lyssnar på den angivna porten (3000). Loggar ett meddelande när servern har startat.
app.listen(port, () => {
    console.log("Application started on port: " + port);
});