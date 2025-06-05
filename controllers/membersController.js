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

      return res.redirect("/posts");
    });
  })(req, res, next);
};

exports.displaySignupForm = (req, res) => {
  res.render("signup");
};

exports.storeNewAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(
    `the password i set ${req.body.password} and the hashed one is ${hashedPassword}`
  );
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

exports.displayTheMainPage = async (req, res) => {
  const posts = await db.getAllPosts();
  res.render("main", { posts: posts , username: req.user.username});
}

exports.addNewPost = async (req, res, next) => {
  const user = await db.getUserByUsername(req.user.username);
  await db.addNewPost(
    user.username,
    user.firstname,
    user.lastname,
    req.body.title,
    req.body.content
  );
  res.redirect("/posts");
};

exports.checkSession = async (req, res, next) => {
  try {
    const publicRoutes = ["/log-in", "/sign-up"];
    console.log("here is the path of yours ", req.path);
    if (publicRoutes.includes(req.path)) {
      if ("its / then i not supposed to be here") return next();
    }

    const sessionId = req.sessionID;

    if (req.path === "/") {
      console.log(
        "this is the session id you have been looking for ",
        sessionId
      );
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

// In membersController.js
exports.logout = (req, res, next) => {
  const sessionId = req.sessionID; // Get the session ID before destroying

  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");

      // Optional: Manually delete from database (connect-pg-simple should handle this automatically)
      // But if you want to be explicit:
      /*
      const pool = require('../db/pool'); // Your database pool
      pool.query('DELETE FROM sessions WHERE sid = $1', [sessionId], (err) => {
        if (err) console.error('Error deleting session from DB:', err);
      });
      */

      res.redirect("/log-in"); // Redirect to login page
      console.log("i redirected the user to log in again");
    });
  });
};

/*exports.logoutUser = async (req, res) => {
  //try {
    req.logout((err) => {
      if (err) {
        console.log("okay log me out")
        return next(err);
      }
      res.redirect("/");
    });
    /*const sessionId = req.sessionID;
    console.log("Logging out user with session:", sessionId);

    // Optional: Remove session from database if you're storing them
    // if (sessionId) {
    //   await db.deleteSession(sessionId);
    // }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.redirect("/posts");
      }

      // Clear the session cookie
      res.clearCookie("connect.sid"); // Default session cookie name
      console.log("User logged out successfully");
      res.redirect("/log-in");
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/posts");
  }*/
