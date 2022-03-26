//CONFIG
const PORT = 8080;
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const bcrypt = require('bcryptjs');
const { usersHasEmail, createUrlIfLogged, redirectTologin, userIsLogged } = require('./helpers.js');

//MIDDLEWARE
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//STORES THE USER DATA
const urlDatabase = {
  'b6UTxQ': {
    longURL: 'https://www.tsn.ca',
    userID: 'user0ID'
  },
  'i3BoGr': {
    longURL: 'https://www.google.ca',
    userID: 'user0ID'
  },
  '8fdg43': {
    longURL: 'https://www.google.ca',
    userID: 'user1ID'
  }
};

//USER OBJECT INITIALIZATION
let users = {
  
};

//ROUTES

//HOME PAGE
app.get('/', (req,res) => {
  const templateVars = { urls: urlDatabase, users, user: req.session.userID};
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//URL PAGE IF USER IS LOGGED IN
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase, users, user: req.session.userID};
  redirectTologin(req.session.userID, 'urls_index', res, templateVars)
});

//NEW URL PAGE IF USER IS LOGGED IN
app.get('/urls/new', (req,res) => {
  const templateVars = { users, user: req.session.userID };
  redirectTologin(req.session.userID, 'urls_new', res, templateVars)
});

//SHORT URL EDIT PAGE
app.get('/urls/:shortURL', (req,res) => {
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = { urls: urlDatabase, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, user: req.session.userID };
    res.render('urls_show', templateVars);
  } else {
    return res.sendStatus(res.statusCode = 403);
  }
});

//DELETES A SHORT URL LINK
app.post('/urls/:shortURL/delete', (req,res) => {
  if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    return res.sendStatus(res.statusCode = 403);
  }
});

//LONG URL STORED IN SHORT URL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    console.log('haf')
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    return res.sendStatus(res.statusCode = 403);
  }
});

//CREATES A NEW SHORT URL-LONG URL PAIR IF USER IS LOGGED IN
app.post('/urls', (req, res) => {
  const templateVars = { users, user: req.session.userID };
  createUrlIfLogged(req.session.userID, urlDatabase, req, res);
});

//ADDS A NEW URL IF USER IS LOGGED IN
app.post('/urls/:id', (req,res) => {
  if (req.session.userID === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    return res.sendStatus(res.statusCode = 403);
  }
});

//RENDERING THE LOGIN PAGE
app.get('/login', (req,res) => {
  const templateVars = { users, user: req.session.userID };
  userIsLogged(req.session.userID, 'login', res, templateVars);
});

//RENDERING THE REGISTER PAGE
app.get('/register', (req,res) => {
  const templateVars = { users, user: req.session.userID };
  userIsLogged(req.session.userID, 'register', res, templateVars);
});

//LOGIN PAGE IF USER IS NOT LOGGED IN
app.post('/login', (req,res) => {
  //INITIALIZING CURRENTKEY TO SPECIFY THE DESIRED USER
  let currentKey;
  for (const key in users) {
    if (req.body.email === users[key].email) {
      currentKey = key;
    }
  }
  //USING CURRENTKEY TO RETRIEVE INFO ABOUT LOGIN
  if (users[currentKey]) {
    const hashedPassword = users[currentKey].password;
    const passwordsMatch = bcrypt.compareSync(req.body.password, hashedPassword);
    if (currentKey && passwordsMatch && usersHasEmail(req.body.email, users)) {
      req.session.userID = currentKey;
    } else {
      return res.sendStatus(res.statusCode = 400);
    }
  } else {
    return res.sendStatus(res.statusCode = 400);
  }
  res.redirect('/urls');
});

//REGISTERS A NEW ACCOUNT IF USER DOESNT ALREADY HAVE ONE
app.post('/register', (req,res) => {
  //IF INPUT FIELDS ARE BLANK
  if (req.body.email === '' || req.body.password === '') {
    return res.sendStatus(res.statusCode = 400);
    //IF EMAIL ALREADY EXISTS
  } else if (usersHasEmail(req.body.email, users)) {
    return res.sendStatus(res.statusCode = 400);
    //IF EMAIL DOES NOT EXIST
  } else {
    const userObjSize = Object.keys(users).length;
    const currentID = `user${userObjSize + 1}ID`;
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 10);
    users[currentID] = {
      id: currentID,
      email: req.body.email,
      password: hashPassword
    };
    req.session.userID = currentID;
  }
  res.redirect('/urls');
});

//LOGGING OUT DELETES COOKIES
app.post('/logout', (req,res) => {
  req.session = null;
  res.redirect('/urls');
});

//SERVER CONSTRUCTOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});