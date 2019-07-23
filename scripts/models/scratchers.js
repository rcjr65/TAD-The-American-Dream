var restful = require('node-restful');
var mongoose = restful.mongoose;


var scratcherSchema = new mongoose.Schema({
  someId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String,
  originalWiningNumbers: [],
  winingNumbers: [],
  winingCost: Number,
  isWinner: Boolean,
  isWiningNumber: Boolean,
  createdAt: String,
});


module.exports = restful.model('Scratcher',scratcherSchema);
