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

  let bodyString = messageArray.join('');

  let headerArray = [];

  headerArray.push(getNumberForTag('BeginString'));
  headerArray.push('=');
  headerArray.push(client.options.BeginString);
  headerArray.push(soh);

  headerArray.push(getNumberForTag('BodyLength'));
  headerArray.push('=');
  headerArray.push(bodyString.length);
  headerArray.push(soh);

  headerArray.push(getNumberForTag('MsgType'));
  headerArray.push('=');
  headerArray.push(getNumberForMessageType(msgType));
  headerArray.push(soh);

  let headerString = bodyArray.join('');

  let preChecksum = headerString + bodyString;

  let sum = _.reduce(preChecksum, function (sum, character) {
    return sum + character.charCodeAt(0);
  });

  let checkSum = sum % 256;

  let messageString = preChecksum + getNumberForTag('CheckSum') + '=' + checkSum + soh;

  return messageString;
}
