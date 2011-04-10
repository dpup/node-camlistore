This is just some messing around with [Camlistore](http://camlistore.org) in node.

So far there's a partially implemented blob server using mongodb as the backing store.

The server is intended to use my [dispatch library](https://github.com/dpup/dispatch), but the actions were written to use a dependency injection like mechanism so could relatively easily be used elsewhere.  The trickiest piece to substitute will be the 'db' object which wraps [node-mongodb-native](https://github.com/christkv/node-mongodb-native).
