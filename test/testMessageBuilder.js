(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const MessageBuilder = require('../src/utils/messageBuilder');

  describe('MessageBuilder', function () {
    it('should parse a simple message', function () {
      let expectedMessage = '1=BJACKSON' + soh + "37=ORDER1" + soh;
      let orderObject = {
        Account: "BJACKSON",
        OrderID: "ORDER1"
      };

      var messageString = MessageBuilder.createFIXstring(orderObject);
    });
  });
}());
