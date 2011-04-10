

/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/camli/stat';


exports.execute = function(ctx) {
  var res = ctx.get('response');
  res.writeHead(200, {});
  res.end('Stat');
};