
var crypto = require('crypto');
var util = require('util');
var fs = require('fs');
var dispatch = require('dispatch');
var flags = dispatch.flags;
var Binary = require('mongodb').BSONNative.Binary;

flags.defineString('file', null, 'The file to put into the store.');

new dispatch.App().
    addModule(new dispatch.db.MongoModule('camlistore')).
    start(function(ctx) {
      var db = ctx.get('db');
      var file = fs.readFileSync(flags.get('file'));
      var hash = crypto.createHash('sha1');
      hash.update(file.toString('binary'));
      var binObj = new Binary();
      binObj.write(file);
      var item = {
        blobref: 'sha1-' + hash.digest('hex'),
        size: file.length,
        bytes: binObj
      };
      console.log('Writing ' + item.blobref);
      db.insert('blobs', item, function(err, items) {
        if (err) console.warn(err);
        else console.log(items.length + ' items inserted');
        process.exit(0);
      });
    });
