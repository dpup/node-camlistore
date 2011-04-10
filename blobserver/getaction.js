/**
 * Action for fetching blobs by blobref.
 * @author dan@pupi.us (Daniel Pupius)
 */

var util = require('util');


/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/camli/:blobref';


/**
 * Executes the action.  Called by the dispatching framework.
 * @param {!Context} ctx The request scoped context object.
 */
exports.execute = function(ctx) {
  var db = ctx.get('db');
  var req = ctx.get('request');
  var res = ctx.get('response');
  var matches = ctx.get('matches');

  if (req.method != 'GET' && req.method != 'HEAD') {
    res.writeHead(405, {'Allow': 'GET, HEAD'});
    res.end();
    return;
  }

  var options = {};
  if (req.method == 'HEAD') {
    // Only query the size field for HEAD requests.
    options['fields'] = ['size'];
  }
  
  db.findFirst('blobs', {'blobref': matches.blobref}, options, function(err, obj) {
    if (obj) {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': obj.size
      });
      if (req.method == 'GET') {
        res.end(obj.bytes.value(), 'binary');
      } else {
        res.end();
      }
    } else {
      if (err) {
        console.log('ERROR retrieving ' + matches.blobref);
        console.log(msg.stack);
      }
      res.writeHead(err ? 500 : 404, {});
      res.end();
    }
  });
};
