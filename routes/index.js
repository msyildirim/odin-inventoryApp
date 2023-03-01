var express = require('express');
var router = express.Router();

var carInstanceController = require('../controllers/carInstanceController')
var makesController = require('../controllers/makesController');
var modelsController = require('../controllers/modelController');

/* GET home page. Lists all car instances */
router.get('/', carInstanceController.index );

//GET request for list of all makes
router.get('/makes', makesController.make_list)

//GET request for list of all models
router.get('/models', modelsController.model_list)

module.exports = router;
