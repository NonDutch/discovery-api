'use strict';

const GrovePi = require('node-grovepi').GrovePi,
    Board = GrovePi.board,
    DHTDigitalSensor = GrovePi.sensors.DHTDigital;

let temperatureBoard = new Board({
        debug: true,
        onError: err => res.send(500, err),
        onInit: onInit
    }),
    temperature = {};

function onInit (result) {
    if (result) {
        var dhtSensor = new DHTDigitalSensor(7, DHTDigitalSensor.VERSION.DHT11, DHTDigitalSensor.CELSIUS);
        dhtSensor.watch(500);

        dhtSensor.on('change', function(sensorData) {
            temperature = {
                temperature: sensorData[0],
                humidity: sensorData[1]
            };
        });

    } else {
        console.log(`Result: ${result}`);
    }
}

temperatureBoard.init();





module.exports.get = function (req, res) {
    res.send(200, temperature);
};




function onExit(err) {
    temperatureBoard.close();
    process.removeAllListeners();
    process.exit();
    if (typeof err != 'undefined')
        console.log(err);
}

// catches ctrl+c event
process.on('SIGINT', onExit);

