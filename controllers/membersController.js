exports.displayLoginForm = (req, res) => {
    res.render("login", {})
}

exports.verifyUser = (req, res) => {
    console.log("okay we are going to verfy this ", req.body.username, req.body.password)
    res.send()
}

exports.displaySignupForm = (req, res) => {
    res.render("signup")
}

exports.storeNewAccount = (req, res) => {
    console.log("okay we are going to verfy this ", req.body.username, req.body.password)
}