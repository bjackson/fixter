(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const Initiator = require('../src/initiator');
  const MessageBuilder = require('../src/utils/messageBuilder');

  let options = {
    host: 'localhost',
    port: 9878,
    TargetCompID: 'FIXIMULATOR',
    SenderCompID: 'NODE',
    BeginString: 'FIX.4.2'
  };

  describe('Initiator', function () {
    it('should connect', function (done) {
      let initiator = new Initiator(options);
      initiator.connect()
        .then(function (result) {
          expect(result).to.eql(true);
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    it('should send a message', function (done) {
      let orderObject = {
        Account: "BJACKSON",
        OrderID: "ORDER1"
      };

      let messageString = MessageBuilder.createFIXstring(orderObject);

      let initiator = new Initiator(options);
      initiator.connect()
        .then(function (result) {
          expect(result).to.eql(true);
          initiator.send(messageString);
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    it('should send a logon', function (done) {
      let messageString = MessageBuilder.createFIXstring(orderObject);

      let initiator = new Initiator(options);
      initiator.connect()
        .then(function (result) {
          expect(result).to.eql(true);
          initiator.send(messageString);
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });

  });
}());
