var express = require('express');
var router = express.Router();

const randomKey = require('random-key');

// const vcap = JSON.parse(process.env.VCAP_SERVICES);
// const cred = vcap["p-redis"][0].credentials;
//
// const redis = require('redis');
// const client = redis.createClient(cred);
//
// client.on('error', function (err) {
//   console.log('Error ' + err);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.isPopulated) {
    req.session.key = randomKey.generate();
  }
  req.db.setnx("vote:next.id", 0);
  req.db.get("vote:current.id", function (err, curId) {
    if (err || curId == null) {
      if (err) {
        console.log(err); // FIXME Use debug.
      }
      res.render('nocurrent');
    } else {
      req.session.voteId = curId;
      req.db.get('vote:' + curId, function (err, reply) {
        if (err || reply == null) {
          if (err) {
            console.log(err); // FIXME Use debug.
          }
          res.render('nocurrent');
        } else {
          var vote = JSON.parse(reply);
          req.db.ttl('vote:' + curId, function (err, ttl) {
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
