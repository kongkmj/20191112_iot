const express = require('express');
const router = express.Router();


function dashboard(){
  var name = "김민재"
  var bulb = "OFF";
  var bulbIcon = false;
  var air =  "OFF";
  var airIcon = false;
  var temp = "0";
  var humi = "0";
};


router.get('/dashboard',function(req,res){

  var newDash = new dashboard();
  newDash.name = "김민재";
  newDash.bulb = "OFF";
  newDash.bulbIcon = false;
  newDash.air = "OFF";
  newDash.airIcon = false;
  newDash.temp = "0";
  newDash.humi = "0";


  res.render('partials/body/dashboard',{
    name: newDash.name,
    bulb: newDash.bulb,
    bulbIcon: newDash.bulbIcon,
    air: newDash.air,
    airIcon: newDash.airIcon,
    temp: newDash.temp,
    humi: newDash.humi
  });
})


module.exports = router;
