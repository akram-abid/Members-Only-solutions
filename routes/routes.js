const { Router } = require("express");
const membersController = require("../controllers/membersController")
const routes = Router()

routes.get("/log-in", membersController.displayLoginForm)
routes.post("/log-in", membersController.verifyUser)
routes.get("/sign-up", membersController.displaySignupForm)
routes.post("/sign-up", membersController.storeNewAccount)

module.exports = routes