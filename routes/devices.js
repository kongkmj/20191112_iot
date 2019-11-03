const express = require('express');
const router = express.Router();

function bulb(){
  var status= "";
  var time= "";
  var date= "";
};


router.post('/bulb',function (req,res) {
  var now = new Date();
  var hour = now.getHours();
  var min =now.getMinutes();
  var second = now.getSeconds();
  var year = now.getFullYear();
  var month = now.getMonth()+1;
  var day = now.getDate();

  var date = year+"-"+month+"-"+day;
  var time = ""+hour+":"+min+":"+second;

  var status = req.body.bulb;

  var newBulb = new bulb();
  newBulb.status = ""+status;
  newBulb.date  = ""+date;
  newBulb.time  = ""+time;

  io.emit('Bulb',newBulb);
  res.json(newBulb);
})

module.exports = router;
