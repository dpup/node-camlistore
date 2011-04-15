
var crypto = require('crypto');
var fs = require('fs');
var Binary = require('mongodb').BSONNative.Binary;


exports.MAX_UPLOAD_SIZE = 10485760;


exports.URL_EXPIRATION = 7200;


exports.calcBlobRef = function(buffer) {
  var hash = crypto.createHash('sha1');
  hash.update(buffer.toString('binary'));
  return 'sha1-' + hash.digest('hex');
};


exports.fileToDbItem = function(path, callback) {
  fs.readFile(file.path, function(err, data) {
    if (err) return callback(err);
    var binObj = new Binary();
    binObj.write(data);
    callback(null, {
      blobref: camli.calcBlobRef(data),
      size: data.length,
      bytes: binObj
    });
  });  
};
