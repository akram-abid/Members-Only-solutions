const express = require("express")
const pg = require("pg")
const expressSession = require("express-session")
const pgSession = require("connect-pg-simple")(expressSession)
const routes = require("./routes/routes")
const app = express()
const path = require("node:path");
const session = require("./config/session")
const memberController = require("./controllers/membersController")
const passport = require("./config/passport")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json())

// Session middleware MUST come before Passport
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }))
app.use(async (req, res) => {
    const result = await db.query(
      "SELECT 1 FROM pg_database WHERE datname = 'onlymembers'"
    );
    console.log("okay this is it the database ", result)
})
app.use(memberController.checkSession);   

app.use("/", routes);
app.listen(3000, () => {
    console.log("app listening on port 3000")
})