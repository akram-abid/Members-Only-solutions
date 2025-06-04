const bcrypt = require("bcryptjs");
const db = require("../db/queries");

exports.displayLoginForm = (req, res) => {
  res.render("login", {});
};

exports.verifyUser = (req, res) => {
  console.log(
    "okay we are going to verfy this ",
    req.body.username,
    req.body.password
  );
  res.send();
};

exports.displaySignupForm = (req, res) => {
  res.render("signup");
};

exports.storeNewAccount = async (req, res) => {
  const hashedPassword = bcrypt.hash(req.body.password, 10);
  try {
    await db.storeNewMember(
      req.body.firtname,
      req.body.lastname,
      req.body.username,
      hashedPassword
    );
    res.redirect("/log-in");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
