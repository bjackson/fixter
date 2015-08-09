# Fixter

Fixter is a Node.js library to interact with the FIX protocol.

Pull requests and new tests are greatly welcomed.

## Example usage
When messages are received, they are emitted as events on the Initiator object. For example:
```
let initiator = new Initiator(options);
initiator.on('IOI', function(message) {
  console.log('New IOI for ${message.Symbol}. Price: ${message.Price}');
});
```
