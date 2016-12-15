var express = require('express');
var router = express.Router();

const vcap = JSON.parse(process.env.VCAP_SERVICES);
const cred = vcap["p-redis"][0].credentials;

const redis = require('redis');
const client = redis.createClient(cred);

/* GET users listing. */
router.post('/', function(req, res, next) {
  if (req.session == null || req.session.key == null || req.session.voteId == null) {
      console.log("Session error", req.session);
      res.sendStatus(400);
  } else {
      var k = 'vote:' + req.session.voteId + ':answers';
      client.hset(k, req.session.key, req.body.answer);
      client.expire(k, 38400);
      res.redirect('/results');
  }
});

module.exports = router;
