(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const MessageBuilder = require('../src/utils/messageBuilder');
  const MessageParser = require('../src/utils/messageParser');

  describe('MessageParser', function () {
    it('should parse a FIX string', function () {
      let messageString = '1=BJACKSON' + soh + "37=ORDER1" + soh;
      let orderObject = {
        Account: "BJACKSON",
        OrderID: "ORDER1"
      };

      let messageObject = MessageParser.parseFIXstring(messageString);
      expect(messageObject).to.eql(orderObject);
    });

    it('should parse a FIX string with duplicate values', function () {
      let messageString = '1=BJACKSON' + soh + "37=ORDER1" + soh + "37=ORDER2" + soh;
      let orderObject = {
        Account: "BJACKSON",
        OrderID: ["ORDER1", "ORDER2"]
      };

      let messageObject = MessageParser.parseFIXstring(messageString);
      expect(messageObject).to.eql(orderObject);
    });
  });
}());
