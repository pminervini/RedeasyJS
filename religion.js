var express = require('express');
var url = require('url');
var util = require('util');
var redis = require("redis");

var app = express();
var client = redis.createClient();

function f(arg) {
	console.log(arg)
}

setTimeout(function() {
	f('Alive')
}, 5000)

app.get('/redis/get/:key', function (req, res) {
	var key = req.params.key;
	client.get(key, function (err, reply) {
		if (err) {
			res.send(500, { 'error' : err });
		} else {
			res.send(200, { 'reply' : reply });
		}
		res.end();
	});
});

app.get('/redis/set/:key/:value', function (req, res) {
	var key = req.params.key, value = req.params.value;
	client.set(key, value, function (err, reply) {
		if (err) {
			res.send(500, { 'error' : err });
		} else {
			res.send(200, { 'reply' : reply });
		}
		res.end();
	});
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});