# Fixter

[![Join the chat at https://gitter.im/bjackson/fixter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bjackson/fixter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Fixter is a Node.js library to interact with the FIX protocol.

Pull requests and new tests are greatly welcomed.

Fixter is licensed under a BSD license. Do what you want with it.

## Example usage
When messages are received, they are emitted as events on the Initiator object. For example:
```
let initiator = new Initiator(options);
initiator.on('IOI', function(message) {
  console.log('New IOI for ${message.Symbol}. Price: ${message.Price}');
});
```

## SSL support
To use SSL, set `SSL` to true in your Initiator's options.
