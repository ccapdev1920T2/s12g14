const Recipe = require('../models/recipe-model');
const Comment = require('../models/comment-model');
const Like = require('../models/like-model');
const Report = require('../models/report-model');
const Profile = require('../models/profile-model');

const mongoose = require('mongoose');
const err = require('../errors');
const sanitizer = require('sanitize')();

const reportController = {
  getReports: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      if (req.session.isAdmin) {
        var query = {};
        var all = sanitizer.value(req.query.name, Boolean);
        if (!all) query.process_timestamp = null;

        Report.find(query).populate("author").exec()
        .then(function(documents) {
          var reports = documents.map(doc => {
            var report = doc.toObject();
            report.author.display_name = doc.author.display_name;
            report.is_recipe = doc.reported_ref == 'Recipe';
            console.log(report);
            return report;
          });
          
          function getReportRef(report) {
            if (report.is_recipe) return new Promise((resolve, reject) => {
              Recipe.findById(report.reported_ID, (error, result) => {
                console.log('result');
                console.log(result);
                if (error)        return reject(err.generic("Could not fetch reported recipe", error));
                else if (!result) return resolve(null); // Recipe may have been deleted right after reporting
                else              return resolve(result);
              }).populate("author").exec();
            });
            else return new Promise((resolve, reject) => {
              Comment.findById(report.reported_ID, (error, result) => {
                console.log('result');
                console.log(result);
                if (error)        return reject(err.generic("Could not fetch reported comment", error));
                else if (!result) return resolve(null); // Comment may have been deleted right after reporting
                else              return resolve(result);
              }).populate("author").populate("recipe").exec()
            });
          }

          var promises = reports.map(report => {
            return getReportRef(report).then(doc => {
              if (!doc) {
                report.content = 'This seems to be not working';
                report.link = '/404';
                return report;
              }

              var reported = doc.toObject();
              reported.author = doc.author.toObject();
              reported.author.display_name = doc.author.display_name;
              report.reported = reported;
              if (report.is_recipe) {
                report.content = reported.name;
                report.link = '/recipe/' + reported._id;
              } else {
                report.content = reported.text;
                report.link = '/recipe/' + reported.recipe._id + '#' + reported._id;
              }
              return report;
            });
          });

          Promise.all(promises)
          .then(reports => {
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
          .catch(reason => {
            console.log(reason);
            res.status(500).redirect('/404'); // TODO: redirect to error (not 404) page
          });
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
      
      Report.create(reportDoc, function(error, docs) {
        if (error) {
          res.status(500).json({ error: err.generic("An error occurred.", error) });
        } else {
          res.send("Success!");
        }
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
        var verdict = sanitizer.value(req.body.verdict, String);
        var ban_until = new Date(sanitizer.value(req.body.ban_until, String)); // present when the verdict is ban

        console.log('verdict is ' + verdict);

        // start a delete transaction
        mongoose.startSession()
        .then(async function(session) {
          session.startTransaction();
          
          Report.findById(reportId).exec()
          .then(function(report) {
            if (verdict == 'ignore') {
              return Report.findByIdAndUpdate(reportId, { process_timestamp: Date.now() }).exec();
            } else if (verdict == 'ban') {
              if (report.reported_ref == 'Comment') {
                return Comment.findByIdAndDelete(report.reported_ID).exec()
                .then((document) => Profile.findById(document.author))
                .then((author) => Profile.updateOne({ _id: author._id }, { ban_until: ban_until }));
              } else if (report.reported_ref == 'Recipe') {
                return Recipe.findByIdAndDelete(report.reported_ID).exec()
                .then((document) => Profile.findById(document.author))
                .then((author) => Profile.update({ _id: author._id }, { ban_until: ban_until }));
              } else {
                throw Error('Invalid ref type');
              }
            } else if (verdict == 'delete') {
              var authorId = null;
              var recipeIds = [];
              if (report.reported_ref == 'Comment') {
                return Comment.findByIdAndDelete(report.reported_ID).populate('author').exec() // find the offending comment and delete
                .then((document) => {                                                         // find the offending user
                  authorId = document.author._id;
                  return document.author;
                })
                .then(() => Profile.findByIdAndDelete(authorId))                               // delete the user
                .then(() => Recipe.find({ author: authorId }))                                // find all the recipes posted by the user
                .then((recipes) => recipeIds = recipes.map(recipe => recipe._id))             // map them into an array of ObjectId's
                .then(() => Recipe.deleteMany({ _id: { $in: recipeIds }}))                    // delete those recipes
                .then(() => Like.deleteMany({ sender: authorId }))                            // delete all the user's likes (not the recipes)
                .then(() => Like.deleteMany({ recipe: { $in: recipeIds }}))                   // delete all the likes on any of the recipes
                .then(() => Comment.deleteMany({ author: authorId }))                         // delete all the user's comments
                .then(() => Comment.deleteMany({ recipe: { $in: recipeIds }}));               // delete all the comments on any of the recipes
              } else if (report.reported_ref == 'Recipe') {
                return Recipe.findByIdAndDelete(report.reported_ID).populate('author').exec()  // find the offending recipe and delete
                .then((document) => {                                                         // find the offending user
                  authorId = document.author._id;
                  return document.author;
                })
                .then(() => Profile.findByIdAndDelete(authorId))                               // delete the user
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
              res.status(400).json({ error: err.notFound("Could not process report.", reason) });
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
