var express = require('express');
var router = express.Router();
const multer = require('multer');

var carInstanceController = require('../controllers/carInstanceController')
var makesController = require('../controllers/makesController');
var modelsController = require('../controllers/modelController');


const upload = multer({ dest: 'public/uploads/' })


///Index Routes///

/* GET home page. Lists all car instances */
router.get('/', carInstanceController.index );

///Car Instances Routes///

/* GET carinstances. Lists all car instances */
router.get('/carinstances', carInstanceController.carinstance_list );

/* GET carinstance detail. Display car instance detail */
router.get('/carinstance/:id', carInstanceController.carinstance_detail );

//POST request for deleting list of carinstances
router.post('/carinstances/deletelist', carInstanceController.deletelist)

//GET request for creating carinstance
router.get("/carinstances/create", carInstanceController.create_get)

//POST request for creating carinstance
router.post("/carinstances/create", upload.single('avatar'), carInstanceController.create_post)

//GET request for deleting carinstance
router.get("/carinstance/:id/delete", carInstanceController.delete_get)

//POST request for deleting carinstance
router.post("/carinstance/:id/delete", carInstanceController.delete_post)

//GET request for updating carinstance
router.get("/carinstance/:id/update", carInstanceController.update_get)

//POST request for updating carinstance
router.post("/carinstance/:id/update", upload.single('avatar'), carInstanceController.update_post)


///Make routes ///

//GET request for list of all makes
router.get('/makes', makesController.make_list)

///Models routes ///

//GET request for list of all models
router.get('/models', modelsController.model_list)

module.exports = router;
