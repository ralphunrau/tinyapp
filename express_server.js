//CONFIG
const PORT = 8080;
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const bcrypt = require('bcryptjs');

//MIDDLEWARE
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//SHORT URLS AND CORRESPONDING LONG URL OBJECT
/* let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}; */

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: 'user1ID'
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: 'user1ID'
  },
  '8fdg43': {
    longURL: "https://www.google.ca",
    userID: 'user2ID'
  }
};

//FUNCTION TO RETURN USER SPECIFIC URLS
function urlsForUser(id) {
  let usersURLs = {};
  for (const key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      usersURLs[key] = urlDatabase[key];
    }
  }
  return usersURLs;
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
  if (templateVars.user) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.get('/urls/:shortURL', (req,res) => {
  const templateVars = { urls: urlDatabase, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, user: req.cookies['user_id'] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
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
  const hashedPassword = users[currentKey].password;
  let passwordsMatch = bcrypt.compareSync(req.body.password, hashedPassword);
  if (currentKey && passwordsMatch && usersHasEmail(users, req.body.email)) {
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
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    console.log('2')
  }
  console.log('1')
  res.redirect("/urls");
});

app.post('/urls/:id', (req,res) => {
  if (req.cookies['user_id'] === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    console.log('4')
  }
  console.log('3')
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (req.cookies['user_id']) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/urls');
    return;
  }
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
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 10);
    users[currentID] = {
      id: currentID,
      email: req.body.email,
      password: hashPassword
    };
    res.cookie('user_id', currentID);
  }
  res.redirect('/urls');
});

//SERVER CONSTRUCTOR
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});