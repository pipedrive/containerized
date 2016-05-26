var containerized = null,
	child_process = require('child_process'),
	cmd = require('./lib/cmd'),
	hostname = require('./lib/hostname')();

module.exports = function(callback) {
	var err,
		cgroups = '';
	
	if (typeof callback !== 'function') {
		callback = function() {};
	}

	if (containerized === null) {
		// not determined yet. must determine and cache.
		if (child_process.execSync) {
			// sync (node > 0.10.x)
			try {
				cgroups = child_process.execSync(cmd());
			} catch (e) {
				err = e;
			}
			containerized = !!determine(cgroups.toString('utf8'));
			callback(err, containerized);
			return containerized;
		} else {
			// async (node <= 0.10.x)
			child_process.exec(cmd(), function(err, data) {
				containerized = !!determine(data);
				callback(err, containerized);
			});
			return null;
		}
		
	} else {
		// already determined. use cache.
		callback(null, containerized);
		return containerized;
	}

};

function determine(data) {
	return data.match(new RegExp('[0-9]+\:[a-z_-]+\:\/docker\/' + hostname + '[0-9a-z]+', 'i')) !== null;
}
