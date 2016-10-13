'use strict';

const restify = require('restify'),
    switchLight = require('./modules/switch-light'),
    GrovePi = require('node-grovepi').GrovePi,
    Board = GrovePi.board,
    DHTDigitalSensor = GrovePi.sensors.DHTDigital;

var server = restify.createServer();



/* ========================================================
 ================ TEMPERATURE BOARD =======================
 ========================================================= */


let board = new Board({
        debug: true,
        onError: err => res.send(500, err),
        onInit: onInit
    }),
    temperature;

function onInit (result) {
    console.log('onInit called!!!' + Date());
    if (result) {
        var dhtSensor = new DHTDigitalSensor(7, DHTDigitalSensor.VERSION.DHT11, DHTDigitalSensor.CELSIUS);

        dhtSensor.on('change', function(sensorData) {
            temperature = sensorData;
        });

    } else {
        console.log(`Result: ${result}`);
    }
}

board.init();


function getTemperature (req, res, next) {
    res.send(200, temperature);
}


/* ========================================================
====================== ROUTES =============================
========================================================= */

server.get('/', index);
server.post('/light/:color', switchLight);
server.get('/temperature', getTemperature);


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

function onExit(err) {
    board.close();
    process.removeAllListeners();
    process.exit();
    if (typeof err != 'undefined')
        console.log(err);
}

// catches ctrl+c event
process.on('SIGINT', onExit);

