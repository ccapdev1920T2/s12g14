const db = require('./database/db.js');
const collection = 'profiles';

db.createDatabase();

/*
    creates an object
    containing first name, last name, username, and bio of a user
*/
var user = {
  username: "CookingBabe",
  lastname: "Ylagan",
  firstname: "Abby",
  join_date: new Date('2020-1-17T03:24:00'),
  email: "abby-ylagan@yopmail.com",
  bio: "Leaving a bit of sparkle everywhere I go ✨",
  pass_encrypted: "12345",
  picture_link: "profile1pic",
  is_admin: false,
  ban_until: null
};

db.insertOne(collection, user);

