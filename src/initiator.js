const net = require('net');
const Message = require('./message');
const MessageTypes = require('./utils/msgTypes').MsgTypes;

export default class Initiator {
  constructor(options) {
    this.options = options;
    this.HeartBtInt = options.HeartBtInt;
    this.sequenceNumber = 1;
  }

  connect() {
    return new Promise((resolve, reject) => {
      let socket = net.connect(this.options.port, this.options.host);
      this.socket = socket;
      socket.on('connect', function () {
        resolve(true);
      });
      socket.on('data', function (data) {
        console.log(data);
      });
      socket.on('error', function (err) {
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
}
