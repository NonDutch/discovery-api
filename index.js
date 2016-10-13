'use strict';

const restify = require('restify'),
    switchLight = require('./modules/switch-light'),
    temperatureData = require('./modules/temperature');

var server = restify.createServer();


/* ========================================================
====================== ROUTES =============================
========================================================= */

server.get('/', index);
server.post('/light/:color', switchLight);
server.get('/temperature', temperatureData.get);


/* ========================================================
 ======================== SERVER ==========================
 ========================================================= */

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

function index(req, res, next) {
    res.send(200, { status: 'running' });
    next();
}
