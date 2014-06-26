var express = require('express');
var redis = require('redis');

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

app.get('/redis/del/:key', function (req, res) {
	var key = req.params.key;
	client.del(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/incr/:key', function (req, res) {
	var key = req.params.key;
	client.incr(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/decr/:key', function (req, res) {
	var key = req.params.key;
	client.decr(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Expiration */push

app.get('/redis/expire/:key/:value', function (req, res) {
	var key = req.params.key, value = req.params.value;
	client.expire(key, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/ttl/:key', function (req, res) {
	var key = req.params.key;
	client.ttl(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Lists */

app.get('/redis/lpop/:list', function (req, res) {
	var list = req.params.list;
	client.lpop(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/lpush/:list/:value', function (req, res) {
	var list = req.params.list, value = req.params.value;
	client.lpush(list, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/rpop/:list', function (req, res) {
	var list = req.params.list;
	client.rpop(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/rpush/:list/:value', function (req, res) {
	var list = req.params.list, value = req.params.value;
	client.rpush(list, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/lrange/:list/:lower/:upper', function (req, res) {
	var list = req.params.list, lower = req.params.lower, upper = req.params.upper;
	client.lrange(list, lower, upper, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/llen/:list', function (req, res) {
	var list = req.params.list;
	client.llen(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Sets */

app.get('/redis/sadd/:set/:value', function (req, res) {
	var set = req.params.set, value = req.params.value;
	client.sadd(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/srem/:set/:value', function (req, res) {
	var set = req.params.set, value = req.params.value;
	client.srem(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/sismember/:set/:value', function (req, res) {
	var set = req.params.set, value = req.params.value;
	client.sismember(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/redis/smembers/:set', function (req, res) {
	var set = req.params.set;
	client.smembers(set, function (err, reply) {
		http_redis(err, reply, res);
	});
});


/* Server */

app.get('/redis/version', function (req, res) {
	http_redis(null, client.server_info.versions, res);
});

/* Utility methods for monitoring the service */

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
