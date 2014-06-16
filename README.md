# ReligionJS

A small REST interface to the Redis in-memory key-value data store

## Running

	mkdir node_modules
	npm install express redis
	node religion.js
	
## Usage

	$ curl http://localhost:3000/redis/get/mykey
	{"reply":null}
	$ curl http://localhost:3000/redis/set/mykey/myvalue
	{"reply":"OK"}
	$ curl http://localhost:3000/redis/get/mykey
	{"reply":"myvalue"}
	