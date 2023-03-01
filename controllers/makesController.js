var make = require('../models/make');

exports.make_list = function(req, res, next) {
    make.find().exec(function(err, make_list){
        if(err) return next(err)
        res.render('make_list', {
            title: "Make List",
            make_list: make_list
        })
    })
}