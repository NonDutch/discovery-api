'use strict';

const restify = require('restify'),
    switchLight = require('./modules/switch-light'),
    temperatureData = require('./modules/temperature'),
    screen = require('./modules/screen');

var server = restify.createServer();

server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);

/* ========================================================
====================== ROUTES =============================
========================================================= */

server.get('/', index);
server.post('/light/:color', switchLight);
server.get('/temperature', temperatureData.get);
server.post('/screen', screen.post);


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
