/**
 * Action for enumerating the blobs stored in this server.
 * @author dan@pupi.us (Daniel Pupius)
 */

var util = require('util');


/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/camli/enumerate-blobs';


exports.execute = function(ctx) {
  var res = ctx.get('response');
  var q = ctx.get('query');
  var db = ctx.get('db');

  db.find('blobs', {}, {'sort': 'blobref', fields: ['blobref', 'size']}, function(err, cursor) {
    if (err) {
      res.writeHead(500, {});
      res.end(err);
    } else {
      cursor.toArray(function(err, items) {
        if (err) {
          res.writeHead(500, {});
          res.end(err);
        } else {
          res.writeHead(200, {'Content-Type': 'text/javascript'});
          res.end(JSON.stringify({
            blobs: items.map(function(item) {
              return {blobRef: item.blobref, size: item.size}
            }) //continueAfter, canLongPoll
          }));
        }
      });
    }
  });
};
