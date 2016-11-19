var express = require('express');
var router = express.Router();

var client = require('redis').createClient();

client.on('error', function (err) {
  console.log('Error ' + err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  client.get('current_vote', function (err, reply) {
    console.log(reply);
    if (err || reply == null) {
      if (err) {
        console.log(err);
      }
      res.render('nocurrent');
    } else {
      res.render('index', { title: 'QuickVote', question: reply });
    }
  });
});

module.exports = router;
