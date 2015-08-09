(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const MessageBuilder = require('../src/utils/messageBuilder');
  const MessageParser = require('../src/utils/messageParser');
  const Initiator = require('../src/initiator');

  let options = require('./options');

  describe('MessageBuilder', function () {
    it('should parse a simple message', function () {
      let expectedMessage = '1=BJACKSON' + soh + "37=ORDER1" + soh;
      let orderObject = {
        Account: "BJACKSON",
        OrderID: "ORDER1"
      };

      let initiator = new Initiator(options);

      let messageString = MessageBuilder.createFIXstring(orderObject, 'IOI', initiator);
      expect(messageString).to.eql(expectedMessage);
    });

    it('should build a FIX string with duplicate values', function () {
      let messageString = '1=BJACKSON' + soh + "37=ORDER1" + soh + "37=ORDER2" + soh;
      let orderObject = {
        Account: "BJACKSON",
        OrderID: ["ORDER1", "ORDER2"]
      };

      let initiator = new Initiator(options);

      let messageStringResult = MessageBuilder.createFIXstring(orderObject, 'IOI', initiator);
      expect(messageStringResult).to.eql(messageString);
    });
  });
}());
