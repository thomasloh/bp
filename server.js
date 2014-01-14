'use strict';

// // Import vinci (server)
// var Vinci = require('vinci');

// // Creates a Vinci server
// var server = Vinci.Server({

//   // Environment variable
//   env: NODE_ENV,

//   // Port number
//   port: 8000,

//   // Entry point of the app
//   entry: require('views/app')

// });

var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/compiled'));

app.listen(8003);
