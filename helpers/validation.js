const { check } = require('express-validator');

const validation = {
  registerValidation: function(){
    var validation = [
      check('username', 'Username should not be empty.')
      .notEmpty(),

      check('username', 'Usernames can only be a combination of letters and numbers to a maximum of 15 characters.')
      .isAlphanumeric(),

      check('username', 'Usernames can only be a combination of letters and numbers to a maximum of 15 characters.')
      .isLength({max: 15}),

      check('email', 'E-mail should not be empty.')
      .notEmpty(), 

      check('password', 'Password should not be empty.')
      .notEmpty(),

      check('password', 'Passwords must be at least 5 characters of length.')
      .isLength({min: 5}),

      check('firstname', 'First name should not be empty. This is what people will ' + 
      'see on recipes and comments.')
      .notEmpty(),
    ];

    return validation;
  }
}

module.exports = validation;