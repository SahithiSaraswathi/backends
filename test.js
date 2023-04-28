const assert = require('assert');
const login = require('../client/log_test.js');

describe('Login', function() {
  describe('#authenticate()', function() {
    it('should return true if the username and password are valid', function() {
      assert.equal(login.authenticate('user@gmail.com', '12345'), true);
    });

    it('should return false if the username is invalid', function() {
      assert.equal(login.authenticate('invalidusername', 'password123'), false);
    });

    it('should return false if the password is invalid', function() {
      assert.equal(login.authenticate('lalitha.s20@iiits.in', ''), false);
    });
  });
});
