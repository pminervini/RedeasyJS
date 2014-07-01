var express = require('express');
var bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

var client = redis.createClient(rport, rhost, redis.client_options);

function hsend(error, reply, res) {
	if (error) {
		res.send(500, { 'error' : error });
	} else {
		res.send(200, { 'reply' : reply });
	}
	res.end();
}

function hwrite(error, reply, res) {
	if (error) {
		res.write(JSON.stringify({ 'error' : error }) + '\n');
	} else {
		res.write(JSON.stringify({ 'reply' : reply }) + '\n');
	}
}

/* Maps */

app.get('/map/:key', function (req, res) {
	var key = req.params.key;
	client.get(key, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/map/:key', function (req, res) {
	var key = req.params.key, value = req.body.value;
	client.set(key, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.delete('/map/:key', function (req, res) {
	var key = req.params.key;
	client.del(key, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/map/incr/:key', function (req, res) {
	var key = req.params.key;
	client.incr(key, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/map/decr/:key', function (req, res) {
	var key = req.params.key;
	client.decr(key, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Expiration */

app.post('/expire/:key', function (req, res) {
	var key = req.params.key, value = req.body.value;
	client.expire(key, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/ttl/:key', function (req, res) {
	var key = req.params.key;
	client.ttl(key, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Hashes */

app.get('/hash/:hash', function (req, res) {
	var hash = req.params.hash;
	client.hgetall(hash, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/hash/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field;
	client.hget(hash, field, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/hash/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field, value = req.body.value;
	client.hset(hash, field, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.delete('/hash/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field;
	client.hdel(hash, field, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/hash/incrby/:hash/:field', function (req, res) {
	var hash = req.params.hash, field = req.params.field, value = req.body.value;
	client.hincrby(hash, field, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Lists */

app.post('/list/lpop/:list', function (req, res) {
	var list = req.params.list;
	client.lpop(list, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/list/lpush/:list', function (req, res) {
	var list = req.params.list, value = req.body.value;
	client.lpush(list, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/list/rpop/:list', function (req, res) {
	var list = req.params.list;
	client.rpop(list, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/list/rpush/:list', function (req, res) {
	var list = req.params.list, value = req.body.value;
	client.rpush(list, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/list/:list/:lower/:upper', function (req, res) {
	var list = req.params.list, lower = req.params.lower, upper = req.params.upper;
	client.lrange(list, lower, upper, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/list/len/:list', function (req, res) {
	var list = req.params.list;
	client.llen(list, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Sets */

app.get('/set/:set/:value', function (req, res) {
	var set = req.params.set, value = req.params.value;
	client.sismember(set, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/set/:set', function (req, res) {
	var set = req.params.set;
	client.smembers(set, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.get('/set/:sets', function (req, res) {
	var sets = req.params.sets;
	client.sunion(sets, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/set/add/:set', function (req, res) {
	var set = req.params.set, value = req.body.value;
	client.sadd(set, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/set/rem/:set', function (req, res) {
	var set = req.params.set, value = req.body.value;
	client.srem(set, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Sorted Sets */

app.get('/sset/:sset/:lower/:upper', function (req, res) {
	var sset = req.params.sset, lower = req.params.lower, upper = req.params.upper;
	client.zrange(sset, lower, upper, function (error, reply) {
		hsend(error, reply, res);
	});
});

app.post('/sset/add/:sset', function (req, res) {
	var sset = req.params.sset, score = req.body.score, value = req.body.value;
	client.zadd(sset, score, value, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Messaging */

app.get('/channel/:channels', function (req, res) {
	var channels = req.params.channels;
	var c = redis.createClient(rport, rhost, redis.client_options);
	c.subscribe(channels, function (error, reply) {
		hwrite(error, reply, res, false);
	});
	c.on('message', function (channel, message) {
		hwrite(null, { 'channel': channel, 'message': message }, res, false);
	});
});

app.post('/channel/:channel', function (req, res) {
	var channel = req.params.channel, message = req.body.message;
	res.connection.setTimeout(0);
	var c = redis.createClient(rport, rhost, redis.client_options);
	c.publish(channel, message, function (error, reply) {
		hsend(error, reply, res);
	});
});

/* Server */

app.get('/redis/version', function (req, res) {
	hsend(null, client.server_info.versions, res);
});

app.post('/test', function (req, res) {
	var test = req.body.XYZ;
	console.log(test);
	res.end(test);
});

/* Utility methods for monitoring the service */

app.get('/health', function(req, res) {
	server.getConnections(function (error, connections) {
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
