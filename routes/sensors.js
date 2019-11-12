const express = require('express');
const router = express.Router();

function Sensor(){
  var temp= "";
  var humi= "";
  var time= "";
  var date= "";
};


router.post('/',function (req,res) {
  var now = new Date();
  var hour = now.getHours();
  var min =now.getMinutes();
  var second = now.getSeconds();
  var year = now.getFullYear();
  var month = now.getMonth()+1;
  var day = now.getDate();

  var date = year+"-"+month+"-"+day;
  var time = ""+hour+":"+min+":"+second;

  var temp = req.body.temp;
  var humi = req.body.humi;

  console.log(temp);

  // Data recieve Validation
  if(temp===undefined) console.log('Temp is not sended!');
  if(humi===undefined) console.log('Humi is not sended!');

  var newSensor = new Sensor();
   newSensor.temp = ""+temp;
   newSensor.humi = ""+humi;
   newSensor.time = ""+time;
   newSensor.date = ""+date;

  io.emit('Sensor',newSensor);
  res.json(newSensor);
})



module.exports = router;
