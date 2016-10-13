'use strict';

const restify = require('restify'),
    GrovePi = require('node-grovepi').GrovePi,
    Commands = GrovePi.commands,
    Board = GrovePi.board;

var server = restify.createServer();

server.get('/', index);
server.post('/light/:color', switchLight);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

function index(req, res, next) {
    res.send(200, { status: 'running' });
    next();
}

function switchLight (req, res, next) {
    if (['red', 'green', 'blue'].indexOf(req.params.color) > -1) {
        // map the colors to the right GPI
        let map = {
            red: 1,
            green: 2,
            blue: 3
        };

        // I am not sure about this line
        Board.write(map[req.params.color]);

        res.send(200, {
            color: req.params.color,
            status: true
        });
    } else {
        res.send(500, { error: 'color not correct' });
    }

    next();
}
