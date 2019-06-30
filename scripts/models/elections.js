var restful = require('node-restful');
var mongoose = restful.mongoose;


var electionSchema = new mongoose.Schema({
  electionId: mongoose.Schema.Types.ObjectId, // foreign key with votes
  startTime:  Number, 
  endTime: Number,
});


module.exports = restful.model('Elections',electionSchema);