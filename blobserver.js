
var dispatch = require('dispatch');

new dispatch.Server(4044, '127.0.0.1').
    addModule(new dispatch.RequestLogModule('/tmp/camli')).
    addModule(new dispatch.db.MongoModule('camlistore')).
    addModule(new dispatch.StatsModule()).
    addAction(require('./homeaction.js')).
    addAction(require('./getaction.js')).
    addAction(require('./stataction.js')).
    addAction(require('./listaction.js')).
    addAction(require('./uploadaction.js')).
    start();
