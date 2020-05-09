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
      join_date: new Date('2020-01-05T10:54:00'),
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
      join_date: new Date('2020-01-07T13:41:00'),
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
      join_date: new Date('2020-01-11T09:01:00'),
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
      join_date: new Date('2020-01-09T14:09:00'),
      email: "rafe-olarte@yopmail.com",
      bio: "\"The best thing you can do for someone is make them a beautiful plate of food.\" -Padma Lakshmi ",
      pass_encrypted: "42345",
      picture_link: '/img/faces/LoloRaffy.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "TambayngDubai",
      lastname: "Gonzaga",
      firstname: "Gitana",
      join_date: new Date('2020-01-04T16:32:00'),
      email: "gitana-gonzaga@yopmail.com",
      bio: "اتَّكَلْنا منه على خُصٍّ الاتحاد قوة “Unity is power.”",
      pass_encrypted: "52345",
      picture_link: '/img/faces/TambayngDubai.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "angels_basket",
      lastname: "Evangelista",
      firstname: "Monte",
      join_date: new Date('2020-01-08T16:14:00'),
      email: "monte-evangelista@yopmail.com",
      bio: "All your dreams can come true and I'll make sure of it.",
      pass_encrypted: "62345",
      picture_link: '/img/faces/angels_basket.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "true.living",
      lastname: "Corporal",
      firstname: "Spencer",
      join_date: new Date('2020-01-06T11:09:00'),
      email: "spencer-corporal@yopmail.com",
      bio: "In a world of average, I’m savage",
      pass_encrypted: "72345",
      picture_link: '/img/faces/true.living.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "iamwellandgood",
      lastname: "Miedes",
      firstname: "Korbin",
      join_date: new Date('2020-01-11T17:42:00'),
      email: "korbin-miedes@yopmail.com",
      bio: "I believe in helping people",
      pass_encrypted: "82345",
      picture_link: '/img/faces/iamwellandgood.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "publicbutter",
      lastname: "Halili",
      firstname: "Tommy",
      join_date: new Date('2020-01-06T15:32:00'),
      email: "tommy-halili@yopmail.com",
      bio: "Be young. Be dope. Run the show.",
      pass_encrypted: "92345",
      picture_link: '/img/faces/publicbutter.jpg',
      is_admin: false,
      ban_until: null
    },
    {
      username: "wherearetheavocados",
      lastname: "Batac",
      firstname: "Catalin",
      join_date: new Date('2020-01-09T12:12:00'),
      email: "catalin-batac@yopmail.com",
      bio: "Love 💗 and Peace ✌️",
      pass_encrypted: "02345",
      picture_link: '/img/faces/wherearetheavocados.jpg',
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
          "[Cleaning Tip: Once the stove top is cool, wipe off any oil splatters or spills with Clorox(R) Disinfecting Wipes*.]"
        ],
        keywords: [ "pasta" ]
      },
      {
        name: "Mojos",
        picture_link: '/img/Mojos.jpg',
        author: randomProfile(),
        description:"Anyone who orders from Shakey's almost always orders the famous mojos (potato slices), too.  Since dining out isn't an option because all Metro Manila Shakey's branches are temporarily closed because of the quarantine, the next best thing you can do is to recreate your faves with food hacks!",
        servings: 10,
        ingredients: [
          " potato (cut into 9-millimiter slices)",
          " 100 grams of fried chicken breading mix",
          " 30 grams of salt",
          " 10 grams of pepper"
        ],
        steps: [
          " 1 Microwave the sliced potato spuds for five minutes-it is preferred that the microwave has a power setting of 700 watts.",
          " 2 Combine the dry ingredients: fried chicken breading mix, salt, and pepper in one bowl.",
          " 3 Toss the potato spuds in the mix until no surface is left unseasoned. Be careful when you do this since the potatoes are going to be hot.",
          " 4 Deep-fry to your preferred level of crispiness."
        ],
        keywords: [ "shakey" ]
      },
      {
        name: "Chicken Goto Recipe",
        picture_link: '/img/Chicken_Goto_Recipe.jpg',
        author: randomProfile(),
        description:"Do you know the differences between goto, lugaw, and congee? All of these are your basic rice porridge dishes usually made with malagkit rice that is simmered in lots of water to create a gruel. Chicken lugaw is more commonly known as arroz caldo since the congee is made with meaty chicken pieces and flavored with ginger. When it's made with beef tripe, this lugaw is known a goto. This chicken goto recipe is really a mashup of two of these: the arroz caldo and the goto. This is an arroz caldo because it's flavored with chicken and ginger but it's also a goto because chicken isaw (intestines) and balunbalunan (gizzard) are added to the mix making it even heartier than your usual lugaw! ",
        
        servings: 6,
        ingredients: [
          "1/8 kilogram chicken intestine (isaw), cut into 3-inch lengths",
          "100 grams chicken gizzard (balunbalunan)",
          "2 tablespoons vegetable oil",
          "1 small red onion, peeled, chopped",
          "3 cloves garlic, peeled, chopped",
          "2 inches fresh ginger, peeled, sliced into strips",
          "1/2 cup glutinous rice (malagkit)",
          "4 cups water, more as needed",
          "1 1/2 tablespoons fish sauce (patis), or to taste",
          "4 pieces chicken wings",
          "firm tofu (tokwa), sliced and fried, to serve",
          "green onions, to serve",
          "ground black pepper, to serve",
          "toasted garlic, to serve"

        ],
        steps: [
          "In a large bowl, sprinkle salt and vinegar over the chicken intestines and the gizzards. Rub the salt into the innards to thoroughly remove and clean it. Rinse well over running water, turning the intestines inside out to thoroughly clean. Set aside.",
          "In a pot over medium heat, heat oil. Add and sauté onions, garlic, and ginger.",
          "Add the rice and stir to mix with the flavored oil. Add the chicken, isaw, and balunbalunan. Add the water and patis, bring to a boil, then reduce to a simmer.",
          "Lower the heat and simmer for 30 to 40 minutes, stirring regularly. Simmer the rice and the chicken parts until the mixture thickens and chicken cooked through. Add more water to adjust the porridge to your desired consistency.",
          "Ladle into bowls, and serve with fried tokwa, green onions, ground black pepper, and toasted garlic."
        ],
        keywords: [ "Filipino" ]
      },
      {
        name: "Malunggay and Corn Soup with Egg Recipe",
        picture_link: '/img/Malunggay_and_Corn_Soup_with_Egg_Recipe.jpg',
        author: randomProfile(),
        description:"Do you know the differences between goto, lugaw, and congee? All of these are your basic rice porridge dishes usually made with malagkit rice that is simmered in lots of water to create a gruel. Chicken lugaw is more commonly known as arroz caldo since the congee is made with meaty chicken pieces and flavored with ginger. When it's made with beef tripe, this lugaw is known a goto. This chicken goto recipe is really a mashup of two of these: the arroz caldo and the goto. This is an arroz caldo because it's flavored with chicken and ginger but it's also a goto because chicken isaw (intestines) and balunbalunan (gizzard) are added to the mix making it even heartier than your usual lugaw! Malunggay and corn soup isn't a new idea. It's actually one of the simplest ways of making soup! It's basically just four ingredients: malunggay, corn, an onion, and chicken broth. A little oil gently heats up the ingredients, and salt and pepper to boost the overall flavors are all that's needed to make this flavorful and hearty soup. It's a simple dish, so why not add a little something to make it even more delicious? Make it a mashup of the egg drop soup and the malunggay and corn soup to make it more appetizing. Plus, we ditch the popular yellow corn for some sweet purple and white corn instead. Also known as Batik or Violeta, this dual-colored white corn variety is much like the waxy white corn ears but tastes sweeter and is more nutritious overall than the yellow corn. You will more easily find these purple and white corn ears around the country in supermarkets (we found ours in Robinsons Supermarket!) and palengkes. ",
        
        servings: 6,
        ingredients: [
          "1 tablespoon vegetable oil",
          "1 medium red onion, peeled, sliced thinly",
          "5 cups chicken broth, Or 1 chicken bouillon cube dissolved in 5 cups water",
          "4 small ears white and purple corn, husked and kernels cut from cob",
          "1 large egg",
          "1 cup malunggay leaves",
          "salt, to taste",
          "ground black pepper, to taste"
        ],
        steps: [
          "Heat oil in a medium pot. Add onion, and saute until just softened. Add the chicken stock, grated corn, corn cobs, and bring to a simmer for about 10 minutes or until the corn is cooked through and tender. Remove the corn cobs.",
          "In a small bowl, beat the egg with a fork. While the soup is simmering, wave your fork over the soup while you slowly drizzle the beaten egg over the fork. (The fork will prevent large globs of the egg to drop into the soup. This method will create the strands.)",
          "Season with salt and pepper to taste. Stir in the malunggay leaves to become heated through just before serving. Serve while hot."
          
        ],
        keywords: [ "Filipino","healthy" ]
      },
      {
        name: "Chicken Pakam Recipe",
        picture_link: '/img/Chicken_Pakam_Recipe.jpg',
        author: randomProfile(),
        description:"This regional dish from Bulacan is a simple chicken and ginger dish. However, what makes it super delicious is the way it's cooked. You taste all the flavors in one amazing bite! It's simple yet delicious! ",
        
        servings: 4,
        ingredients: [
          "1 small red onion, choppped",
          "5 cloves garlic, chopped",
          "2 tablespoons ginger, chopped",
          "4 pieces tomatoes, chopped",
          "4 pieces chicken thighs",
          "2 tablespoons white vinegar",
          "2 tablespoons fish sauce (patis)",
          "1/2 cup water",
          "2 tablespoons oil"
        ],
        steps: [
          "Saute onions, garlic, and ginger in oil until onions are translucent. Add the tomatoes and cook until softened.",
          "Add the chicken. Mix with the aromatics until chicken has browned a bit.",
          "Add the vinegar and fish sauce. Add water, lower the heat, and cook, covered, for about 25 to 30 minutes. Serve with hot rice."
          
        ],
        keywords: [ "Filipino","chicken" ]
      },
      {
        name: "No-Cook Ham and Cheese Palaman",
        picture_link: '/img/No-Cook_Ham_and_Cheese_Palaman.jpg',
        author: randomProfile(),
        description:"Ham and cheese is a combination that is an instant hit! From a simple placing of a slice each of ham and cheese between bread slices, you can amp up the flavor by adding more to the mix. Here, ham is chopped up and the cheese is grated, but there is more to it than just that. Pickle relish is added to the mix for a touch of tangy-sweetness and a tiny crunch while the mayonnaise becomes the silky creaminess that combines all the ingredients together. The condensed milk is optional but it boosts both the sweetness and creaminess of the spread.  ",
        
        servings: 6,
        ingredients: [
          "250 grams cooked ham, chopped",
          "1 80-ml pack mayonnaise",
          "1/2 cup cheddar cheese, grated large",
          "1/4 cup cheese spread",
          "2 tablespoons pickle relish",
          "1 tablespoon condensed milk, optional or to taste",
          "bread slices, toasted lighty",
          "6 slices cheddar cheese"
        ],
        steps: [
          "In a medium bowl, mix ham, cheese, cheese spread, mayonnaise, pickle relish, and condensed milk together until well combined.",
          "Lightly toast bread slices.",
          "To assemble, place cheddar cheese slice on on slice of bread, spread with ham mixture, and top with bread slice. Repeat. Serve immediately."
          
        ],
        keywords: [ "Filipino","snack" ]
      },
      {
        name: "Pork Ribs Tinola",
        picture_link: '/img/Pork_Ribs_Tinola.jpg',
        author: randomProfile(),
        description:"What makes swapping out one kind of meat for another kind of meat difficult? For this tinola reicpe, nothing! It's an easy swap to tweak your tinola recipe to be made from chicken to pork! You still get the delicious ginger soup flavors you love in tinola but with the added meatiness that pork can give. ",
        
        servings: 6,
        ingredients: [
          "2 tablespoons vegetable oil",
          "1 1 1/2-inch piece ginger, peeled and sliced into strips",
          "1 medium red onion, chopped",
          "3 cloves garlic, chopped",
          "1 pieces tomato, chopped",
          "500 grams pork ribs",
          "3 tablespoons fish sauce (patis)",
          "4 cups rice washing (hugas bigas) or water",
          "1 medium green papaya, peeled and sliced",
          "1 teaspoon black peppercorns",
          "1/2 teaspoon ground black pepper",
          "1 cup chili leaves (dahon ng sili)"

        ],
        steps: [
          "Heat oil in a large pot over medium-high heat. Sauté ginger until fragrant.",
          "Sauté onion, garlic, and tomato until cooked.",
          "Add pork ribs and fish sauce; mix. Pour in rice washing.",
          "Add papaya and peppercorns. Lower heat and simmer until pork and papaya and tender, about 30 minutes. Season with ground pepper. Add chili leaves. Serve immediately."
          
        ],
        keywords: [ "Filipino","healthy" ]
      },
      {
        name: "Spicy Nilagang Baka",
        picture_link: '/img/Spicy_Nilagang_Baka.jpg',
        author: randomProfile(),
        description:"The nilagang baka is one of those recipes that is a tried and tested classic dish. It's a favorite especially those who love sipping flavorful soups before getting down to the meat. Some eat it in bowls of rice swimming in the broth! If you are one of those people who love their food with a touch of heat, you'll want to skip the condiments for this spicy nilagang baka recipe has all the flavors you need already in it. ",
        
        servings: 6,
        ingredients: [
          "2 tablespoons vegetable oil",
          "1 medium red onion, peeled, quartered",
          "1 kilogram beef cubes",
          "5 cups water",
          "2 tablespoons fish sauce (patis), or to taste, more to serve",
          "1/2 teaspoon black peppercorns",
          "4 pieces siling labuyo, halved, more to serve",
          "4 medium potatoes, peeled, cubed large",
          "2 small heads cabbage, each cut into 4",
          "1 bunch string beans (sitaw), cut into 3-inch lengths",
          "calamansi, to serve",
          "steamed rice, to serve"

        ],
        steps: [
          "Heat oil in a pressure cooker over medium heat. Add onion, and stir to lightly sauté. Add beef cubes, water, patis, and peppercorns. Increase heat to high, and bring to a boil. Lower the heat and remove any scum that rises to the surface as it simmers. When there is no more scum rising to the surface, cover and lock lid, lowering heat to low.",
          "Simmer 45 minutes or until beef is tender.",
          "Release pressure before unlocking and removing lid. Add potatoes and siling labuyo. Bring back to a simmer, and cook potatoes until tender. Add cabbage and sitaw. Cook until just tender. Serve with steamed rice, calamansi, more patis, and even more siling labuyo on the side."
          
        ],
        keywords: [ "Filipino","healthy","spicy" ]
      },
      {
        name: "Flavorful Chicken Afritada",
        picture_link: '/img/Flavorful_Chicken_Afritada.jpg',
        author: randomProfile(),
        description:"Whether for a special occasion or a family lunch, Filipinos love chicken afritada, served beside a large serving of rice to soak up the rich flavors of the tomato-based sauce. Since this hearty dish is commonly made with chicken that's first pan-fried to brown before it's simmered to make the stew, the challenge is to make sure that the flavors of the meat are not lost in the mix of tomatoes, peppers, potatoes, and more. Add a flavor kick with Knorr Chicken Cubes for extra meatiness-the secret to the sauce.",
        
        servings: 5,
        ingredients: [
          "3 tablespoons cooking oil",
          "4 cloves garlic, minced",
          "1 medium-sized onion, minced",
          "1 kilo chicken, chopped",
          "1 piece Knorr chicken cube",
          "2 tablespoons soy sauce",
          "1 (250-gram pack) tomato sauce",
          "1/2 teaspoon sugar",
          "1 to 1 1/2 cups of water",
          "1 medium-sized potato, cut into cubes",
          "1 medium-sized carrot, cut into cubes",
          "1 piece red bell pepper, sliced",
          "1 piece green bell pepper, sliced",
          "ground black pepper, to taste"
        ],
        steps: [
          "In a saucepan, saute garlic and onion.",
          "Add the chicken and cook until brown, around 5 minutes.",
          "Add potatoes, carrots, red bell pepper, and green bell pepper, then season with salt and pepper. Stir and cook for 15 minutes."
          
        ],
        keywords: [ "Filipino","healthy","chicken" ]
      },
      {
        name: "Easy Pork Menudo",
        picture_link: '/img/Easy_Pork_Menudo.jpg',
        author: randomProfile(),
        description:"Pork menudo is a dish that can be served at anytime, but during festivities like Christmas, this lutong bahay favorite can go all out to suit the occasion. With colorful bell peppers, sweet raisins, and rich pork flavors enhanced by Knorr Pork Cubes, this dish is sure to be one of the highlights of your Noche Buena. ",
        
        servings: 4,
        ingredients: [
          "1/4 cup of cooking oil",
          "2 pieces medium-sized potatoes, cut into cubes",
          "1 piece medium-sized carrot, cut into cubes",
          "6 cloves garlic, minced",
          "1 piece onion, minced",
          "250 grams pork kasim, cut into small cubes",
          "250 grams pork liempo, cut into small cubes",
          "250 grams pork liver, cut into small cubes",
          "1 pack (250gram) tomato sauce",
          "2 pieces Knorr Pork Cubes",
          "1 to 1 1/2 cups of water",
          "1 teaspoon sugar",
          "ground black pepper, to taste",
          "2 tablespoons raisins",
          "1 cup of red and green bell peppers, cubed"
        ],
        steps: [
          "Let's begin by first frying the potato and carrots in hot oil until lightly browned. Remove from oil and transfer on a plate lined with paper towels. Set aside.",
          "In the same pan, throw in the garlic and onions.",
          "Add the pork kasim and liempo next and fry until slightly brown in color before adding the liver. Cook for 2 minutes.",
          "Drop in the Knorr Pork Broth Cubes and give this a nice stir to dissolve completely before adding the tomato sauce, water, sugar and black pepper. Mix this well.",
          "Now, gently place the fried potatoes and carrots in the pan. Continue to cook over low heat until meat and potatoes are cooked through and the sauce has thickened.",
          "Finally, add raisins and bell peppers and just allow to cook for 2 minutes longer. Here's a dish that will bring the entire family together. Pork menudo, just like home, is always close to your heart."
          
        ],
        keywords: [ "Filipino","pork" ]
      },
      {
        name: "Homestyle Chicken Inasal",
        picture_link: '/img/Homestyle_Chicken_Inasal.jpg',
        author: randomProfile(),
        description:"Expecting guests? Skip the crowded resto-grills and make this balikbayan favorite at home. Chicken Inasal gets its name from the Ilonggo word for being roasted, but the key to that mouthwatering flavor is in the marinade. Keep these must-have special ingredients handy-Sinamak vinegar, lemongrass, atsuete oil, and Knorr chicken cubes-and have a batch soaking in the flavor in the fridge, ready to throw on the grill for gatherings of all sizes.",
        
        servings: 4,
        ingredients: [
          "1/2 cup of sinamak vinegar",
          "1/4 cup of white vinegar",
          "1/4 cup of soy sauce",
          "2 stalks lemongrass (tanglad),, pounded",
          "2 teaspoons brown sugar",
          "1 clove garlic, pounded",
          "1 tablespoon fish sauce (patis)",
          "2 teaspoons salt",
          "1 piece Knorr chicken cube",
          "1 teaspoon black pepper",
          "1 kilo chicken legs",
          "3/4 cup of atsuete oil (annatto oil)"
        ],
        steps: [
          "Make the marinade: Combine all ingredients and Knorr chicken cube in a large bowl. Marinate chicken legs in the mixture for at least 2 hours or overnight in the refrigerator.",
          "Make the atsuete oil: In a pan, add 2 tablespoons atsuete and 1/2 cup oil. Let it simmer until oil changes into an orange color. Strain the atsuete seeds before using.",
          "Make the barbecue: Skewer chicken with barbecue sticks. Cook the chicken on a charcoal grill over a medium flame. Mix together atsuete oil, margarine, and Knorr chicken cube. Baste the chicken with the atsuete oil mixture every few minutes until the meat is well done.",
          "Remove barbecue sticks before serving."
          
        ],
        keywords: [ "Filipino","chicken" ]
      },
      {
        name: "Easy Creamy Chicken Pastel",
        picture_link: '/img/Easy_Creamy_Chicken_Pastel.jpg',
        author: randomProfile(),
        description:"Creamy and comforting, this chicken dish can be adapted for many dishes: served with rice for a family meal, used as a filling with mini crusts as an appetizer, or, our favorite below, topped with cheese as a melt-in-your-mouth party casserole. So many delicious options to satisfy your needs and your family's taste buds! No matter what you pair it with, make sure to balance out the creaminess with a Knorr Chicken Cube and maximize the chicken flavor in every saucy bite.",
        
        servings: 6,
        ingredients: [
          "3 tablespoons vegetable oil",
          "1 kilo chicken thighs, filleted and cubed",
          "3 cloves garlic, chopped",
          "1 medium-sized onion, chopped",
          "1 piece Knorr chicken cube",
          "1 pack knorr mushroom soup",
          "1 cup of water",
          "1 medium-sized carrot, cut into 1 1/2-inch cubes",
          "2 medium-sized potatoes, cut into 1 1/2-inch cubes",
          "110 grams cheddar cheese, grated",
          "pepper, to taste"
        ],
        steps: [
          "Saute garlic and onion in oil.",
          "Add the chicken thigh cubes. Cook for 10 minutes.",
          "Dissolve the Knorr chicken cube and Knorr mushroom soup in water.",
          "Pour over the chicken and let it simmer.",
          "Add the carrots and potatoes. Add water if sauce becomes too thick.",
          "Simmer for 15 minutes.",
          "Top with grated cheese before serving."
          
        ],
        keywords: [ "Filipino","chicken" ]
      },
      {
        name: "Classic Kare-Kare",
        picture_link: '/img/Classic_Kare-Kare.jpg',
        author: randomProfile(),
        description:"With Noche Buena and Media Noche coming up, a nostalgic meal, one with a recipe that's been passed down from generation to generation, deserves a place at the table. Kare-kare is a perfect example. Fill your pot with different veggies like eggplant, pechay, and sitaw, and make sure to enhance the flavor of the meat with Knorr Pork Cubes. There'll surely be requests for seconds!",
        
        servings: 6,
        ingredients: [
          "1 to 1.5 kilo oxtail, cut up",
          "2 pieces onions, quartered",
          "water, enough to cover the meat",
          "4 tablespoons canola oil",
          "2 tablespoons achuete seeds",
          "1 piece onion, chopped",
          "10 cloves garlic, chopped",
          "1/2 cup of creamy peanut butter",
          "3 pieces eggplants, sliced",
          "1 bundle sitaw, cut into 2-inch pieces",
          "1 pack pechay tagalog, sliced",
          "1 Knorr Beef Cubes"
        ],
        steps: [
          "First, you need to tenderize the oxtail to be able to enjoy this majestic dish. Get a pot and throw in the oxtail and quartered onions in. Pour the water and just boil over high heat then reduce to a simmer until oxtail is tender. Once tender, strain the oxtail from the broth and set aside the meat and broth.",
          "Now, get a pan and combine the oil and annatto seeds together. Cook over low heat for 3 minutes or until the color of the oil turn orange. Strain out the seeds then pour the infused oil back into the pan. Throw in the onions and garlic and saute until lightly toasted. Add the softened oxtail next and continue to saute.",
          "Just a few more steps and this dish is done. Add the peanut butter, 1 to 1/2 cups of broth (where oxtail was softened) and Knorr Beef Cube. Mix well until peanut butter is dissolved. Simmer for 15-20 minutes until sauce has slightly thickened.",
          "Now, add the vegetables last and cook until done. That's it! Classic kare-kare is best enjoyed with a serving of warm bagoong."
        
          
        ],
        keywords: [ "Filipino" ]
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

      var commentTemplates = [
        positiveComments,
        neutralComments,
        negativeComments
      ];

      var breakpoints = [ 0.85, 0.95, 999.0 ];
      
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
