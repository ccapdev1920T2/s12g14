const mongoose = require('mongoose');

const Profile = require('./models/profile-model');
const Recipe = require('./models/recipe-model');
const Like = require('./models/like-model');
const Comment = require('./models/comment-model');

module.exports.initializeDefault = function() {
  var admin = {
    username: "admin",
    email: "admin@example.com",
    pass_encrypted: "password",
    is_admin: true
  };

  Profile.create(admin);
};

module.exports.initializeDummy = function() {
  var profiles = [
    {
      username: "CookingBabe",
      lastname: "Ylagan",
      firstname: "Abby",
      join_date: new Date('2020-01-17T03:24:00'),
      email: "abby-ylagan@yopmail.com",
      bio: "Leaving a bit of sparkle everywhere I go ✨",
      pass_encrypted: "12345",
      picture_link: '/img/faces/igor-rand-Af9YhuGE7Qs-unsplash.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "AlmaAlyf",
      lastname: "Labrador",
      firstname: "Brigidia Alma",
      join_date: new Date('2020-01-23T03:24:00'),
      email: "alma-labrador@yopmail.com",
      bio: "fitness enthusiast + dog mom",
      pass_encrypted: "22345",
      picture_link: '/img/faces/conor-obrien-nKZuhvCGGQU-unsplash.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "PogiFood",
      lastname: "Bello",
      firstname: "Dante",
      join_date: new Date('2020-01-05T03:24:00'),
      email: "dante-bello@yopmail.com",
      bio: "Risk taker. Adventurer. Globetrotter. Living my dreams",
      pass_encrypted: "32345",
      picture_link: '/img/faces/stephen-smithgall-vhQZXB5nL3o-unsplash.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "LoloRaffy",
      lastname: "Olarte",
      firstname: "Rafe Quentin",
      join_date: new Date('2020-01-18T03:24:00'),
      email: "rafe-olarte@yopmail.com",
      bio: "\"The best thing you can do for someone is make them a beautiful plate of food.\" -Padma Lakshmi ",
      pass_encrypted: "42345",
      picture_link: null,
      is_admin: false,
      ban_until: null
    },
    {
      username: "TambayngDubai",
      lastname: "Gonzaga",
      firstname: "Gitana",
      join_date: new Date('2020-01-26T03:24:00'),
      email: "gitana-gonzaga@yopmail.com",
      bio: "اتَّكَلْنا منه على خُصٍّ الاتحاد قوة “Unity is power.”",
      pass_encrypted: "52345",
      picture_link: null,
      is_admin: false,
      ban_until: null
    }
  ];

  // Add all the other users here (5-10 will do)
  Profile.create(profiles, function(err, profileDocs) {
    if (err) return console.log("WARNING: failed to create profiles");
    var randomProfile = function() {
      return profileDocs[Math.floor(Math.random() * profileDocs.length)]._id;
    };

    // START RECIPES
    var recipes = [
      {
        name: "Ramen and Egg",
        picture_link: "/img/michele-blackwell-rAyCBQTH7ws-unsplash.jpg",
        author: randomProfile(),
        description: "This is delicious ramen.",
        servings: 2,
        ingredients: [
          "2 large eggs",
          "A cup of water",
          "4 cups chicken broth",
          "2 packs instant ramen",
          "4 oz. peeled and deveined shrimp",
          "4 oz. white mushrooms, sliced into halves",
          "2-3 tablespoons sriracha or to taste",
          "1 teaspoon sesame oil",
          "2 tablespoons chopped scallion",
          "salt to taste",
          "1 tablespoon lime juice, (optional)"
        ],
        steps: [
          "Place your eggs in a pot and add cold water. Make sure the water covers the eggs. Bring to a boil over high heat. Remove from the heat and set aside for 6 minutes. Rinse the eggs in cold water, peel off the shell and slice the eggs into halves. Set aside.",
          "Heat up the pot and add the chicken broth. Bring it to boil. Add the ramen and cook. When the ramen is about half done, add the shrimp, mushroom, Sriracha and sesame oil. Add the chopped scallion, salt and lime juice. Stir well and serve immediately."
        ],
        keywords: [ "ramen", "egg" ]
      }
    ];
    // END RECIPES

    Recipe.create(recipes, function(err, recipeDocs) {
      if (err) return console.log("WARNING: failed to create recipes");
      var randomRecipe = function() {
        return recipeDocs[Math.floor(Math.random() * recipeDocs.length)]._id;
      };

      var positiveComments = [
        "This one looks tasty.",
        "Delicious!",
        "I once tried to make this and it tasted like heaven",
        "Tasty!",
        "My friends all liked this one",
        "I want to eat this one with my friends",
        "I am speechless at how delicious this food is"
      ];

      var neutralComments = [
        "This one could taste better, but good job!",
        "Hmmm, might be better",
        "Not bad, but not good enough for me."
      ];

      var negativeComments = [
        "Doesn't taste good at all.",
        "Nope, pass"
      ];

      var offensiveComments = [
        "F***ing piece of s**t! You f***er!",
        "What is this piece of s**t?",
        "F*** YOU!"
      ];

      var commentTemplates = [
        positiveComments,
        neutralComments,
        negativeComments,
        offensiveComments
      ];

      var breakpoints = [ 0.85, 0.95, 0.99, 999.0 ];
      
      var randomComment = function() {
        var value = Math.random();
        var index = -1;
        for (var i = 0; i < breakpoints.length; i++) {
          if (value < breakpoints[i]) {
            index = i;
            break;
          }
        }

        if (index == -1) index = 0;
        var template = commentTemplates[index];
        return template[Math.floor(Math.random() * template.length)];
      };


    });
  });
};
