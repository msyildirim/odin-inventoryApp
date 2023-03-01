var CarInstance = require('../models/carinstance')
var Make = require('../models/make')

exports.index = function (req, res, next) {
    console.log("inside index controller");
    CarInstance.find()
        .populate({
            path: 'model',
            populate: {
                path: 'make',
                model: 'Make'
            }
        })
        .exec(
        function (err, list_carInstances){
            if (err) {
                return next(err);
            }
            res.render('index', {
                title: "Car dealor inventory",
                car_instances: list_carInstances
            })
        }

    )


}