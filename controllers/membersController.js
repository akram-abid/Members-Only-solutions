const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("../config/passport");

exports.displayLoginForm = (req, res) => {
  res.render("login", {});
};

exports.verifyUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("Login failed:", info.message);
      return res.redirect("/sign-up");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(`User ${user.username} logged in successfully`);

      return res.redirect("/success");
    });
  })(req, res, next);
};

exports.displaySignupForm = (req, res) => {
  res.render("signup");
};

exports.storeNewAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(`the password i set ${req.body.password} and the hashed one is ${hashedPassword}`);
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

exports.checkSession = async (req, res, next) => {
  try {
    // Handle root route differently
    if (req.path === '/') {
      const sessionId = req.sessionID;
      
      if (sessionId) {
        const rows = await db.checkSession(sessionId);
        if (rows.length > 0) {
          console.log("User authenticated, redirecting to posts");
          return res.redirect("/posts"); // User is logged in, go to posts
        }
      }
      
      console.log("User not authenticated, redirecting to login");
      return res.redirect("/log-in"); // No valid session, go to login
    }

    // Skip authentication for other public routes
    const publicRoutes = ['/log-in', '/sign-up', '/signup', '/login'];
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    // For protected routes, check session
    const sessionId = req.sessionID;
    
    if (!sessionId) {
      console.log("No session ID found for protected route");
      return res.redirect("/log-in");
    }

    const rows = await db.checkSession(sessionId);
    if (rows.length > 0) {
      console.log("Session valid for protected route");
      return next();
    } else {
      console.log("Invalid session for protected route");
      return res.redirect("/log-in");
    }
    
  } catch (err) {
    console.error("Session check error:", err);
    return res.redirect("/log-in");
  }
};