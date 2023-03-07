const User = require('../models/user')
const passport = require("passport");
const bcrypt = require('bcryptjs');

exports.signup_post = function (req, res, next){
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        }).save( err => {
            if (err) return next(err);
            res.redirect('/');
        })
    })

}
exports.login_post =  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })

exports.logout_get = function(req, res, next){
    req.logout(function (err){
        if (err) return next(err);
        res.redirect('/');
    })
}