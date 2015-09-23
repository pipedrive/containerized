var os = require('os');

module.exports = function() {
	return os.hostname();
};