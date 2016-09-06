var express = require('express');
var router = express.Router();
var isAuthenticated = require('./common').isAuthenticated;
var isSecure = require('./common').isSecure;
var Reservation = require('../models/reservation');

// --------------------------------------------------
// HTTP POST /reservations : 예약 신청하기
// --------------------------------------------------
router.post('/', isAuthenticated, function(req, res, next) {
  var reservation = {};
  reservation.cid = req.user.id;
  reservation.place = req.body.place;
  reservation.demand = req.body.demand || '';
  reservation.r_dtime = req.body.reservation_dtime;
  reservation.w_dtime = req.body.write_dtime;
  reservation.sid = req.body.singer_id;
  reservation.type = req.body.type;
  reservation.song = req.body.song;
  console.log(reservation.cid);
  console.log('registerReservation 호출 바로 직전');

  Reservation.registerReservation(reservation, function(err) {
    if (err) {
      return next(err);
    }
    res.send({
      code: 1,
      result: '성공'
    });
  });

});


// --------------------------------------------------
// HTTP PUT /reservations : 예약 상태 수정하기
// --------------------------------------------------
router.put('/', isAuthenticated, function(req, res, next) {

  res.send({
    message: '예약 상태 수정이 정상적으로 처리되었습니다.'
  });

});


// --------------------------------------------------
// HTTP GET /reservations/me : 예약 목록 조회
// --------------------------------------------------
router.get('/me', isAuthenticated, function(req, res, next) {

  // if (req.url.match(/\?pageNo=\d+&rowCnt=\d+/i)) { // 주문 목록 조회 req.url: /?pageNo=1&rowCount=10
  // if (req.query.pageNo || req.query.rowCnt ) {
  //   var pageNo = parseInt(req.query.pageNo, 10) || 1;
  //   var rowCnt = parseInt(req.query.rowCnt, 10) || 1;
  // }


  Reservation.findReservationByUser(req.user, function(err, results) {
    if (err) {
      return callback(err);
    }

    res.send({
      code: 1,
      result: results
    });
  });
});


// --------------------------------------------------
// HTTP GET /reservations/:id : 예약 상세 보기
// --------------------------------------------------
router.get('/:id', isAuthenticated, function(req, res, next) {

  res.send({
    message: '예약 상세 보기가 정상적으로 처리되었습니다.',
    result: {
      singer_name: '이장춘',
      place: '인천 춘 예식장',
      reservation_dtime: '2015-05-31 09:00:00',
      song: '나 항상 그대를',
      demand: '춤도 춰주세요!',
      price: 300000
    }
  });

});
module.exports = router;
