const Recipe = require('../models/recipe-model');
const Comment = require('../models/comment-model');
const Like = require('../models/like-model');
const Report = require('../models/report-model');
const Profile = require('../models/profile-model');

const err = require('../errors');
const sanitizer = require('sanitize')();

const reportController = {
  getReports: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      if (req.session.isAdmin) {
        var query = {};
        var all = sanitizer.value(req.query.name, Boolean);
        if (!all) query.process_timestamp = null;

        Report.find(query).exec()
        .then(function(documents) {
          var reports = documents.map(doc => {
            var report = doc.toObject();
            report.author.display_name = doc.author.display_name;
            report.recipe = doc.reported_ref == 'Recipe';
            return report;
          });
          //res.json({ count: reports.length, reports: reports });
          // TODO: make reports view
          var params = {
            layout: 'with-nav',
            registered: true,
            is_admin: true,
            user: req.session.user,
            class: 'bg-cstm-yellow-lightest',
            title: 'Admin dashboard',
            reports: reports
          };
          
          res.render("report-admin", params);
        })
        .catch(function(reason) {
          console.log(reason);
          res.status(500).redirect('/404'); // TODO: redirect to error (not 404) page
          //res.status(404).redirect('/404');
        });
      } else {
        res.status(404).redirect('/404');
      }
    } else {
      res.status(404).redirect('/404');
    }
  },

  postReportRecipe: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      var reason = sanitizer.value(req.body.reason, String);
      console.log("Reason is: " + reason);

      var recipeId = req.params.id;
      var reportDoc = {
        author: req.session.user.id,
        reported_ID: recipeId,
        reported_ref: 'Recipe',
        reason: reason
      };
      console.log(reportDoc);
      Report.create(reportDoc, function(error, docs) {
        if (error) {
          res.status(500).json({ error: err.generic("An error occurred.", error) });
        } else {
          res.send("Success!");
        }
      });
      //.then(function(document) {
      //  if (like) res.send("Success!");
      //  else      res.status(400).send("Recipe not reported");
      //})
      //.catch(function(reason) {
      //  res.status(500).json({ error: {
      //    message: "An error occurred.",
      //    details: reason
      //  }});
      //});

    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  postReportComment: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      var reason = sanitizer.value(req.body.reason, String);

      var commentId = req.params.cid;
      var reportDoc = {
        author: req.session.user.id,
        reported_ID: commentId,
        reported_ref: 'Comment',
        reason: reason
      };
      
      Report.create(reportDoc)
      .then(function(document) {
        if (like) res.send("Success!");
        else      res.status(400).send("Recipe not reported");
      })
      .catch(function(reason) {
        res.status(500).json({ error: {
          message: "An error occurred.",
          details: reason
        }});
      });
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  // This endpoint is complex; it expects a verdict to be passed to /process
  // There are different types of verdicts:
  //   ignore - the report is ignored and no other changes are made
  //   ban - the report is processed, the offending content is removed and the offending user is
  //         banned until a time of the admin's choosing
  //   delete - the report is processed, the offending content is removed and the offending user
  //            is permanently banned
  postProcessReport: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      if (req.session.isAdmin) {
        var reportId = req.params.id;
        var verdict = sanitizer.value(req.body.verdict, 'string');
        var ban_until = new Date(sanitizer.value(req.body.ban_until, 'string')); // present when the verdict is ban

        // start a delete transaction
        mongoose.startSession()
        .then(async function(session) {
          session.startTransaction();
          
          Report.findOne(reportId).exec()
          .then(function(report) {
            if (verdict == 'ignore') {
              return Report.findByIdAndUpdate(reportId, { process_timestamp: Date.now() }).exec();
            } else if (verdict == 'ban') {
              if (report.reported_ref == 'Comment') {
                return Comment.findOneAndDelete(report.reported_ID).exec()
                .then((document) => document.author)
                .then((author) => Profile.updateOne(author, { ban_until: ban_until }));
              } else if (report.reported_ref == 'Recipe') {
                return Recipe.findOneAndDelete(report.reported_ID).exec()
                .then((document) => document.author)
                .then((author) => Profile.updateOne(author, { ban_until: ban_until }));
              } else {
                throw Error('Invalid ref type');
              }
            } else if (verdict == 'delete') {
              var authorId = null;
              var recipeIds = [];
              if (report.reported_ref == 'Comment') {
                return Comment.findOneAndDelete(report.reported_ID).populate('author').exec() // find the offending comment and delete
                .then((document) => {                                                         // find the offending user
                  authorId = document.author._id;
                  return document.author;
                })
                .then(() => Profile.findOneAndDelete(authorId))                               // delete the user
                .then(() => Recipe.find({ author: authorId }))                                // find all the recipes posted by the user
                .then((recipes) => recipeIds = recipes.map(recipe => recipe._id))             // map them into an array of ObjectId's
                .then(() => Recipe.deleteMany({ _id: { $in: recipeIds }}))                    // delete those recipes
                .then(() => Like.deleteMany({ sender: authorId }))                            // delete all the user's likes (not the recipes)
                .then(() => Like.deleteMany({ recipe: { $in: recipeIds }}))                   // delete all the likes on any of the recipes
                .then(() => Comment.deleteMany({ author: authorId }))                         // delete all the user's comments
                .then(() => Comment.deleteMany({ recipe: { $in: recipeIds }}));               // delete all the comments on any of the recipes
              } else if (report.reported_ref == 'Recipe') {
                return Recipe.findOneAndDelete(report.reported_ID).populate('author').exec()  // find the offending recipe and delete
                .then((document) => {                                                         // find the offending user
                  authorId = document.author._id;
                  return document.author;
                })
                .then(() => Profile.findOneAndDelete(authorId))                               // delete the user
                .then(() => Recipe.find({ author: authorId }))                                // find all the recipes posted by the user
                .then((recipes) => recipeIds = recipes.map(recipe => recipe._id))             // map them into an array of ObjectId's
                .then(() => Recipe.deleteMany({ _id: { $in: recipeIds }}))                    // delete those recipes
                .then(() => Like.deleteMany({ sender: authorId }))                            // delete all the user's likes (not the recipes)
                .then(() => Like.deleteMany({ recipe: { $in: recipeIds }}))                   // delete all the likes on any of the recipes
                .then(() => Comment.deleteMany({ author: authorId }))                         // delete all the user's comments
                .then(() => Comment.deleteMany({ recipe: { $in: recipeIds }}));               // delete all the comments on any of the recipes
              } else {
                throw Error('Invalid ref type');
              }
            }
          })
          .then(function() {
            session.commitTransaction(function() {
              res.send("Successfully deleted recipe.");
            });
          })
          .catch(function(reason) {
            session.abortTransaction(function() {
              res.status(404).json({ error: err.notFound("Could not process report.", reason) });
            });
          })
          .finally(function() {
            session.endSession();
          });
        })
        .catch(function(reason) {
          res.status(500).json({ error: err.generic("Could not process report.", reason) });
        });
      } else {
        res.status(401).json({ error: err.unauthorized("Not an admin account.") });
      }
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  }
}

module.exports = reportController;
