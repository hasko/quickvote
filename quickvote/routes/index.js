var express = require('express');
var router = express.Router();

const client = require('redis').createClient();

client.on('error', function (err) {
  console.log('Error ' + err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  client.get('current_vote', function (err, reply) {
    if (err || reply == null) {
      if (err) {
        console.log(err);
      }
      res.render('nocurrent');
    } else {
      var vote = JSON.parse(reply);
      console.log(vote);
      res.render('index', { title: 'QuickVote', question: vote.q, answers: vote.a });
    }
  });
});

module.exports = router;
