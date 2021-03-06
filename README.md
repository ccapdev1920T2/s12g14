# Cooker - The Cooking Recipe Website

Cooker is a cooking recipe website made as a final requirement for the DLSU Course CCAPDEV (Web Development).

### Prerequisites

Git

NodeJS

MongoDB

### Installing

1. First, clone the repository through git through your preferred method or using the command:
```
git clone https://github.com/ccapdev1920T2/s12g14.git
```

2. Navigate to the project folder and install all NodeJS dependencies, which can be done by simply using `npm install`.
3. Start the application using the command `npm start`, or `npm run devstart` if you want to make modifications while editing.

## Web Deployment

The application is also currently deployed [here](https://floating-shelf-11482.herokuapp.com).

## Implementation details

* The admin account cannot be deleted. Any attempt to delete the admin account will be redirected to /404.
* The password for `admin` is `password`.
* The data store is a volatile, RAM-backed MongoDB store, which means any crashes will delete all progress.
* A real MongoDB store would require us to shell out from our wallets, which we aren't apt to do because we aren't the stereotypical rich Lasallians who flex their credit cards.

## Dependencies

* bcrypt
* body-parser
* connect-mongo
* dotenv
* express
* express-handlebars
* express-session
* express-validator
* handlebars
* mongodb
* mongoose
* multer
* sanitize
* sanitize-html
* validator


* mongodb-memory-server
* nodemon

## Built With

* VS Code
* Bootstrap

## Authors

* Marc Tiburcio
* Jan Uriel Marcelo
* James Lin

## Acknowledgments

* To the family who supported us during this hard times
* To the friends who've made us laugh and smile while cramming together
* To the kind professors who made time and were lenient on their requirements
* To the authors of the pictures we've used for our sample data.
