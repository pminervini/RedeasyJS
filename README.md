# RedeasyJS

A small REST interface to the Redis in-memory key-value data store

## Running

```
$ mkdir node_modules
$ npm install
$ node redeasy.js
```

## Usage

Maps:

```
$ curl -X POST -d "value=5" http://localhost:3000/map/KEY
{"reply":"OK"}
$ curl -X GET http://localhost:3000/map/KEY
{"reply":"5"}

$ curl -X POST http://localhost:3000/map/incr/KEY
{"reply":6}
$ curl -X POST http://localhost:3000/map/decr/KEY
{"reply":5}

$ curl -X POST -d "value=10" http://localhost:3000/expire/KEY
{"reply":1}
$ curl -X GET http://localhost:3000/ttl/KEY
{"reply":4}

$ curl -X POST -d "value=5" http://localhost:3000/map/KEY
{"reply":"OK"}
$ curl -X DELETE http://localhost:3000/map/KEY
{"reply":1}
$ curl -X GET http://localhost:3000/map/KEY
{"reply":null}
```

Hashes:

```
$ curl -X POST -d "value=John" http://localhost:3000/hash/USER/NAME
{"reply":1}
$ curl -X POST -d "value=Doe" http://localhost:3000/hash/USER/SURNAME
{"reply":1}
$ curl -X GET http://localhost:3000/hash/USER/NAME
{"reply":"John"}
$ curl -X GET http://localhost:3000/hash/USER
{"reply":{"NAME":"John","SURNAME":"Doe"}}
```

Lists:

```
$ curl -X POST -d "value=ELEM1" http://localhost:3000/list/lpush/LIST
{"reply":1}
$ curl -X POST -d "value=ELEM2" http://localhost:3000/list/lpush/LIST
{"reply":2}
$ curl -X POST -d "value=ELEM3" http://localhost:3000/list/rpush/LIST
{"reply":3}
$ curl -X GET http://localhost:3000/list/LIST/0/-1
{"reply":["ELEM2","ELEM1","ELEM3"]}
```

Sets:

```
$ curl -X POST -d "value=ELEM1" http://localhost:3000/set/add/SET
{"reply":1}
$ curl -X POST -d "value=ELEM2" http://localhost:3000/set/add/SET
{"reply":1}
$ curl -X POST -d "value=ELEM3" http://localhost:3000/set/add/SET
{"reply":1}
$ curl -X GET http://localhost:3000/set/SET
{"reply":["ELEM1","ELEM3","ELEM2"]}
```

Also, sorted sets and PUB/SUB messaging channels.
