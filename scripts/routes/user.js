var common = require('./common');
var mongoose = require('mongoose');

var userSchema = require('../models/users').userSchema;
var governorSchema = require('../models/governors').governorSchema;

exports.post =  function(req, res) {
    var User = mongoose.model('Users', userSchema);
    var Governor = mongoose.model('Governor', governorSchema);

    if (req.body.name == undefined || req.body.name == '') {
        return common.send(res, 401, '', 'user name is undefined');
    }
    
    if (req.body.code == undefined || req.body.code == '') {
        return common.send(res, 401, '', 'user code is undefined');
    }
    
    if (req.body.gender == undefined || req.body.gender == '') {
        return common.send(res, 401, '', 'user gender is undefined');
    }
    
    // if (req.body.password == undefined || req.body.password == '') {
    //     return common.send(res, 401, '', 'user password is undefined');
    // }
    
    if (req.body.email == undefined || req.body.email == '') {
        return common.send(res, 401, '', 'user email is undefined');
    }
    
    if (req.body.avatar == undefined) {
        return common.send(res, 401, '', 'user avatar is undefined');
    }
    
    if (req.body.state == undefined || req.body.state == '') {
        return common.send(res, 401, '', 'user state is undefined');
    }
    
    if (req.body.groupId == undefined) {
        return common.send(res, 401, '', 'user`s group id is undefined');
    }
    
    if (req.body.groupName == undefined) {
        return common.send(res, 401, '', 'user`s group name is undefined');
    }
    
    User.findOne({ code: req.body.code }, async function ( err, _user){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_user == undefined || _user == null) {
                var model = new User({
                    name: req.body.name,
                    code: req.body.code,
                    gender: req.body.gender,
                    // password: req.body.password,
                    email: req.body.email,
                    avatar: req.body.avatar,
                    state: req.body.state,
                    groupId: req.body.groupId,
                    groupName: req.body.groupName,
                });
                await model.save();
                // return common.send(res, 200, '', 'Success');
            } else {
                _user.name = req.body.name
                _user.code = req.body.code
                _user.gender = req.body.gender
                // _user.password = req.body.password
                _user.email = req.body.email
                _user.avatar = req.body.avatar
                _user.state = req.body.state
                _user.groupId = req.body.groupId
                _user.groupName = req.body.groupName
                await _user.save();
            }

            User.aggregate([
                {
                    $match: {
                        state: req.body.state
                    }
                },
                { $group : { 
                        '_id' : '$groupName',
                        'count': { $sum:  1},
                        'data' : {'$first' : '$$ROOT'}
                    }
                },
                { $sort : {'count' : -1} },
                { $project : { 'groupName':'$data.groupName', 'numbersOfGroup':'$count' } }
            ], function(err, data){
                if(err){
                    return common.send(res, 400, '', err);
                }
                else{
                    if(data.length > 0){
                        var mostPopularGroup = data[0].groupName;
                        var population = 0;
                        data.forEach(element => {
                            population += element.numbersOfGroup;                                
                        });

                        Governor.findOne({ stateCode: req.body.state }, async function ( err, _g){
                            if(err){
                                return common.send(res, 400, '', err);
                            }
                            else{
                                if (_g == undefined || _g == null) {
                                    return common.send(res, 300, '', 'Undefined user.');
                                } else {
                                    _g.population = population;
                                    _g.mostPopularGroup = mostPopularGroup;
                                    await _g.save();
                                    return common.send(res, 200, '', 'Success');                                                                     
                                }
                            }
                        })                            
                    }
                    else{
                        return common.send(res, 200, [], 'Empty Data'); 
                    }                
                }        
            })
        }
    })
};