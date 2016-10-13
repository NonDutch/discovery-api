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

    function onInit (result) {
        if (result) {
            var dhtSensor = new DHTDigitalSensor(7, DHTDigitalSensor.VERSION.DHT11, DHTDigitalSensor.CELSIUS);
            dhtSensor.watch(500);

            let temperature = dhtSensor.read();

            board.close();
            res.send(200, temperature);

            process.removeAllListeners();
            process.exit();

            // dhtSensor.on('change', function(temperature) {
            //     board.close();
            //     // process.removeAllListeners();
            //     // process.exit();
            //     res.send(200, temperature);
            // });
        } else {
            console.log(`Result: ${result}`);
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
