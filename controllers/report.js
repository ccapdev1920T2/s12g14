const Recipe = require('../models/recipe-model');
const Comment = require('../models/comment-model');
const Report = require('../models/report-model');

const err = require('../errors');

const reportController = {
  getReports: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      if (req.isAdmin) {
        var query = {};

        if (!req.query.all) query.process_timestamp = null;

        Report.find(query).exec()
        .then(function(documents) {
          var reports = documents.map(doc => {
            var report = doc.toObject();
            report.author.display_name = doc.author.display_name;
            return report;
          });
          res.json({ count: reports.length, reports: reports });
        })
        .catch(function(reason) {
          res.status(500).json({ error: {
            message: "An error occurred.",
            details: reason
          }});
        });
      } else {
        res.status(401).json({ error: err.unauthorized("Not an admin account.") });
      }
    } else {
      res.status(401).json({ error: err.unauthorized() });
    }
  },

  postReportRecipe: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      var recipeId = req.params.id;
      var reportDoc = {
        author: req.session.userId,
        reported_ID: recipeId,
        reported_ref: 'Recipe',
        category: req.body.category,
        reason: req.body.reason
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

  postReportComment: function(req, res, next) {
    if (req.session && req.session.loggedIn) {
      var commentId = req.params.cid;
      var reportDoc = {
        author: req.session.userId,
        reported_ID: commentId,
        reported_ref: 'Comment',
        category: req.body.category,
        reason: req.body.reason
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
      if (req.isAdmin) {
        var reportId = req.params.id;
        var verdict = req.body.verdict;
        
        // start a delete transaction
        mongoose.startSession()
        .then(async function(session) {
          session.startTransaction();
          
          Report.findOne(reportId).exec()
          .then(function(report) {
            if (report.reported_ref == 'Comment') {
              return Comment.findById(report.reported_ID)
              .then(function(document) {
                return { reportInfo: report, reported: document };
              });
            } else if (report.reported_ref == 'Recipe') {
              return Recipe.findById(report.reported_ID)
              .then(function(document) {
                return { reportInfo: report, reported: document };
              });
            } else {
              throw Error('Invalid ref type');
            }
          })
          .then(function(result) {
            var report = result.reportInfo;
            var reported = result.reported;

            
          });
          Recipe.findOne(recipeId).exec()
          .then(function(recipe) {
            if (recipe) {
              if (recipe.author == req.session.userId) {
                return recipe;
              } else {
                throw Error("Recipe not owned by requestor.");
              }
            } else {
              throw Error("No recipe to delete.");
            }
          })
          .then(() => Like.deleteMany({ recipe: recipeId }))
          .then(() => Comment.deleteMany({ recipe: recipeId }))
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
          })
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
