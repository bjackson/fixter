(function() {
  'use strict';

  require("babel/register");

  const crypto = require('crypto');

  const soh = '\u0001';

  const Initiator = require('../src/initiator');
  const MessageBuilder = require('../src/utils/messageBuilder');
  const revTags = require('../src/utils/tags').reverseTags;

  let options = require('./coinbaseOptions');

  let initiator = new Initiator(options);

  let logonOptions = {
    EncryptMethod: 0,
    HeartBtInt: 30,
    Password: options.Password
  };

  let messageString = MessageBuilder.createFIXstring(logonOptions, "Logon", initiator,
    function(msg, sendingTimeString) {
      let prehash = [msg.SendingTime, msg.MsgType, msg.MsgSeqNum, msg.SenderCompID, msg.TargetCompID, options.Password].join(soh);

      let key = new Buffer(options.APISecret, 'base64');
      let hmac = crypto.createHmac('sha256', key);
      return { RawData: hmac.update(prehash).digest('base64') };
  });
  console.log(messageString.replace(/\u0001/g, '\n'));

  initiator.connect()
    .then(function (result) {
      initiator.send(messageString);
      //done();
    })
    .catch(function (err) {
      console.log(err.toString());
    });


}());
