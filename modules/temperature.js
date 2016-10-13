'use strict';
const GrovePi = require('node-grovepi').GrovePi,
    Commands = GrovePi.commands,
    Board = GrovePi.board,
    DHTDigitalSensor = GrovePi.sensors.DHTDigital;

let board = new Board({
        debug: true,
        onError: err => res.send(500, err),
        onInit: onInit
    }),
    temperature = board.read()

function onInit (result) {
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

module.exports = function (req, res, next) {
    res.send(200, temperature);
};

//
// var dhtSensor = new DHTDigitalSensor(7, DHTDigitalSensor.VERSION.DHT11, DHTDigitalSensor.CELSIUS);
//
// console.log('GrovePi Version :: ' + board.version())
//
// dhtSensor.on('change', function(res) {
//     console.log('Temperature: ', res);
//
// });
//

function onExit(err) {
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
}

// catches ctrl+c event
process.on('SIGINT', onExit)
