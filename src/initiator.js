const net = require('net');
const Message = require('./message');
const MessageTypes = require('./utils/msgTypes').msgTypes;
const EventEmitter = require("events").EventEmitter;

export default class Initiator extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.HeartBtInt = options.HeartBtInt;
    this.sequenceNumber = 1;
  }

  connect() {
    return new Promise((resolve, reject) => {
      let socket = net.connect(this.options.port, this.options.host);
      this.socket = socket;
      socket.on('connect', () => {
        resolve(true);
      });
      socket.on('data', (data) => {
        let message = new Message(data.toString());
        message = message.toJSON();
        console.log(message);
        let messageType = MessageTypes[message.MsgType];
        this.takeActionOnMessage(messageType, message);
      });
      socket.on('error', (err) => {
        console.log(err.toString());
        reject(err);
      });
    });
  }

  send(message) {
    this.socket.write(message);
  }

  logon() {
    let message = new Message(messageObject, reverseMsgTypes.Logon, this);
  }

  takeActionOnMessage(messageType, message) {
    this.emit(messageType, message);
    // switch (messageType) {
    //   case 'Logon':
    //     this.emit('IOI', message);
    //     break;
    //   case 'Logon':
    //     this.emit('Logon', message);
    //     break;
    //   case 'IOI':
    //     this.emit('IOI', message);
    //     break;
    //   default:
    //     //console.log(`UNHANDLED MSG TYPE: ${messageType}`);
    //     this.emit('unknown', message);
    // }
  }
}
