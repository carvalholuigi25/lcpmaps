var srvfunctions = require("./server_functions.js");
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var port = 3001;
var portssl = 3002;

app.use(cors());
app.use('/data', express.static(path.join(__dirname, '/assets/data')));
app.use('/fonts', express.static(path.join(__dirname, '/assets/fonts')));
app.use('/icons', express.static(path.join(__dirname, '/assets/icons')));
app.use('/images', express.static(path.join(__dirname, '/assets/images')));
app.use('/maps', express.static(path.join(__dirname, '/assets/maps')));
app.use('/pages', express.static(path.join(__dirname, '/pages')));
app.use(express.json());

app.get('/', function(req, res) {
    res.setHeader("Content-Type", "text/html");
    srvfunctions.readFile("index.html", req, res);
});

app.get('/api/maps', function(req, res) {
    res.setHeader("Content-Type", "application/json");
    srvfunctions.readFile("assets/data/maps.json", req, res);
});

app.get('/api/markers', function(req, res) {
    res.setHeader("Content-Type", "application/json");
    srvfunctions.readFile("assets/data/markers.json", req, res);
});

var serverhttp = http.createServer(app);
var serverhttps = https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt', 'utf8')
}, app);

serverhttp.listen(port, () => {
    console.log("Server (http) is listening at url: http://localhost:" + port + "/");
});

serverhttps.listen(portssl, () => {
    console.log("Server (https) is listening at url: https://localhost:" + portssl + "/");
});