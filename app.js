// Declare constants and require modules
// That we are going to be using
const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
const url = require("url")
const session = require("express-session")
const users = require("./testusers")

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
// calling to use the encryption var we declared
app.use(session(userSess))
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
// Set the user automatically to a false in session and redirect to
// the login page.
app.get("/", function(req, res, next) {
  console.log(req.session)
  // if req.session == truthy
  // render index
  // else, redirect to login
  req.session.authorized = false
  res.redirect("/login")
})

// Render login page first
app.get("/login", function(req, res, next) {
  res.render("login")
})

// Authenticate what we got from the form and compare it to your array
// of users.  Redirect to login if failed.
app.post("/authorization", function(req, res, ) {

  const loginName = req.body.username
  const passwordInfo = req.body.password
  let database;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === loginName && users[i].password === passwordInfo) {
      database = users[i]
    }
  }
  if (database) {
    req.session.user = database
    req.session.authorized = true
    res.redirect("/index")
  } else {
    res.render("login", {
      errorMessage: "Login Incorrect, please verify your username and password."
    })
  }
})
// Store the current session user into req.user to be used later

app.use(function(req, res, next) {
  req.user = req.session.user
  next()
})

// push the information to index
app.get("/index", function(req, res, next) {
  const currentUser = req.user
  res.render("index", {
    currentUser: currentUser

  })
})

app.listen(3000, function() {
  console.log("We is on 3000")
})
