var express = require('express');
var redis = require("redis");

var port = 3000;

var app = express();
var client = redis.createClient();

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

var server = app.listen(port, function() {
	console.log('Listening on port %d', server.address().port);
});