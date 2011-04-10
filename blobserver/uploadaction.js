
/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/upload';


exports.execute = function(ctx) {
  var res = ctx.get('response');
  res.writeHead(200, {});
  res.end('Upload');
};
