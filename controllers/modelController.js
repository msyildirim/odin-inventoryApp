var model = require('../models/model')

exports.model_list = function(req, res, next){
    model.find().exec(function(err, model_list){
        if(err) return next(err)
        res.render('model_list', {
            title: "Model List",
            model_list: model_list
        })
    })
}