const logoutController = {
  getLogout: function (req, res, next) {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err)  return next(err);
        else      return res.redirect('/');
      });
    }
  }
}

module.exports = logoutController;