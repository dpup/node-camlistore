/**
 * Action for stating the server and blobs.
 * @author dan@pupi.us (Daniel Pupius)
 */
 
var qs = require('querystring'); 

/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/camli/stat';


exports.execute = function(ctx) {
  switch (ctx.get('request').method) { 
    case 'GET': execute(ctx, ctx.get('query')); break;
    case 'POST': post(ctx); break;
    default:
      res.writeHead(405, {'Allow': 'GET, POST'});
      res.end();
  }
};

function post(ctx) {
  var data = '';
  var req = ctx.get('request');
  req.setEncoding('utf8');
  req.on('data', function(chunk) { data += chunk; });
  req.on('end', function() {
    execute(ctx, qs.parse(data));
  });
}

function execute(ctx, q) {
  var res = ctx.get('response');

  if (q.camliversion != 1) {
    console.log('Bad camliversion');
    res.writeHead(400, {});
    res.end();
    return;
  }

  var blobs = [];
  var i = 0;
  while (q['blob' + ++i]) {
    blobs.push(q['blob' + i]);
  }
  
  if (blobs.length > 0) {
    var db = ctx.get('db');
    var query = {'$or': blobs.map(function(item) {
      return {'blobref': item}
    })};
    var options = {'sort': 'blobref', 'fields': ['blobref', 'size']};
    db.find('blobs', query, options, function(err, cursor) {
      if (err) {
        sendError(res, err);
      } else {
        cursor.toArray(function(err, items) {
          if (err) {
            sendError(res, err);
          } else {
            sendResponse(res, items.map(function(item) {
              return {
                'blobRef': item.blobref,
                'size': item.size
              };
            }));
          }
        });
      }
    });    
  } else {
    sendResponse(res, []);
  }
}

function sendResponse(res, stat) {
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end(JSON.stringify({
    'stat': stat,
    'maxUploadSize': 10485760, // 10MB for now, experiment with grid store.
    'uploadUrl': '', // TODO
    'uploadUrlExpirationSeconds': 7200,
    'canLongPoll': false  // false for now.
  }));
}

function sendError(res, err) {
  console.log(err.stack);
  res.writeHead(500, {});
  res.end();
}