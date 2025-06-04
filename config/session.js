const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
const pgPool = require("../db/pool");

const session = expressSession({
  store: new pgSession({
    pool: pgPool,
    tableName: "sessions",
  }),
  secret: "some secret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
});

module.exports = session