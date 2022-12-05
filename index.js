const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;
const INDEX = '/public/index.html';
const staticPath = '/dist/';
const io = require("socket.io")(http, {
  transports: [
    'websocket', 
    'flashsocket', 
    'htmlfile', 
    'xhr-polling', 
    'jsonp-polling', 
    'polling'
  ],
	cors: {
		origins: "*"
	},
});

const hubs = new Map(); // holds connected hubs (maps id to name)

app.use(express.static(__dirname + staticPath));

// emit cheatsheet: https://socket.io/docs/v3/emit-cheatsheet/

io.use((socket, next) => {
  const type = socket.handshake.headers.type;
  if (type == "browser") {
    socket.join("browsers"); // joins browsers room
    console.log('[browser -> server] browser connected');
  } 
  else if (type == "hub") {
    const hubID = socket.id;
    const hubName = socket.handshake.headers.name;
    hubs.set(hubID, hubName);
    console.log('[hub -> server] hub ' + hubName + ' (' + hubID + ') connected');
    io.in("browsers").emit('hubs', hubs);
    console.log('[server -> browsers] sent connected hubs to connected browsers');
  }
  console.log();
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + INDEX);
});

io.on('connection', (socket) => {
  // BROWSERS AND HUBS
  // disconnecting
  socket.on('disconnect', () => {
    // if disconnecting socket is a hub, delete it from hubs
    if (hubs.has(socket.id)) {
      const hubID = socket.id;
      const hubName = hubs.get(socket.id);
      console.log('[hub -> server] hub ' + hubName + ' (' + hubID + ') disconnected');
      hubs.delete(hubID);
      io.in("browsers").emit('hubs', hubs);
      console.log('[server -> browsers] sent connected hubs to connected browsers');
    } else {
      console.log('[browser -> server] a browser disconnected');
    }
    console.log();
  });

  // BROWSERS
  // requesting all connected hubs
  socket.on('getAllHubs', () => {
    console.log('[browser -> server] all connected hubs requested');
    const browserID = socket.id;
    const hubsform = {};
    hubs.forEach((value, key) => {
      hubsform[key] = value;
    });
    io.to(browserID).emit('hubs', hubsform);
    console.log('[server -> browsers] sent connected hubs to connected browsers');
    console.log();
  });
  // requesting hub pins by id
  socket.on('getHub', (hubID) => {
    // if hub still connected, request hub to send pin state info
    console.log('[browser -> server] pin info of hub with ID: ' + hubID + ', requested');
    if (hubs.has(hubID)) {
      console.log('requested hub is connected');
      io.to(hubID).emit('getPins');
      console.log('[server -> hub] requested pin info');
    }
    // if hub disconnected send browsers currently connected hubs
    else {
      console.log('requested hub not found');
      io.in("browsers").emit('hubs', hubs);
      console.log('[server -> browsers] sent connected hubs to connected browsers');
    }
    console.log();
  });
  // setting hub pin state by id
  socket.on('setPin', (data) => {
    const hubID = data.hubID;
    console.log('[browser -> server] requested to set pin of hub with ID:', hubID);
    console.log('pin ID: ' + data.pinID);
    console.log('pin state: ' + data.pinState);
    if (hubs.has(hubID)) {
      console.log('requested hub is connected');
      const pin = {
        'id': data.pinID,
        'state': data.pinState
      };
      io.to(hubID).emit('setPin', pin);
      console.log('[server ->  hub] requested hub to set pin to said state');
    }
    // if hub disconnected send browsers currently connected hubs
    else {
      console.log('requested hub not found');
      io.in("browsers").emit('hubs', hubs);
      console.log('[server -> browsers] sent connected hubs to connected browsers');
    }
    console.log();
  });

  // HUBS
  // sending hub pins
  socket.on('pins', (pins) => {
    console.log('[hub -> server] hub with ID: ' + socket.id + ', sent pin info');
    const hubID = socket.id;
    const data = {
      'id': hubID,
      'pins': pins
    };
    io.in("browsers").emit('pins', data);
    console.log('-[server -> browsers] sent pin info of said hub to connected browsers');
    console.log();
  });
});

http.listen(PORT, () => {
  console.log('listening on *: ' + PORT);
});