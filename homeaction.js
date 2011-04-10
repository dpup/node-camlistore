
/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/';


exports.execute = function(ctx) {
  var res = ctx.get('response');
  res.writeHead(200, {});
  res.end('Home');
};
