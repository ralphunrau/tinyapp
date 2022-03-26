//FUNCTION TO LOOKUP AN EMAIL
const usersHasEmail = (specificEmail, userObj) => {
  for (const key in userObj) {
    if (userObj[key].email === specificEmail) {
      return userObj[key];
    }
  }
};

//FUNCTION TO CREATE A SHORT URL STRING
const generateRandomString = () => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let x = 0; x < 6; x++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

//FUNCTION TO VALIDATE USER TO CREATE A NEW SHORTURL
const createUrlIfLogged = (user, urlDatabase, req, res) => {
  if (user) {
    const randomString = generateRandomString();
    urlDatabase[randomString] = { longURL: req.body.longURL, userID: user };
    res.redirect(`/urls/${randomString}`);
  } else {
    res.redirect('/urls');
  }
};

//FUNCITON TO REDIRECT TO LOGIN IF TRYING TO ACCESS URLS WITHOUT AN ACCOUNT
const redirectTologin = (user, redirectToPage, res, templateVars) => {
  if (user) {
    res.render(redirectToPage, templateVars);
  } else {
    res.redirect('/login');
  }
};

//IF USER IS LOGGED IN
const userIsLogged = (user, render, res, templateVars) => {
  if (user) {
    res.redirect('/urls');
  } else {
    res.render(render, templateVars);
  }
};

module.exports = { usersHasEmail, generateRandomString, createUrlIfLogged, redirectTologin, userIsLogged};
