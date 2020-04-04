const db = require('./database/db2.js');
const collection = 'profiles';

db.createDatabase();

/*
    creates an object
    containing first name, last name, username, and bio of a user
*/
var user = {
  _id:"user1",
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

var user = {
  _id:"user1",
  username: "AlmaAlyf",
  lastname: "Labrador",
  firstname: "Brigidia Alma",
  join_date: new Date('2020-1-23T03:24:00'),
  email: "alma-labrador@yopmail.com",
  bio: "fitness enthusiast + dog mom",
  pass_encrypted: "22345",
  picture_link: "profile2pic",
  is_admin: false,
  ban_until: null
};

db.insertOne(collection, user);

var user = {
  _id:"user1",
  username: "PogiFood",
  lastname: "Bello",
  firstname: "Dante",
  join_date: new Date('2020-1-5T03:24:00'),
  email: "dante-bello@yopmail.com",
  bio: "Risk taker. Adventurer. Globetrotter. Living my dreams",
  pass_encrypted: "32345",
  picture_link: "profile3pic",
  is_admin: false,
  ban_until: null
};

db.insertOne(collection, user);

var user = {
  _id:"user1",
  username: "LoloRaffy",
  lastname: "Olarte",
  firstname: "Rafe Quentin",
  join_date: new Date('2020-1-18T03:24:00'),
  email: "rafe-olarte@yopmail.com",
  bio: "\"The best thing you can do for someone is make them a beautiful plate of food.\" -Padma Lakshmi ",
  pass_encrypted: "42345",
  picture_link: "profile4pic",
  is_admin: false,
  ban_until: null
};

db.insertOne(collection, user);

var user = {
  _id:"user1",
  username: "TambayngDubai",
  lastname: "Gonzaga",
  firstname: "Gitana",
  join_date: new Date('2020-1-26T03:24:00'),
  email: "gitana-gonzaga@yopmail.com",
  bio: "اتَّكَلْنا منه على خُصٍّ الاتحاد قوة “Unity is power.”",
  pass_encrypted: "52345",
  picture_link: "profile5pic",
  is_admin: false,
  ban_until: null
};

db.insertOne(collection, user);

const collection = 'recipes';

var user = {
  _id:"recipe1",
  name: "Mojos",
  picture_link: "Mojos.jpeg",
  author: "user1",
  description: "",
  ingredients: "abby-ylagan@yopmail.com",
  steps: "Leaving a bit of sparkle everywhere I go ✨",
  keywords: "12345",
  time_upload: "profile1pic",
};

db.insertOne(collection, user);


