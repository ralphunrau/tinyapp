//CONFIG
const PORT = 8080;
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//MIDDLEWARE
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//SHORT URLS AND CORRESPONDING LONG URL OBJECT
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//USER OBJECT
let users = {
  
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

//FUNCTION TO LOOKUP AN EMAIL
const usersHasEmail = (userObj, specificEmail) => {
  for (const key in userObj) {
    if (userObj[key].email === specificEmail) {
      return true;
    }
  }
  return false;
};

//GET ROUTES
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, users, user: req.cookies['user_id']};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req,res) => {
  const templateVars = { users, user: req.cookies['user_id'] };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req,res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], users, user: req.cookies['user_id'] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/register', (req,res) => {
  const templateVars = { users, user: req.cookies['user_id'] };
  res.render('register', templateVars);
});

app.get('/login', (req,res) => {
  const templateVars = { users, user: req.cookies['user_id'] };
  res.render('login', templateVars)
});

//POST ROUTES
app.post('/login', (req,res) => { 
  let currentKey;
  for (const key in users) {
    if(req.body.email === users[key].email) {
      currentKey = key;
    }
  }
  if (users[currentKey].password === req.body.password && usersHasEmail(users, req.body.email)) {
    res.cookie('user_id', currentKey)
  } else {
    res.statusCode = 403;
  }
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
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

app.post('/register', (req,res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.statusCode = 400;
  } else if (usersHasEmail(users, req.body.email)) {
    res.statusCode = 400;
  } else {
    const userObjSize = Object.keys(users).length;
    const currentID = `user${userObjSize + 1}ID`;
    users[currentID] = {
      id: currentID,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', currentID);
  }
  res.redirect('/urls');
});

//SERVER CONSTRUCTOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});