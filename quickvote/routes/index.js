var express = require('express');
var router = express.Router();

const client = require('redis').createClient();

client.on('error', function (err) {
  console.log('Error ' + err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  client.setnx("vote:next.id", 0);
  client.get("vote:current.id", function (err, curId) {
    if (err || curId == null) {
      if (err) {
        console.log(err); // FIXME Use debug.
      }
      res.render('nocurrent');
    } else {
      client.get('vote:' + curId, function (err, reply) {
        if (err || reply == null) {
          if (err) {
            console.log(err); // FIXME Use debug.
          }
          res.render('nocurrent');
        } else {
          var vote = JSON.parse(reply);
          client.ttl('vote:' + curId, function (err, ttl) {
            if (err) {
              console.log("Error getting TTL:", err); // FIXME Use debug.
            }            
            if (ttl == null) {
              console.log("Error, TTL is null");
              ttl = -1;
            }
            res.render('index', { title: 'QuickVote', question: vote.q, answers: vote.a, action: "/vote", ttl: ttl });
          })
        }
      });
    }
  });
});

module.exports = router;
