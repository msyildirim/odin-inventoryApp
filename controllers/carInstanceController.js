var CarInstance = require('../models/carinstance');
var Make = require('../models/make');
var Model = require('../models/model');
const {body, validationResult} = require("express-validator");
const async = require("async");
const multer  = require('multer')
const upload = multer({ dest: 'public/images/' })

//Display recently added 4 cars in index
exports.index = function (req, res, next) {
    CarInstance.find()
        .sort({'_id': -1})
        .limit(4)
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
                car_instances: list_carInstances,
                car_image_path: "/images/corolla.jpg",
                user: req.user
            })
        }

    )


}

//Display carinstance list on GET
exports.carinstance_list = function (req, res, next) {
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
                    car_instances: list_carInstances,
                    car_image_path: "/images/corolla.jpg",
                    user: req.user
                })
            }
    
        )
}

//Display car instace detail
exports.carinstance_detail = function (req, res, next) {
    CarInstance.findById(req.params.id)
        .populate({
            path: 'model',
            populate: {
                path: 'make',
                model: 'Make'                
            }
        })
        .exec(
            function (err, carInstance){
                if (err) {
                    return next(err);
                }
                res.render('carinstance_detail', {
                    title: "Car details",
                    car_instance: carInstance,
                    car_image_path: "/images/corolla.jpg",
                    user: req.user
                })
            }
        )

}



//Display carinstance create form on GET
exports.create_get = function (req, res, next) {
    async.parallel(
        {
            model_list(callback){
                Model.find({}, 'name').exec(callback)
            },
            make_list(callback){
                Make.find({}, 'name').exec(callback)
            }
        },
        (err, results) => {
            if(err) return next(err)
            if(results.model_list == null || results.make_list == null){
                const err = new Error("Make or model list not found")
                err.status = 404;
                return next(err);
            }
            res.render('carinstance_form', {
                title:"Create car instance",
                makes: results.make_list,
                models: results.model_list,
                user: req.user
            })        
        }
    )

}

//Handle carinstace create on POST
exports.create_post = [
    //Validate and sanitize fields
    body("plate", "Plate must not be empty")
      .trim()
      .isLength({ min:1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        let image_path = req.file ? req.file.filename : undefined;
        const carinstance = new CarInstance({
            plate: req.body.plate,
            model: req.body.model,
            year: req.body.year,
            image: "../uploads/" + image_path
        })
          
        if (!errors.isEmpty()) {
            async.parallel(
                {
                    model_list(callback){
                        Model.find({}, 'name').exec(callback)
                    },
                    make_list(callback){
                        Make.find({}, 'name').exec(callback)
                    }
                },
                (err, results) => {
                    if(err) return next(err)
                    if(results.model_list == null || results.make_list == null){
                        const err = new Error("Make or model list not found")
                        err.status = 404;
                        return next(err);
                    }

                    res.render('carinstance_create', {
                        title:"Create car instance",
                        makes: results.make_list,
                        models: results.model_list,
                        errors: errors.array()
                    })        
                }
            )
            return;
        }

        carinstance.save( err => {
            if(err) return next(err)
            res.redirect(carinstance.url)
        })
    }


]

//Display carinstance delete form on GET
exports.delete_get = function (req, res, next) {
    CarInstance.findById(req.params.id)
        .populate({
            path: 'model',
            populate: {
                path: 'make',
                model: 'Make'                
            }
        })
        .exec(
            function (err, carInstance){
                if (err) {
                    return next(err);
                }
                res.render('carinstance_delete', {
                    title: "Car details",
                    car_instance: carInstance,
                    car_image_path: "/images/corolla.jpg",
                    user: req.user
                })
            }
        )
}

//Handle carinstace delete on POST
exports.delete_post = function (req, res, next) {
    CarInstance.findByIdAndRemove(req.params.id, err =>{
        if(err) return next(err)
        res.redirect("/carinstances")
    })
}

//Delete list of carinstances
exports.deletelist = function(req, res, next){
    CarInstance.deleteMany({_id: { $in: req.body.selectedcars}}, function(err){
        if(err) return next(err)
        res.redirect("/carinstances")
    })
}

//Display carinstance update form on GET
exports.update_get = function (req, res, next) {
    async.parallel(
        {
            carinstance(cb){
                CarInstance.findById(req.params.id)
                    .populate({
                        path: 'model',
                        populate: {
                            path: 'make',
                            model: 'Make'                
                        }
                    })
                    .exec(cb);
            },
            makes(cb){
                Make.find(cb)
            },
            models(cb){
                Model.find(cb);
            }
        },
        (err, results) => {
            if(err) return next(err)
            if(results.carinstance == null){
                const err = new Error("Car not found")
                err.status = 404;
                return next(err);
            }
            res.render("carinstance_form", {
                title:"Update car instance",
                makes: results.makes,
                models: results.models,
                car: results.carinstance,
                user: req.user
            })
        }
    )
}

//Handle carinstance update form on POST
exports.update_post = [
    body('plate', 'plate can not be empty')
      .trim()
      .isLength({min:6})
      .escape(),
    body('year', 'year can not be empty'),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.send(errors)
            return
        }

        let image_path = req.file ? req.file.filename : undefined;
        CarInstance.findByIdAndUpdate(req.params.id, {
            plate: req.body.plate,
            model: req.body.model,
            year: req.body.year,
            image: "../uploads/" + image_path
        }, (err, thecar) => {
            if(err) return next(err)
            res.redirect(thecar.url)
        })
    }

    
]

