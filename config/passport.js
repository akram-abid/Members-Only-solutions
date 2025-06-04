const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries")
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username); // Use username instead of id
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await db.getUserByUsername(username);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;