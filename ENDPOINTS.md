# Server -> Browsers
``` 
io.in("browsers").emit(endpoint, data);
```
- tell browsers a hub disconnected
```
io.in("browsers").emit('hubDisconnect', hubID);
```
- tell browsers a hub connected
```
const data = {
    'id': hubID,    // String
    'name': hubName // String
};
io.in("browsers").emit('hubConnect', data);
```
- tell browsers pin states
```
const data = {
    'id': hubID,    // String
    'pins': {
        pinID1: pinState1,  // String: boolean
        pinID2: pinState2,  // String: boolean
        ...
    }
};
io.in("browsers").emit('pins', data);
```

# Server -> Browser
```
io.to(browserID).emit(endpoint, data); // type(browserID) = String
```
- send browser all connected hubs
```
const hubs = {
    hubID1: hubName1, // String: String
    hubID2: hubName2, // String: String
    ...
};
io.to(browserID).emit('hubs', hubs);
``` 

# Server -> Hub
```
io.to(hubID).emit(endpoint, data); // type(hubID) = String
```
- request pins from hub
```
io.to(hubID).emit('getPins');
```
- set pin state
```
const pin = {
    'id': pinID,        // String
    'state': pinState   // boolean
};
io.to(hubID).emit('setPin', pin);
```