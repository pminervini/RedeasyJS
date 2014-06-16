var express = require('express');
var redis = require("redis");

var argv = require('yargs').argv;

var port = 3000;
var rhost = redis.HOST, rport = redis.PORT;

if (argv.port) {
	port = argv.port;
}

if (argv.rhost) {
	rhost = argv.rhost;
}

if (argv.rport) {
	rport = argv.rport;
}

var app = express();
var client = redis.createClient(rport, rhost, redis.client_options);

function http_redis(err, reply, res) {
	if (err) {
		res.send(500, { 'error' : err });
	} else {
		res.send(200, { 'reply' : reply });
	}
	res.end();
}

app.get('/redis/get/:key', function (req, res) {
	var key = req.params.key;
	client.get(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/set/:key/:value', function (req, res) {
	var key = req.params.key, value = req.params.value;
	client.set(key, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/version', function (req, res) {
	http_redis(null, client.server_info.versions, res);
});

/* Utility methods for monitoring the service */

var spawn = require('child_process').spawn;

app.get('/uptime', function(req, res) {
	spawn('uptime').stdout.pipe(res);
});

app.get('/health', function(req, res) {
	server.getConnections(function (err, connections) {
		res.send({
			pid: process.pid,
			memory: process.memoryUsage(),
			uptime: process.uptime(),
			connections: connections
		});
	});
});

var server = app.listen(port, function() {
	console.log('Listening on port %d', server.address().port);
});
