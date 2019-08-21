var restful = require('node-restful');
var mongoose = restful.mongoose;


var dreammachineSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  balance: Number,
});

module.exports = restful.model('DreamMachine', dreammachineSchema);