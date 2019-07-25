var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
var routes = require("./routers/index");
var msg = require("./controller/message/message");

// var mychannels = require("./controller/socket/socketioconnection");
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    socket.on('sent', function (status) {
        msg.getmessage(status, function (res) {
            if (res) {
                io.emit('msg', status);
            } else {
                io.emit('error');
            }
        });
    });
});


// io.sockets.on('connection', mychannels.connectionio);


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,secret_key");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    req.io=io;
    next();

});

app.use('/', routes);
http.listen(8825, function () {
    console.log('listening on *:8825');
});