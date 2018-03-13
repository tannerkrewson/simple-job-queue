// uses correct protocol depending on url
// https://stackoverflow.com/questions/15317902/node-js-automatic-selection-of-http-get-vs-https-get/38465918#38465918
var adapterFor = (function() {
	var url = require('url');
	var adapters = {
		'http:': require('http'),
		'https:': require('https'),
	};

	return function(inputUrl) {
		return adapters[inputUrl.protocol]
	}
}());

exports.fetchURL = function (url, cb) {
	adapterFor(url).get(url, function (res) {
		var data = '';

		res.on('data', function (chunk) {
		 	data += chunk;
		});

		res.on('end', function () {
			cb(false, data);
		});

	}).on("error", (err) => {
		cb(true);
	});
}
