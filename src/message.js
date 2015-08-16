import * as MessageBuilder from './utils/messageBuilder';
import * as MessageParser from './utils/MessageParser';

export default class Message {
 /**
   * Creates a Message.
   * @constructor
   * @param {string} body - The title of the book.
   * @param {string} messageType - MsgType.
   * @param {Initiator} Initiator that will send this message.
 */
  constructor(body, msgType, client, transforms) {
    if (typeof body === 'string') {
      this.body = body;
      this.message = MessageParser.parseFIXstring(body);
    } else if (typeof body === 'object') {
      this.message = body;
      this.body = MessageBuilder.createFIXstring(body, msgType, client, transforms);
    } else {
      throw 'unsupported message type';
    }
  }

  toJSON() {
    return this.message;
  }

  toFIX() {
    return this.body;
  }
}
