exports.addJob = function(con, url, cb) {
	con.query("INSERT INTO jobs (status, url) VALUES (0, '" + url + "')", cb);
}

exports.finishJob = function(con, id, status, html, cb) {
	if (status > 0) {
		con.query("UPDATE jobs SET status = " + status + ", result = '" + escape(html) + "' WHERE id = " + id, cb);
	} else {
		con.query("UPDATE jobs SET status = " + status + " WHERE id = " + id, cb);
	}
}

exports.getJobById = function(con, id, cb) {
	con.query("SELECT * FROM jobs WHERE id = " + id, function (err, rows) {
		if (rows.length > 0) {
			// the result prop is the html
			rows[0].result = unescape(rows[0].result);
			cb(false, rows[0]);
		} else {
			cb(true);
		}
	});
}
