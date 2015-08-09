require("babel/register");

(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const Initiator = require('../src/initiator');
  const MessageBuilder = require('../src/utils/messageBuilder');
  const revTags = require('../src/utils/tags').reverseTags;

  let options = require('../test/options');

  let initiator = new Initiator(options);

  let logonOptions = {
    EncryptMethod: 0,
    HeartBtInt: 30
  };

  let messageString = MessageBuilder.createFIXstring(logonOptions, "Logon", initiator);
  console.log(messageString.replace(/\u0001/g, '\n'));

  initiator.connect()
    .then(function (result) {
      expect(result).to.eql(true);
      initiator.send(messageString);
      //done();
    })
    .catch(function (err) {
      console.log(err.toString());
    });

}());
