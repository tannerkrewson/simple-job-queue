const crypto = require('crypto');

exports.addJob = function(con, cb) {
	con.query("INSERT INTO jobs (done) VALUES (0)", cb);
}

exports.finishJob = function(con, id, html, cb) {
	con.query("UPDATE jobs SET result = '" + html + "', done = 1 WHERE id = " + id, cb);
}

exports.getJobById = function(con, id, cb) {
	con.query("SELECT * FROM jobs WHERE id = " + id, function (err, result) {
		if (result.length > 0) {
			cb(false, result[0]);
		} else {
			cb(true);
		}
	});
}
