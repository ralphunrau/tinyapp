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

module.exports = { usersHasEmail, generateRandomString };