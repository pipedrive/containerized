var assert = require('assert'),
	sinon = require('sinon'),
	proxyquire = require('proxyquire'),
	child_process = require('child_process'),
	_ = require('lodash'),

	hostname = 'a9f22af02012',
	mockContainer = {
		cgroups: '10:net_prio:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c\n9:perf_event:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c',
	},
	mockNoContainer = {
		cgroups: '10:net_prio:/\n9:perf_event:/'
	};

var mockContainerAsync = _.extend({}, mockContainer, {
	child_process: {
		execSync: undefined
	},
	'./lib/cmd': function() {
		return 'echo "' + mockContainer.cgroups + '"';
	},
	'./lib/hostname': function() {
		return hostname;
	}
});

var mockNoContainerAsync = _.extend({}, mockNoContainer, {
	child_process: {
		execSync: undefined
	},
	'./lib/cmd': function() {
		return 'echo "' + mockNoContainer.cgroups + '"';
	},
	'./lib/hostname': function() {
		return hostname;
	}
});

var mockContainerSync = _.extend({}, mockContainer, {
	child_process: {
		execSync: function() {
			return mockContainer.cgroups;
		}
	},
	'./lib/hostname': function() {
		return hostname;
	}
});

var mockNoContainerSyncForError = _.extend({}, mockNoContainer, {
	child_process: {
		execSync: function() {
			throw new Error('xxx');
		}
	},
	'./lib/hostname': function() {
		return hostname;
	}
});

var mockNoContainerSync = _.extend({}, mockNoContainer, {
	child_process: {
		execSync: function() {
			return mockNoContainer.cgroups;
		}
	},
	'./lib/hostname': function() {
		return hostname;
	}
});

var mockNoContainerSyncWithSpy = _.extend({}, mockNoContainerSync, {
	child_process: {
		execSync: sinon.spy(mockNoContainerSync.child_process.execSync)
	}
});
var mockNoContainerAsyncWithSpy = _.extend({}, mockNoContainerAsync, {
	'./lib/cmd': sinon.spy(mockNoContainerAsync['./lib/cmd'])
});

describe('containerized lib', function() {

	it('should detect sync whether it runs inside a Docker container', function() {
		var containerized = proxyquire('../index.js', mockContainerSync);
		assert.equal(containerized(), true);
	});

	it('should detect sync whether it does not run inside a Docker container', function() {
		var containerized = proxyquire('../index.js', mockNoContainerSync);
		assert.equal(containerized(), false);
	});

	it('should handle errors in sync mode', function() {
		var containerized = proxyquire('../index.js', mockNoContainerSyncForError);

		containerized();
	});

	it('should detect async whether it runs inside a Docker container', function(done) {
		var containerized = proxyquire('../index.js', mockContainerAsync);

		containerized(function(err, result) {
			assert.equal(err, null);
			assert.equal(result, true);
			done();
		});
	});

	it('should detect async whether it does not run inside a Docker container', function(done) {
		var containerized = proxyquire('../index.js', mockNoContainerAsync);

		containerized(function(err, result) {
			assert.equal(err, null);
			assert.equal(result, false);
			done();
		});
	});

	it('should utilize cache after first call in sync mode', function() {
		var containerized = proxyquire('../index.js', mockNoContainerSyncWithSpy);
		assert.equal(containerized(), false);
		assert.equal(containerized(), false);
		assert.equal(containerized(), false);
		assert.equal(mockNoContainerSyncWithSpy.child_process.execSync.callCount, 1);
	});

	it('should utilize cache after first call in async mode', function(done) {
		var containerized = proxyquire('../index.js', mockNoContainerAsyncWithSpy);
		containerized(function(err, result) {
			assert.equal(err, null);
			assert.equal(result, false);

			containerized(function(err, result) {
				assert.equal(err, null);
				assert.equal(result, false);

				assert.equal(mockNoContainerAsyncWithSpy['./lib/cmd'].callCount, 1);
				done();
			});
		});
	});

});

describe('lib/cmd.js', function() {
	it('should cat cgroups', function() {
		var cmd = require(__dirname + '/../lib/cmd');
		assert.equal(cmd(), 'cat /proc/self/cgroup');
	});
});

describe('lib/hostname.js', function() {
	it('should return os.hostname()', function() {
		var hostnameLib = require(__dirname + '/../lib/hostname');
		assert.equal(hostnameLib(), require('os').hostname());
	});
});
