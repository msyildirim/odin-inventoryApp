#! /usr/bin/env node

console.log('This script populates some cars to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Make = require('./models/make')
var Model = require('./models/model')
var CarInstance = require('./models/carinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var makes = []
var models = []
var carinstances = []

function makeCreate(makeName, cb) {
    makeDetail = {name: makeName}

  
    var makeModel = new Make(makeDetail);
       
    makeModel.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Make: ' + makeModel);
        makes.push(makeModel)
        cb(null, makeModel)
    }  );
}

function modelCreate (modelName, modelMake, cb){
    modelDetail = {name: modelName, make: modelMake};
    const modelModel = new Model(modelDetail);
    modelModel.save(function (err) {
        if (err) {
            cb(err);
            return
        }
        console.log("New Model:" + modelModel);
        models.push(modelModel);
        cb(null, modelModel)
    })

}

function carInstanceCreate (plate, model, year, cb){
    var carInstanceDetail = {
        plate: plate,
        model: model,
        year: year
    };
    const carInstanceModel = new CarInstance(carInstanceDetail)
    carInstanceModel.save(function (err){
        if(err){
            cb(err);
            return
        }
        console.log("New carInstance:" + carInstanceModel);
        carinstances.push(carInstanceModel);
        cb(null, carInstanceModel);
    })

}


function createMake(cb) {
    async.parallel([
        function(callback) {
            makeCreate('Toyota', callback)
        },
        function (callback) {
            makeCreate('Opel', callback)
        },
        function (callback) {
            makeCreate('Mercedes', callback)
        }
    ],
    cb)
}

function createModel(cb) {
    async.parallel([
        function (callback) {
            modelCreate("Corolla", makes[0], callback)
        },
        function (callback) {
            modelCreate("Avensis", makes[0], callback)
        },
        function (callback) {
            modelCreate("Yaris", makes[0], callback)
        },
        function (callback) {
            modelCreate("Corsa", makes[1], callback)
        },        function (callback) {
            modelCreate("Astra", makes[1], callback)
        },        function (callback) {
            modelCreate("E200", makes[2], callback)
        }
    ],
    cb)
}

function createCarInstance(cb) {
    async.parallel([
        function(callback) {
            carInstanceCreate("78AGD001", models[0], 2005, callback)
        },
        function(callback) {
            carInstanceCreate("78SP002", models[5], 2006, callback)
        },
        function(callback) {
            carInstanceCreate("78IYF001", models[0], 2006, callback)
        },
        function(callback) {
            carInstanceCreate("78ESAM001", models[1], 2003, callback)
        },
        function(callback) {
            carInstanceCreate("78BB123", models[2], 2002, callback)
        },
        function(callback) {
            carInstanceCreate("78AGD002", models[3], 2004, callback)
        },
        function(callback) {
            carInstanceCreate("78SP002", models[4], 2001, callback)
        },
        function(callback) {
            carInstanceCreate("78SP003", models[2], 2001, callback)
        },
        function(callback) {
            carInstanceCreate("78MGV001", models[3], 2010, callback)
        },
        function(callback) {
            carInstanceCreate("78MGV002", models[4], 2004, callback)
        },
        function(callback) {
            carInstanceCreate("78BB123", models[1], 2004, callback)
        }
    ],
    cb)
}

async.series([
    createMake,
    createModel,
    createCarInstance
],
// Optional callback
function(err, results) {
    console.log("Inside last fallback")
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Makes: '+ makes);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




