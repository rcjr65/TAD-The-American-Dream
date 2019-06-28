var restful = require('node-restful');
var mongoose = restful.mongoose;


var governorSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userName: String,
  userCode: String,
  state: String,
  stateCode: String,
  govTax: Number,
  tadTax: Number,
  population: Number,
  mostPopularGroup: String,
  isGovernor: { type: Boolean, default: false }
});


module.exports = restful.model('Governor', governorSchema);
