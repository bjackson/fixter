const _ = require('lodash');
const tags = require('./tags').reverseTags;
const soh = '\u0001';

export function getTagForNumber(tag) {
  return tags[tag];
}

export function parseFIXstring(messageString) {
  let keyValPairs = messageString.split(soh);

  let messageObj = {};

  if (keyValPairs.length === 0) {
    return messageObj;
  }

  for (let keyVal of keyValPairs) {
    if (keyVal === '') {
      return messageObj;
    }
    let pair = keyVal.split('=');
    let tag = getTagForNumber(pair[0]);
    let val = pair[1];
    if (messageObj[tag]) {
      if (!Array.isArray(messageObj[tag])) {
        messageObj[tag] = [messageObj[tag]];
      }
      messageObj[tag].push(val);
    } else {
          messageObj[tag] = val;
    }
  }

  return messageObj;
}
