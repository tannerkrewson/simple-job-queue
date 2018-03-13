var express = require('express');
var router = express.Router();
const { URL } = require('url');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Job Queue', author: 'Tanner Krewson' });
});

router.post('/add', function(req, res, next) {
    var theURL = req.body.url;

    // add http to url if it's not there
    if (!/^https?\:\/\//.test(theURL)) {
        theURL = "http://" + theURL;
    }

    try {
        theURL = new URL(theURL);
        // do the thing
        res.send('will do');
    } catch (e) {
        console.log(e);
        res.status(400).send('Not a valid url: ' + req.body.url);
    }
});

module.exports = router;
