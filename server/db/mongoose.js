var mongoose = require('mongoose');
mongoose.Promise = global.Promise ; // to make mongoose works with promises by default it works with callbacks

mongoose.connect('mongodb://localhost:27017/TodoApp');
module.exports = mongoose