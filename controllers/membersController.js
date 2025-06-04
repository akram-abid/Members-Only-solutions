const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("../config/passport") 

exports.displayLoginForm = (req, res) => {
  res.render("login", {});
};

exports.verifyUser = (req, res) => {
  passport.authenticate("local", {
    successRedirect: "/log-in",
    failureRedirect: "/sign-up",
  })
};

exports.displaySignupForm = (req, res) => {
  res.render("signup");
};

exports.storeNewAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(`the password i set ${req.body.password} and the hashed one is ${hashedPassword}`)
  try {
    await db.storeNewMember(
      req.body.firstname,
      req.body.lastname,
      req.body.username,
      hashedPassword
    );
    res.redirect("/log-in");
  } catch (error) {
    console.error(error);
  }
};
