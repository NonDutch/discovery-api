'use strict';

module.exports = function (req, res, next) {
    const GrovePi = require('node-grovepi').GrovePi,
        Commands = GrovePi.commands,
        Board = GrovePi.board,
        DHTDigitalSensor = GrovePi.sensors.DHTDigital;

    let board = new Board({
        debug: true,
        onError: err => res.send(500, err),
        onInit: onInit
    });
    board.init();

    function onInit (res) {
        if (res) {
            var dhtSensor = new DHTDigitalSensor(7, DHTDigitalSensor.VERSION.DHT11, DHTDigitalSensor.CELSIUS);
            dhtSensor.watch(500);

            dhtSensor.on('change', function(res) {
                res.send(200, res);
                board.close();
            });
        } else {
            console.log(`${res} is shitty empty`);
        }
    }
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
