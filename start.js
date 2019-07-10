var exp = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var testController = require('./controller/test-controller.js');
var nodeController = require('./controller/node-controller.js');

var server = exp();
server.use(bodyParser.urlencoded({extended:true}));
server.use('/test',testController);
server.use('/node',nodeController);
server.listen(82,async function(){   
    console.log('test');
})