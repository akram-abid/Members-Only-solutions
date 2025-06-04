const { Router } = require("express");
const membersController = require("../controllers/membersController")
const routes = Router()

routes.get("/", membersController.checkSession, (req, res) => {
 res.send()
});
routes.get("/log-in", membersController.displayLoginForm)
routes.post("/log-in", membersController.verifyUser)
routes.get("/sign-up", membersController.displaySignupForm)
routes.post("/sign-up", membersController.storeNewAccount)
routes.get("/posts", (req, res) => {
    res.send("<h1>Posts</h1>")
});

module.exports = routes