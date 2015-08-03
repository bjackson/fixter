const _ = require('lodash');
const tags = require('./tags').tags;
const soh = '\u0001';
export function getNumberForTag(tag) {
  return tags[tag];
}

export function createFIXstring(messageObject) {
  let messageArray = [];

  _.forOwn(messageObject, function (val, key) {
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        messageArray.push(getNumberForTag(key));
        messageArray.push('=');
        messageArray.push(val[i]);
        messageArray.push(soh);
      }
    } else {
      messageArray.push(getNumberForTag(key));
      messageArray.push('=');
      messageArray.push(val);
      messageArray.push(soh);
    }
  });

  return messageArray.join('');
}
