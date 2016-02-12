var assert = require('assert'),
	proxyquire = require('proxyquire'),
	child_process = require('child_process'),

	mockContainer = {
		'./lib/cmd': 'echo "10:net_prio:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c\n9:perf_event:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c"',
		'./lib/hostname': function() { return 'a9f22af02012'; }
	},
	mockRenamedContainer = {
		'./lib/cmd': 'echo "10:net_prio:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c\n9:perf_event:/docker/a9f22af020125424921a9dac4d8ab8681f7d7866da86d51e1fd97db857a51d1c"',
		'./lib/hostname': function() { return 'renamed-hostname'; }
	},
	mockNoContainer = {
		'./lib/cmd': 'echo "10:net_prio:/\n9:perf_event:/"',
		'./lib/hostname': function() { return 'a9f22af02012'; }
	};

describe('containerized', function() {

	if (child_process.execSync) {

		it('should detect sync whether it runs inside a Docker container', function() {
			var containerized = proxyquire('../index.js', mockContainer);
			assert.equal(containerized(), true);
		});

		it('should detect sync whether it runs inside a renamed Docker container', function() {
			var containerized = proxyquire('../index.js', mockRenamedContainer);
			assert.equal(containerized(), true);
		});

		it('should detect sync whether it does not run inside a Docker container', function() {
			var containerized = proxyquire('../index.js', mockNoContainer);
			assert.equal(containerized(), false);
		});

	} else {

		it('should detect async whether it runs inside a Docker container', function(done) {
			var containerized = proxyquire('../index.js', mockContainer);

			containerized(function(err, result) {
				assert.equal(err, null);
				assert.equal(result, true);
				done();
			});
		});

		it('should detect async whether it runs inside a renamed Docker container', function(done) {
			var containerized = proxyquire('../index.js', mockRenamedContainer);

			containerized(function(err, result) {
				assert.equal(err, null);
				assert.equal(result, true);
				done();
			});
		});

		it('should detect async whether it does not run inside a Docker container', function(done) {
			var containerized = proxyquire('../index.js', mockNoContainer);

			containerized(function(err, result) {
				assert.equal(err, null);
				assert.equal(result, false);
				done();
			});
		});
	}

});

