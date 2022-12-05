import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io('https://sleepy-sea-55842.herokuapp.com/'
        , {
            extraHeaders: {
                type: 'browser',
            }
        });
        console.log(`Connecting socket...`);
    }

    subscribeToHubs(cb) {
        if (!this.socket) return(true);
        this.socket.on('hubs', (hubs) => {
            console.log('Hubs received!');
            console.log(hubs);
            return cb(hubs);
        });
    }

    subscribeToPins(cb) {
        if(!this.socket) return(true);
        this.socket.on('pins', data => {
            console.log('Pins recieved');
            console.log(data);
            return cb(data);
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    getHubs() {
        this.socket.emit('getAllHubs');
    }

    getHub(hubID) {
        this.socket.emit('getHub', hubID);
    }

    setPin(hubID, pinID, pinState) {
        const data = {
            'hubID': hubID,
            'pinID': pinID,
            'pinState': pinState
        };
        this.socket.emit('setPin', data);
    }
}

export default new SocketioService();