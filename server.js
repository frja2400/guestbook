/**
 * Gästbok
 */

//Importerar alla moduler jag behöver
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

//Skapar en anslutning till databasen
const db = new sqlite3.Database("./db/guestbook.db");

//Inställningar
const app = express();                                          //Skapar en ny express-applikation
const port = 3000;                                              //Ställer in porten till 3000
app.set("view engine", "ejs");                                  //Anger ejs som templating engine
app.use(express.static("public"));                              //Konfigurerar Express att använda statiska filer från public-mappen.
app.use(bodyParser.urlencoded({ extended: true }));             //Använder body-parser för att hantera URL-encoded data.

//Definierar en route för root-URL (/) som renderar index.ejs-filen.
app.get("/", (req, res) => {
    res.render("index", {
        error: ""
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

    res.render("index", {
        error: error
    });
});

//Starta applikationen.
//Startar servern och lyssnar på den angivna porten (3000). Loggar ett meddelande när servern har startat.
app.listen(port, () => {
    console.log("Application started on port: " + port);
});