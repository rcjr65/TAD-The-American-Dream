var restful = require('node-restful');
var mongoose = restful.mongoose;


var voteResultSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  candidacyCode: String,
  candidacyName: String,
  votes: Number
});


module.exports = restful.model('VoteResult', voteResultSchema);