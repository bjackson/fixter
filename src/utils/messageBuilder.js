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

export function createFIXstring(message, msgType, client, transforms) {
  let bodyArray = [];

  let now = new Date();
  let sendingTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  let sendingTimeString = (1900 + sendingTime.getYear()) + pad('00', sendingTime.getMonth() + 1, true) + pad('00', sendingTime.getDate(), true) + '-' + pad('00', sendingTime.getHours(), true) + ':' + pad('00', sendingTime.getMinutes(), true) + ':' + pad('00', sendingTime.getSeconds(), true) + '.' + pad('000', sendingTime.getMilliseconds(), false);

  message.SendingTime = sendingTimeString;
  message.MsgSeqNum = client.sequenceNumber;
  message.MsgType = getNumberForMessageType(msgType);
  message.TargetCompID = client.options.TargetCompID;
  message.SenderCompID = client.options.SenderCompID;
  message.BeginString = client.options.BeginString;

  let adminFields = ['MsgType', 'MsgSeqNum', 'SendingTime', 'TargetCompID', 'SenderCompID', 'BeginString', 'BodyLength'];

  bodyArray.push(getNumberForTag('MsgType'));
  bodyArray.push('=');
  bodyArray.push(message.MsgType);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('MsgSeqNum'));
  bodyArray.push('=');
  bodyArray.push(message.MsgSeqNum);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('SendingTime'));
  bodyArray.push('=');
  bodyArray.push(message.SendingTime);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('TargetCompID'));
  bodyArray.push('=');
  bodyArray.push(message.TargetCompID);
  bodyArray.push(soh);

  bodyArray.push(getNumberForTag('SenderCompID'));
  bodyArray.push('=');
  bodyArray.push(message.SenderCompID);
  bodyArray.push(soh);

  if (transforms) {
    message = _.assign(message, transforms(message, sendingTimeString));
  }

  _.forOwn(message, function (val, key) {
    if (!_.includes(adminFields, key)) {
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
    }
  });

  let bodyString = bodyArray.join('');

  let headerArray = [];

  headerArray.push(getNumberForTag('BeginString'));
  headerArray.push('=');
  headerArray.push(message.BeginString);
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
