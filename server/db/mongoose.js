var mongoose = require('mongoose');

mongoose.Promise = global.Promise ; // to make mongoose works with promises by default it works with callbacks

mongoose.connect(process.env.MONGODB_URI);
module.exports = mongoose