import * as MessageBuilder from './utils/messageBuilder';

export default class Message {
  constructor(options) {
    if (typeof options === 'string') {
      this.body = options;
    } else if (typeof options === 'object') {
      this.body = MessageBuilder.createMessage(options);
    }
  }

  toJSON() {

  }

  toFIX() {
    
  }
}
