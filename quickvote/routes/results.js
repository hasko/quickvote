var express = require('express');
var router = express.Router();

const client = require('redis').createClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session == null || req.session.key == null || req.session.voteId == null) {
      console.log("Session error", req.session);
      res.sendStatus(400);
  } else {
    client.hvals('vote:' + req.session.voteId + ':answers', function (err, replies) {
      if (err) {
        console.log("Error accessing answers:", req.session.voteId, err);
        res.sendStatus(500);
      } else {
        var tally = {};
        replies.forEach(function (reply, i) {
          if (!tally[reply]) {
            tally[reply] = 0;
          }
          tally[reply]++;
        });
        var arr = [];
        Object.keys(tally).forEach(function (ans) {
          var count = tally[ans];
          arr.push({ name: ans, value: count });
        });
        res.render('results', { question: 'FIXME', tally: tally, arr: arr });
      }
    });
  }
});

module.exports = router;
