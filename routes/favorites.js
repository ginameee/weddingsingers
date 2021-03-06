var express = require('express');
var router = express.Router();
var isAuthenticated = require('./common').isAuthenticated;
var isSecure = require('./common').isSecure;
var Favorite = require('../models/favorite');
var Notification = require('../models/notification');

// 로깅용 모듈
var logger = require('../common/logger');



// --------------------------------------------------
// HTTP GET /favorites/me : 찜 목록 조회
// --------------------------------------------------
router.get('/me', isAuthenticated, function(req, res, next) {
  logger.log('debug', 'content-type: %s', req.headers['content-type']);
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);

  var info = {};
  info.uid = req.user.id;

  Favorite.findFavoriteByUser(info, function(err, results) {
    if (err) {
      return next(err);
    }
    res.send({
      code: 1,
      result: results
    });
  });
});


// --------------------------------------------------
// HTTP POST /favorites : 찜 하기
// --------------------------------------------------
router.post('/', isAuthenticated, function(req, res, next) {
  logger.log('debug', 'content-type: %s', req.headers['content-type']);
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);

  var favorite = {};
  favorite.uid = req.user.id;
  favorite.vid = req.body.vid;

  var noti_param = {};
  noti_param.sender_id = req.user.id;
  noti_param.sender_name = req.user.name;
  noti_param.data_pk = req.body.vid;
  noti_param.type = 50;
  noti_param.receiver_id = req.body.sid;


  logger.log('debug', 'uid: %s', req.user.uid);
  logger.log('debug', 'vid: %s', req.body.vid);

  Favorite.insertFavorite(favorite, function(err) {
    if (err) {
      return next(err);
    }

    Notification.notify(noti_param, function(err, result) {
      if (err) {
        return next(err);
      }

      res.send({
        code: 1,
        result: result
      });
    });
  });
});


// --------------------------------------------------
// HTTP DELETE /favorites : 찜 목록 삭제
// --------------------------------------------------
router.delete('/', isAuthenticated, function(req, res, next) {
  logger.log('debug', 'content-type: %s', req.headers['content-type']);
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'uid: %s', req.body.uid);
  logger.log('debug', 'vid: %s', req.body.vid);


  var info = {};
  info.uid = req.user.id;
  info.vid = req.body.vid;

  
  Favorite.deleteFavorite(info, function(err) {
    if (err) {
      return next(err);
    }
    res.send({
      code: 1,
      result: '성공'
    });
  });
});


module.exports = router;
