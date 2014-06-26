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

/*
 * Note to self:
 *	POST: tutto quello che cambia lo stato;
 * 	GET: lettura; DELETE: cancellazione; PUT: poco usato.
 */
 
/* Maps */

app.get('/map/:key', function (req, res) {
	var key = req.params.key;
	client.get(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/map/:key', function (req, res) {
	var key = req.params.key, value = req.body.value;
	client.set(key, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.delete('/map/:key', function (req, res) {
	var key = req.params.key;
	client.del(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/incr/:key', function (req, res) {
	var key = req.params.key;
	client.incr(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/decr/:key', function (req, res) {
	var key = req.params.key;
	client.decr(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Expiration */

app.post('/expire/:key', function (req, res) {
	var key = req.params.key, value = req.body.value;
	client.expire(key, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/ttl/:key', function (req, res) {
	var key = req.params.key;
	client.ttl(key, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Hashes */

app.get('/hash/:hash', function (req, res) {
	var hash = req.params.hash;
	client.hgetall(hash, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/hash/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field;
	client.hget(hash, field, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/hash/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field, value = req.body.value;
	client.hset(hash, field, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Lists */

app.post('/list/lpop/:list', function (req, res) {
	var list = req.params.list;
	client.lpop(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/list/lpush/:list', function (req, res) {
	var list = req.params.list, value = req.body.value;
	client.lpush(list, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/list/rpop/:list', function (req, res) {
	var list = req.params.list;
	client.rpop(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/list/rpush/:list', function (req, res) {
	var list = req.params.list, value = req.body.value;
	client.rpush(list, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/list/:list/:lower/:upper', function (req, res) {
	var list = req.params.list, lower = req.params.lower, upper = req.params.upper;
	client.lrange(list, lower, upper, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/list/llen/:list', function (req, res) {
	var list = req.params.list;
	client.llen(list, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Sets */

app.get('/set/:set/:value', function (req, res) {
	var set = req.params.set, value = req.params.value;
	client.sismember(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/set/:set', function (req, res) {
	var set = req.params.set;
	client.smembers(set, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.get('/set/:sets', function (req, res) {
	var sets = req.params.sets;
	client.sunion(sets, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/set/sadd/:set', function (req, res) {
	var set = req.params.set, value = req.body.value;
	client.sadd(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/set/srem/:set', function (req, res) {
	var set = req.params.set, value = req.body.value;
	client.srem(set, value, function (err, reply) {
		http_redis(err, reply, res);
	});
});

/* Sorted Sets */

app.get('/sset/:sset/:lower/:upper', function (req, res) {
	var sset = req.params.sset, lower = req.params.lower, upper = req.params.upper;
	client.zrange(sset, lower, upper, function (err, reply) {
		http_redis(err, reply, res);
	});
});

app.post('/sset/zadd/:sset', function (req, res) {
	var sset = req.params.sset, score = req.body.score, value = req.body.value;
	client.zadd(sset, score, value, function (err, reply) {
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
