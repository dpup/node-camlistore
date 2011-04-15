/**
 * Action for handling blob uploads.
 * @author dan@pupi.us (Daniel Pupius)
 */

var camli = require('./camli');

var crypto = require('crypto');
var formidable = require('formidable');
var fs = require('fs');
var sys = require('sys');

/**
 * Path to install this action on.
 * @type {string}
 */
exports.path = '/camli/upload';


exports.execute = function(ctx) {
  var req = ctx.get('request');
  var res = ctx.get('response');
  var baseurl = ctx.get('baseurl');
  var db = ctx.get('db');
  
  var form = new formidable.IncomingForm();
  // TODO : Use 'file' event to process files as they arrive.
  form.parse(req, function(err, fields, files) {
    if (err) return sendError(res, err);
    var fileList = Object.keys(files).map(function(k) { return files[k]; });
    processFiles(fileList, baseurl, db, function(err, data) {
      deleteTempFiles(fileList);
      if (err) return sendError(res, err);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end(JSON.stringify(data));
    });
  });
};


function processFiles(files, baseurl, db, callback, opt_savedFiles) {
  var savedFiles = opt_savedFiles || [];
  if (files.length == 0) {
    callback(null, {
      'received': savedFiles,
      'maxUploadSize': camli.MAX_UPLOAD_SIZE,
      'uploadUrl': baseurl + '/camli/upload/',
      'uploadUrlExpirationSeconds': camli.URL_EXPIRATION,
      'canLongPoll': false  // false for now.
    });
  } else {
    var file = files.shift();
    savedFiles.push({'blobRef': file.name, 'size': file.size});
    // TODO : Stream the file, computing hash and writing to DB at the same time
    // rather than reading it all into memory.
    camli.fileToDbItem(file.path, function(err, item) {
      if (err) return callback(err);
      if (item.blobRef != file.name) {
        return callback(Error('Mismatched blob ref, ' +
            file.name + ' vs ' + expectedBlobRef));        
      }
      console.log('Writing ' + item.blobref);
      db.insert('blobs', item, function(err, items) {
        if (err) return callback(err);
        processFiles(files, baseurl, db, callback, savedFiles);
      });
    });
  }
}


function deleteTempFiles(fileList) {
  fileList.forEach(function(file) {
    fs.unlink(file, function(err) {
      console.log('Unable to delete temp file: ' + file, sys.inspect(err));
    });
  });
}


function sendError(res, err) {
  console.log(err, err.stack);
  res.writeHead(500, {});
  res.end(err.message);
}
