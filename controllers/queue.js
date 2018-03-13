var async = require('async');
var Jobs = require('../models/job');
var FetchURL = require('../controllers/fetch-url');

// database connection
var mysql = require("mysql");
var pool = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'simple-job-queue'
});

// job queue
var queue = async.queue(function (task, cb) {
	if (task.name === 'new-job') {
		Jobs.addJob(pool, task.url, cb);
	} else if (task.name === 'process-job') {
		FetchURL.fetchURL(task.url, cb);
	} else if (task.name === 'finish-job') {
		Jobs.finishJob(pool, task.id, task.status, task.html, cb);
	} else if (task.name === "get-job") {
		Jobs.getJobById(pool, task.id, cb);
	}
});


exports.addJob = function(url) {
	// we don't want the user to have to wait for every part of the job to
	// finish, so we give them a promise just for successfully adding the job
	// to the queue.
	var addJobProm = addJob({ url });
	addJobProm.then(processJob).then(finishJob).catch(function (err) {
		console.error(err);
	});
	return addJobProm;
}

function addJob (args) {
	return new Promise(function(resolve, reject) {
		queue.push({
			name: 'new-job',
			url: args.url
		}, function (err, result) {
			if (!err)
				resolve({
					id: result.insertId,
					url: args.url
				});
			else
				reject(err);
		});
	})
}

function processJob (args) {
	return new Promise(function(resolve, reject) {
		queue.push({
			name: 'process-job',
			id: args.id,
			url: args.url
		}, function (err, html) {
			var res = {
				id: args.id
			};
			if (!err) {
				res.status = 1;
				res.html = html;
			} else {
				res.status = -1;
			}
			resolve(res);
		});
	});
}

function finishJob (args) {
	return new Promise(function(resolve, reject) {
		var task = {
			name: 'finish-job',
			id: args.id,
			status: args.status
		};
		if (args.status > 0) {
			task.html = args.html;
		}
		queue.push(task, function (err, result) {
			if (!err)
				resolve(result)
			else
				reject(err);
		});
	});
}

exports.getJobById = function(id) {
	return new Promise(function(resolve, reject) {
		queue.push({
			name: 'get-job',
			id: id
		}, function (err, result) {
			if (!err)
				resolve(result)
			else
				reject(err);
		});
	});
}
