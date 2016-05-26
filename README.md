[![npm version](https://badge.fury.io/js/containerized.svg)](http://badge.fury.io/js/containerized) [![Build Status](https://travis-ci.org/pipedrive/containerized.svg?branch=master)](https://travis-ci.org/pipedrive/containerized) [![Coverage Status](https://coveralls.io/repos/github/pipedrive/containerized/badge.svg?branch=master)](https://coveralls.io/github/pipedrive/containerized?branch=master)

# Containerized

 * **Detect whether your Node.js process runs inside a Docker container or not**
 * Detection is based on existence of Docker-specific cgroups
 * Well tested (aiming at 100% line, function, statement and branch coverage)
 * Works with all Node.js versions >= 0.10.x.
 * Tested in 0.10.x, 4.x, 5.x, 6.x.

## Usage

```
npm install containerized
```

### Node.js versions 0.12, 4.x, 5.x, 6.x, ...

```javascript
var containerized = require('containerized');

if (containerized()) {
	console.log('I am running inside a Docker container.');
} else {
	console.log('I am NOT running inside a Docker container.');
}
```

### In Node.js 0.10.x

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

For synchronous interface in Node <= 0.10, wrap it in [deasync](https://www.npmjs.com/package/deasync) module:
```javascript
var deasync = require('deasync');
var containerized = deasync(require('containerized'));

// then you can:
if (containerized()) {
	console.log('I am running inside a Docker container.');
}
```


## Licence

MIT.

## Contribute?

You're welcome! Make sure you keep an eye on the tests.
