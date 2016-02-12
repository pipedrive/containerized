var containerized = null,
	child_process = require('child_process'),
	cmd = require('./lib/cmd'),
	hostname = require('./lib/hostname')();

module.exports = function(callback) {

	if (containerized === null) {
		// not determined yet. must determine and cache.
		var handler;

		if (child_process.execSync) {
			// sync (node > 0.10.x)
			return determine(child_process.execSync(cmd).toString('utf8'));
		} else {
			// async (node <= 0.10.x)
			child_process.exec(cmd, function(err, data) {
				containerized = determine(data);
				callback(err, containerized);
			});
			return null;
		}

	} else {
		// already determined. use cache.
		if (child_process.execSync) {
			return containerized;
		} else {
			callback(null, containerized);
			return null;
		}
	}

};

function determine(data) {
	return data.match(new RegExp('[0-9]+\:[a-z_-]+\:\/docker\/[0-9a-z]+', 'i')) !== null;
}

