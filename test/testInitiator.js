(function() {
  'use strict';

  const mocha = require('mocha');
  const chai = require('chai');
  const expect = chai.expect;

  const soh = '\u0001';

  const Initiator = require('../src/initiator');
  const MessageBuilder = require('../src/utils/messageBuilder');
  const revTags = require('../src/utils/tags').reverseTags;

  // let options = {
  //   host: 'localhost',
  //   port: 9878,
  //   TargetCompID: 'FIXIMULATOR',
  //   SenderCompID: 'NODE',
  //   BeginString: 'FIX.4.2'
  // };

  let options = require('./options');
  //console.log(options);

  describe('Initiator', function () {
    it.skip('should connect', function (done) {
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

    it.skip('should send a message', function (done) {
      let orderObject = {
        Account: "BJACKSON",
        OrderID: "ORDER1"
      };

      let initiator = new Initiator(options);

      let messageString = MessageBuilder.createFIXstring(orderObject, "IOI", initiator);

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
      this.timeout(2000);
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
          console.log(err);
        });
    });

  });
}());
