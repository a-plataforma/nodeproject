// server.js
//
// This is the backend server startup app.
//

//Adding dependencies
var express = require('express');
//var mongojs = require('mongojs');
var bodyParser = require('body-parser');


//Instancing Express framework and MongoDB library
var app = express();
//var db = mongojs('aplataforma', ['']);

//Point to Express framework to handle HTML partials
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Below are the CriptoTransfer System service HTTP Routes
app.get('/login', function (req, res){

    console.log("Activating /login route on A Plataforma service.");

});


//Create backend server instance using and available TCP port.
app.listen(3000);
console.log("A Plataforma running on port 3000");