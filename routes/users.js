var express = require('express');
var User = require('../models/User.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, data) {
        if(err)
            res.send('an error has occured');
        res.json(data);
    });
});

module.exports = router;
