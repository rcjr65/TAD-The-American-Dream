var restful = require('node-restful');
var mongoose = restful.mongoose;


var userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  code: String, // gamer code
  gender: String, // male, female
  password: String,
  email: String,
  avatar: String,
  state: String,
  groupId: Number,
  groupName: String,
  createdAt: { 
    type: Date, 
    default: function() {
        return Date.now();
    } 
  },
});


module.exports = restful.model('Users',userSchema);
