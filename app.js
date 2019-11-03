const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const http = require('http');



// Routes
const routes = require('./routes/index');
const sensors= require('./routes/sensors');
const devices= require('./routes/devices');

// Init App
const app = express();
const server = http.createServer(app);

// socket.io
global.io = require('socket.io').listen(server);

// View Engine
app.set('views',path.join(__dirname,'views'));


app.engine('hbs',hbs({
  extname:'hbs',
  defaultLayout: __dirname+'/views/layouts/layout.hbs',
  partialsDir: __dirname+'/views/partials',
  layoutDir:__dirname+'/views/layouts'
}));
app.set('view engine','hbs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Routes
app.use('/',routes);
app.use('/sensors',sensors);
app.use('/devices',devices);

// bulb
var nsp_bulb = io.of('/device/bulb');
nsp_bulb.on('connection',function (socket){
  console.log("bulb connected");
  socket.on('dash_bulb',function(data){
    if(data=="ON") nsp_bulb.emit('bulb_on',"ON");
    if(data=="OFF") nsp_bulb.emit('bulb_off',"OFF")
  })

  socket.on('disconnect',function(){
    console.log("bulb disconnected");
  });
});

var nsp_air = io.of('/device/air') ;
nsp_air.on('connection',function(socket){
  console.log("air connected");

  socket.on('disconnect',function(){
    console.log("air disconnected");
  });
});


/*
io.on('connection',function(socket){
  //console.log(socket);

  socket.on('disconnect',function(){
    console.log("disconnected");
  })
});
*/


//set Port
app.set('port',(process.env.PORT || 3000));

server.listen(app.get('port'),function(){
  console.log('Server started on port ' +app.get('port'));
});
