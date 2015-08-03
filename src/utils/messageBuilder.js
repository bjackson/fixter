const _ = require('lodash');
const tags = require('./tags');
const soh = '\u0001';

export function getNumberForTag(tag) {
  return tags[tag];
}

export function createFIXstring(messageObject) {
  let messageArray = [];

  _.forOwn(messageObject, function (val, key) {
    messageArray.push(key);
    messageArray.push('=');
    messageArray.push(val);
    messageArray.push(soh);
  });

  return messageArray.join('');
}
