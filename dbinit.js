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
      },
      {
        name: "Baked Bread",
        picture_link: "/img/stephen-walker-_-SwhhV7tSo-unsplash.jpg",
        author: randomProfile(),
        description: "I learned this during summer.",
        servings: 6,
        ingredients: [
          "1 1/2 cups warm water (95 F to 110 F)",
          "2 1/4 teaspoons or 1 package (1/4 ounce) active dry yeast",
          "1/2 cup milk",
          "1 tablespoon sugar, coconut sugar, or raw sugar",
          "2 teaspoons salt or sea salt",
          "1/3 cup canola oil, coconut oil, or shortening",
          "About 4 1/2 cups bread flour",
          "Optional: egg white or milk for brushing on the loaf",
          "1 tablespoon butter (melted)"
        ],
        steps: [
          "In a large bowl, mix the warm water and yeast. Add the milk, sugar, salt, and oil and stir to combine.",
          "Add in enough bread flour to make a dough that follows the spoon around the bowl.",
          "Turn the dough out onto a lightly floured surface and knead it for 8 minutes, adding more bread flour as needed until the dough is firm and smooth to the touch.",
          "Place the dough in a medium greased bowl. Turn dough over in the bowl so that the top is also lightly greased. Cover with clean cloth and let rise in warm, draft-free place for 1 hour.",
          "Punch down the dough. Turn the dough out onto a lightly floured surface and knead it for about 5 minutes or until the bubbles are out of the bread. Shape the dough into a round loaf and place it in a greased 1 1/2-quart round casserole dish. Cover and let rise in a warm, draft-free place for 45 minutes or until doubled in size.",
          "Preheat oven to 375 F. With a sharp knife or razor, slash the top of the bread. For a glossy top, brush an egg white on top of the loaf, or brush loaf with milk before baking to produce a dark, shiny crust. ",
          "Bake the bread for 45 minutes or until the bread sounds hollow when the top is tapped. Remove the bread from the casserole dish and let cool on a rack. Brush loaves with butter immediately after baking to produce a soft crust."
        ],
        keywords: [ "baking", "bread" ]
      },
      {
        name: "White Pasta",
        picture_link: "/img/nerfee-mirandilla-huE4NUt2gq8-unsplash.jpg",
        author: randomProfile(),
        description: null,
        servings: 6,
        ingredients: [
          "12 ounces dried fettucine",
          "3 tablespoons butter",
          "12 ounces skinless, boneless chicken breast halves, cut into bite-size pieces",
          "2 large red or yellow bell peppers, cut into bit-size strips",
          "3 cloves garlic, minced",
          "1 1/4 cups heavy whipping cream",
          "1/2 teaspoon salt",
          "1/8 teaspoon black pepper",
          "2/3 cup grated Parmesan cheese",
          "Grated Parmesan cheese",
          "Fresh basil"
        ],
        steps: [
          "Cook fettuccine according to package directions in a large pot. Drain and return to the pot; cover to keep warm.",
          "Melt butter over medium heat in a large skillet. Add chicken; cook for 3 to 4 minutes or until cooked through and no pink remains. Remove with slotted spoon. Add bell peppers to pan; cook for 5 minutes, stirring occasionally. Add garlic to pan; cook for 1 minute more. Add whipping cream, salt, and black pepper to pan; bring to a boil. Boil gently, uncovered, for 2 to 3 minutes or until mixture begins to thicken. Remove from heat; add the 2/3 cup Parmesan cheese and cooked chicken.",
          "Add cooked fettuccine to the pan; stir gently. Serve with additional Parmesan cheese and fresh basil.",
          "[Cleaning Tip: Once the stove top is cool, wipe off any oil splatters or spills with Clorox(R) Disinfecting Wipes*.]",
        ],
        keywords: [ "pasta" ]
      },
    ];
    // END RECIPES

    Recipe.create(recipes, function(err, recipeDocs) {
      if (err) return console.log("WARNING: failed to create recipes");

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

      for (var i = 0; i < recipeDocs.length; i++) {
        var recipe = recipeDocs[i];
        var numLikes = Math.floor(Math.random() * profileDocs.length);
        var numComments = Math.floor(Math.random() * profileDocs.length);

        var tmpFans = profileDocs.slice(0).map(d => d.toObject());
        var likes = [];
        while (numLikes > 0) {
          var index = Math.floor(Math.random() * tmpFans.length);
          likes.push({
            sender: tmpFans[index]._id,
            recipe: recipe._id
          });
          tmpFans.splice(index, 1);
          numLikes--;
        }
        
        var tmpCommenters = profileDocs.slice(0).map(d => d.toObject());
        var comments = [];
        while (numComments > 0) {
          var index = Math.floor(Math.random() * tmpCommenters.length);
          comments.push({
            text: randomComment(),
            author: tmpCommenters[index]._id,
            recipe: recipe._id
          });
          tmpCommenters.splice(index, 1);
          numComments--;
        }

        if (likes.length > 0)
          Like.create(likes, function(err) {
            if (err) return console.log("Failed to create likes");
          });
        
        if (comments.length > 0)
          Comment.create(comments, function(err) {
            if (err) return console.log("Failed to create comments");
          });
      }
    });
  });
};
