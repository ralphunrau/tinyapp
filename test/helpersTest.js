const { assert } = require('chai');

const { usersHasEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userHasEmail', function() {
  it('should return true if the email is in the object', function() {
    const user = usersHasEmail("user@example.com", testUsers)
    const expectedBoolean = true;
    assert.equal(usersHasEmail(user, expectedBoolean))
  });
  it('should return false if an undefined email is a parameter', function() {
    const user = usersHasEmail("user3@example.com", testUsers)
    const expectedBoolean = false;
    assert.equal(usersHasEmail(user, expectedBoolean))
  });
});