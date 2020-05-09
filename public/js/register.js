$(document).ready(function() {

  function isFilledBasic() {
    var username = validator.trim($('#username').val());
    var email = validator.trim($('#email').val());
    var password = validator.trim($('#password').val());
    var confirmPwd = validator.trim($('#confirm').val());

    var usernameEmpty = validator.isEmpty(username);
    var emailEmpty = validator.isEmpty(email);
    var passwordEmpty = validator.isEmpty(password);
    var confirmPwdEmpty = validator.isEmpty(confirmPwd);
    
    if (usernameEmpty) $('#usernameError').text('Username should not be empty.');
    if (emailEmpty) $('#emailError').text('E-mail should not be empty.');
    if (passwordEmpty) $('#passwordError').text('Password should not be empty.');

    return !usernameEmpty && !emailEmpty && !passwordEmpty && !confirmPwdEmpty;
  }

  function isValidPwd(){
    var password = validator.trim($('#password').val());
    var isValidLength = validator.isLength(password, {min: 5});

    if (isValidLength) {
       $('#passwordError').text('');
      return true;
    } 
    else {
      $('#passwordError').text('Passwords must be at least 5 characters of length.')
    }

    return false;
  }

  function isValidConfirmPwd(){
    var password = validator.trim($('#password').val());
    var confirm = validator.trim($('#confirm').val());

    if (password === confirm) {
      $('#confirmError').text('');
      return true;
    } 
    else
      $('#confirmError').text('Password confirmation does not match original password.');

    return false;
  }

  function isValidUsername(callback){
    var username = validator.trim($('#username').val());
    var isValidUsername = validator.isAlphanumeric(username) && validator.isLength(username, {max: 15});
    if (isValidUsername) {
      $.get('/getCheckUsername', {username: username}, function(result){
        if (result.username != username) {
          $('#usernameError').text('');
          return callback(true);
        } else {
            $('#usernameError').text('Username is already registered, please try another.');
          return callback(false);
        }
      });
    } else
      $('#usernameError').text('Usernames can only be a combination of letters and numbers to a maximum of 15 characters.');
    return callback(false);
  }

  function isValidEmail(){
    var email = validator.trim($('#email').val());
    var isEmail = validator.isEmail(email);
    if (isEmail) {
      $('#emailError').text('');
      return true;
    } 
    else
        $('#emailError').text('E-mail does not follow the correct format, please try again.');
    return false;
  }

  function validateBasic(){
    var filled = isFilledBasic();
    var validPassword = isValidPwd();
    var validConfirmPwd = isValidConfirmPwd();
    var validEmail = isValidEmail();

    isValidUsername(function(isValidUsername){
      if (filled && validPassword && validConfirmPwd && validEmail && isValidUsername)
        $('#next').prop('disabled', false);
      else
        $('#next').prop('disabled', true);
    });
  }

  function validateBio(){
    var firstname = validator.trim($('#firstname').val());
    var firstnameEmpty = validator.isEmpty(firstname);
    if (!firstnameEmpty) {
      $('#final-submit').prop('disabled', false);
      $('#firstnameError').text('');
    }
    else {
      $('#final-submit').prop('disabled', true);
      $('#firstnameError').text('First name should not be empty. This is what people will ' + 
        'see on recipes and comments.');
    }
  }

  $('.input-basic').on("keyup", validateBasic);
  $('.input-bio').on("keyup", validateBio);

  $("#next").click(function() {
    $("#register-basic").removeClass("current").hide();
    $("#register-bio").addClass("current").show();
  });
  $("#prev").click(function() {
    $("#register-bio").removeClass("current").hide();
    $("#register-basic").addClass("current").show();
  });
  $("#display").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function(image) {
        $("#display-preview").attr("src", image.target.result);
        $("#display-preview").show();
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  function trySubmit() {
    if (!$("#register-bio").hasClass("current")) {
      $("#next").click();
      return false;
    }
    return true;
  }
  
  $("#register").keypress(function(e) {
    if (e.which == 13) $("#register").submit();
  });
  
  $("#register").submit(function() {
    return trySubmit();
  });
});
