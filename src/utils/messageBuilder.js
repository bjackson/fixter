const _ = require('lodash');
const tags = require('./tags').tags;
const MessageTypes = require('./msgTypes').tags;
const ReverseMessageTypes = require('./msgTypes').reverseMsgTypes;
const soh = '\u0001';
export function getNumberForTag(tag) {
  return tags[tag];
}

export function getNumberForMessageType(tag) {
  return ReverseMessageTypes[tag];
}

export function createFIXstring(messageObject, msgType, client) {
  let bodyArray = [];

  bodyArray.push(getNumberForTag('MsgType'));
  bodyArray.push('=');
  bodyArray.push(getNumberForMessageType(msgType));
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('MsgSeqNum'));
  bodyArray.push('=');
  bodyArray.push(client.sequenceNumber);
  bodyArray.push(soh);

  let now = new Date();
  let sendingTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  let sendingTimeString = (1900 + sendingTime.getYear()) + pad('00', sendingTime.getMonth() + 1, true) + pad('00', sendingTime.getDate(), true) + '-' + pad('00', sendingTime.getHours(), true) + ':' + pad('00', sendingTime.getMinutes(), true) + ':' + pad('00', sendingTime.getSeconds(), true) + '.' + pad('000', sendingTime.getMilliseconds(), false);

  bodyArray.push(getNumberForTag('SendingTime'));
  bodyArray.push('=');
  bodyArray.push(sendingTimeString);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('TargetCompID'));
  bodyArray.push('=');
  bodyArray.push(client.options.TargetCompID);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('SenderCompID'));
  bodyArray.push('=');
  bodyArray.push(client.options.SenderCompID);
  bodyArray.push(soh);


  _.forOwn(messageObject, function (val, key) {
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        bodyArray.push(getNumberForTag(key));
        bodyArray.push('=');
        bodyArray.push(val[i]);
        bodyArray.push(soh);
      }
    } else {
      bodyArray.push(getNumberForTag(key));
      bodyArray.push('=');
      bodyArray.push(val);
      bodyArray.push(soh);
    }
  });

  let bodyString = bodyArray.join('');

  let headerArray = [];

  headerArray.push(getNumberForTag('BeginString'));
  headerArray.push('=');
  headerArray.push(client.options.BeginString);
  headerArray.push(soh);

  headerArray.push(getNumberForTag('BodyLength'));
  headerArray.push('=');
  headerArray.push(bodyString.length);
  headerArray.push(soh);

  let headerString = headerArray.join('');

  let preChecksum = headerString + bodyString;

  let l = 0;
  let sum = _.reduce(preChecksum, function (s, character) {
    return s + character.charCodeAt(0);
  }, l);

  let checkSum = sum % 256;

  let messageString = preChecksum + getNumberForTag('CheckSum') + '=' + pad('000', checkSum, true) + soh;

  client.sequenceNumber++;
  return messageString;
}

function pad(padt, str, padLeft) {
  if (typeof str === 'undefined')
    return padt;
  if (padLeft) {
    return (padt + str).slice(-padt.length);
  } else {
    return (str + padt).substring(0, padt.length);
  }
}
