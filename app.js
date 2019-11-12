const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const http = require('http');
const net = require('net');
const WebSocketServer = require('websocket').server;

var firstPacket = [];
var wsClients=[];

var options = {
    //root: path.resolve(__dirname, '../client/'),
    httpPort: 8080,
    tcpPort: 9090
};

// Routes
const routes = require('./routes/index');
const sensors= require('./routes/sensors');
const devices= require('./routes/devices');

// Init App
const app = express();
const server = http.createServer(app).listen(8080);
const server2 = http.createServer(app).listen(4040);

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
    //console.log(data)
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


//set Port
/*
app.set('port',(process.env.PORT || options.httpPort));

server.listen(app.get('port'),function(){
  console.log('Server started on port ' +app.get('port'));
});
*/

/** TCP server */
var tcpServer = net.createServer(function(socket) {
    socket.on('data', function(data){
      /**
       * We are saving first packets of stream. These packets will be send to every new user.
       * This is hack. Video won't start whitout them.
       */
      if(firstPacket.length < 3){
        console.log('Init first packet', firstPacket.length);
        firstPacket.push(data);
      }

      /**
       * Send stream to all clients
       */
      wsClients.map(function(client, index){
        client.sendBytes(data);
      });
    });
});

tcpServer.listen(options.tcpPort);


/** Websocet */
var wsServer = new WebSocketServer({
    httpServer: server2,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  if(firstPacket.length){
    /**
     * Every user will get beginnig of stream
    **/
    firstPacket.map(function(packet, index){
      connection.sendBytes(packet);
    });

  }

  /**
   * Add this user to collection
   */
  wsClients.push(connection);

  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
