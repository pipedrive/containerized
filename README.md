[![npm version](https://badge.fury.io/js/containerized.svg)](http://badge.fury.io/js/containerized)

# Containerized

Detect whether your Node.js process is containerized — e.g. whether it runs inside a Docker container.

## Usage

```
npm install containerized
```

### In node <= v0.10.x

Up until node 0.10.x, containerized offers only async way of fetching whether the process is containerized in a container or not.

```javascript
var containerized = require('containerized');

containerized(function(err, result) {
	if (result === true) {
		console.log('I am running inside a Docker container.');
	} else {
		console.log('I am NOT running inside a Docker container.');
	}
});
```

### In node >= v0.12.x

Starting from node 0.12.x, where child_process.execSync is available, containerized offers synchronous interface, so it will be a lot easier to use.

```javascript
var containerized = require('containerized');

if (containerized()) {
	console.log('I am running inside a Docker container.');
} else {
	console.log('I am NOT running inside a Docker container.');
}
```

## Licence

MIT.

## Contribute?

You're welcome! Make sure you keep an eye on the tests.
