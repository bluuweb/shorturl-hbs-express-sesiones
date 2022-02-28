const express = require("express");
const { create } = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
require("./database/conexion");

const app = express();

app.use(
    session({
        secret: process.env.SESSIONSECRET,
        saveUninitialized: true,
        resave: true,
    })
);

app.use(flash());

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/home"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server andando 🔥"));
