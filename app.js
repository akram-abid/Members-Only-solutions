const express = require("express")
const pg = require("pg")
const expressSession = require("express-session")
const pgSession = require("connect-pg-simple")(expressSession)
const routes = require("./routes/routes")
const app = express()
const path = require("node:path");
const session = require("./config/session")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(sesion);

app.use("/", routes);

app.listen(3000, () => {
    console.log("app litenning on port 3000")
})