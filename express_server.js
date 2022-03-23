//CONFIG
const PORT = 8080;
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//COOKIES
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));

//READ BODY
const bodyParser = require("body-parser");

//SHORT URLS AND CORRESPONDING LONG URLS
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

//FUNCTION TO CREATE A SHORT URL STRING
const generateRandomString = () => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

//GET ROUTES
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req,res) => {
  const templateVars = { username: req.cookies["username"]  };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req,res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//POST ROUTES
app.post('/login', (req,res) => {
  const user = req.body.username;
  res.cookie('username', user);
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post('/urls/:id', (req,res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

//SERVER CONSTRUCTOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});