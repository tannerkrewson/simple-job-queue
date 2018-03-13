var express = require('express');
var router = express.Router();
const { URL } = require('url');

var JobQueue = require('../controllers/queue');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Job Queue', author: 'Tanner Krewson' });
});

router.post('/job', function(req, res, next) {
    var theURL = req.body.url;

    // add http to url if it's not there
    if (!/^https?\:\/\//.test(theURL)) {
        theURL = "http://" + theURL;
    }

    try {
        theURL = new URL(theURL);

        JobQueue.addJob(theURL).then(function (args) {
            res.status(201).location('/job/' + args.id).json(args);
        }).catch(function () {
            res.sendStatus(500);
        });

    } catch (e) {
        console.log(e);
        res.status(400).send('Not a valid url: ' + req.body.url);
    }
});



module.exports = router;
