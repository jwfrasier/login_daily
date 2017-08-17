// Declare constants and require modules
// That we are going to be using
const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
const url = require("url")
const session = require("express-session")
const users = require("./users")

app.engine("mustache", mustache())
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: false
}))

// Encrypting the session
var userSess = {
  secret: "keyboard cat",
  cookie: {},
  saveUninitialized: true,
  resave: true
}

// This will parse the url if it is entered in uppercase
// and will just redirect to the page with lowercase char
app.use(function(req, res, next) {
  if (req.path.toLowerCase() !== req.path) {
    var parsedUrl = url.parse(req.originalUrl)
    parsedUrl.pathname = parsedUrl.pathname.toLowerCase()
    res.redirect(url.format(parsedUrl))
  } else {
    next()
  }
})
app.use(session(userSess))

// Render the home page
app.get("/", function(req, res, next) {

})

app.listen(3000, function() {
  console.log("We is on 3000")
})
