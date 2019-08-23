
var common = require('./common');
var mongoose = require('mongoose');

/*** models ***/
var voteSchema = require('../models/votes').voteSchema;
var voteResultSchema = require('../models/voteResult').voteResultSchema;
var governorSchema = require('../models/governors').governorSchema;
var electionSchema = require('../models/elections').electionSchema;

exports.vote = function(req, res) {
    var Votes = mongoose.model("Votes", voteSchema);
    var VoteResult = mongoose.model("VoteResult", voteResultSchema);

    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'Username is undefined');
    }
    
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }

    if (req.body.candidacyCode == undefined) {
        return common.send(res, 401, '', 'CandidacyCode is undefined');
    }
    
    if (req.body.candidacyName == undefined) {
        return common.send(res, 401, '', 'candidacyName is undefined');
    }
    
    Votes.findOne({ userCode: req.body.userCode.toUpperCase() }, async function ( err, _vote){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_vote == undefined || _vote == null) {
                var model = new Votes({
                    userName: req.body.userName,
                    userCode: req.body.userCode.toUpperCase(),
                    candidacyCode: req.body.candidacyCode.toUpperCase(),
                    candidacyName: req.body.candidacyName,
                });
                await model.save();
                
                VoteResult.findOne({ candidacyCode: req.body.candidacyCode.toUpperCase() }, async function ( err, _voteResult){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if (_voteResult == undefined || _voteResult == null) {
                            var _model = new VoteResult({
                                candidacyCode: req.body.candidacyCode.toUpperCase(),
                                candidacyName: req.body.candidacyName,
                                votes: 1
                            });
                            await _model.save();
                        }
                        else {
                            _voteResult.votes = parseInt(_voteResult.votes) + 1;
                            await _voteResult.save();
                        }
                        return common.send(res, 200, '', 'Success');
                    }
                })              
            } else {
                return common.send(res, 300, '', 'Already exists.');
            }
        }
    })
}

exports.result = function(req, res) {

    var VoteResult = mongoose.model("VoteResult", voteResultSchema);
    VoteResult.find({"votes":{$ne:0}}).sort({'votes': -1}).limit(50).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    });
    // var Votes = mongoose.model("Votes", voteSchema);
    
    // Votes.aggregate([
    //     { $group : { 
    //             "_id" : "$candidacyCode",
    //             "count": { $sum: 1 },
    //             "data" : {"$first" : "$$ROOT"}
    //         }
    //     },
    //     { $sort : {"count" : -1} },
    //     { $limit: 70 },
    //     { $project : { "candidacyCode" : "$_id", "candidacyName":"$data.candidacyName", "numbersOfVotes":"$count" } }
    // ], function(err, data){
    //     if(err){
    //         return common.send(res, 400, '', err);
    //     }
    //     else{
    //         if(data.length > 0){
                
    //             return common.send(res, 200, data, 'Success'); 
    //         }
    //         else{
    //             return common.send(res, 200, [], 'Empty Data'); 
    //         }
    //     }
    // })
}

exports.setPeriod = function(req, res){
    var Elections = mongoose.model("Elections", electionSchema);
    var Votes = mongoose.model("Votes", voteSchema);
    var VoteResult = mongoose.model("VoteResult", voteResultSchema);

    if (req.body.startTime == undefined || req.body.startTime == '') {
        return common.send(res, 401, '', 'startTime is undefined');
    }

    if (req.body.endTime == undefined || req.body.endTime == '') {
        return common.send(res, 401, '', 'endTime is undefined');
    }
    
    Elections.deleteMany({}, function(err){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            Votes.deleteMany({}, function(err){
                if(err){
                    return common.send(res, 400, '', err);
                }
                else{
                    VoteResult.deleteMany({}, function(err){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            var _temp = {};
                            _temp.startTime = Math.floor(new Date(req.body.startTime).getTime()/1000);
                            _temp.endTime = Math.floor(new Date(req.body.endTime).getTime()/1000);
                            
                            Elections.insertMany(_temp, function (err, data) {
                                if (err){ 
                                    return common.send(res, 400, '', err);
                                } else {                    
                                    return common.send(res, 200, data, 'Success');
                                }
                            });
                        }
                    })
                }
            });
        }
    });
}

exports.getPeriod = function(req, res){
    var Elections = mongoose.model("Elections", electionSchema);

    Elections.find({}, ['startTime', 'endTime']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                return common.send(res, 200, data, 'Successs');                
            }
            else{
                return common.send(res, 200, [], 'Empty Data');
            }
        }
    });
}

exports.edit = function(req, res) {

    var VoteResult = mongoose.model("VoteResult", voteResultSchema);
    
    if (req.body.votes == undefined) {
        return common.send(res, 401, '', 'Vote Number is undefined');
    }

    if (req.body.candidacyCode == undefined) {
        return common.send(res, 401, '', 'candidacyCode is undefined');
    }
    
    if (req.body.candidacyName == undefined) {
        return common.send(res, 401, '', 'candidacyName is undefined');
    }

    VoteResult.findOne({ candidacyCode: req.body.candidacyCode.toUpperCase() }, async function ( err, _voteResult){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_voteResult == undefined || _voteResult == null) {
                
                var _model = new VoteResult({
                    candidacyCode: req.body.candidacyCode.toUpperCase(),
                    candidacyName: req.body.candidacyName,
                    votes: req.body.votes
                });
                await _model.save();
                return common.send(res, 200, _model, 'Success');
            }
            else {
                _voteResult.votes = req.body.votes;
                await _voteResult.save();
                return common.send(res, 200, _voteResult, 'Success');
            }
        }
    })
}

exports.add = function(req, res) {

    var VoteResult = mongoose.model("VoteResult", voteResultSchema);
    
    if (req.body.votes == undefined) {
        return common.send(res, 401, '', 'Vote Number is undefined');
    }

    if (req.body.candidacyCode == undefined) {
        return common.send(res, 401, '', 'candidacyCode is undefined');
    }
    
    if (req.body.candidacyName == undefined) {
        return common.send(res, 401, '', 'candidacyName is undefined');
    }

    VoteResult.findOne({ candidacyCode: req.body.candidacyCode.toUpperCase() }, async function ( err, _voteResult){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_voteResult == undefined || _voteResult == null) {
                
                var _model = new VoteResult({
                    candidacyCode: req.body.candidacyCode.toUpperCase(),
                    candidacyName: req.body.candidacyName,
                    votes: parseInt(req.body.votes)
                });
                await _model.save();
                return common.send(res, 200, _model, 'Success');
            }
            else {
                _voteResult.votes += parseInt(req.body.votes);
                await _voteResult.save();
                return common.send(res, 200, _voteResult, 'Success');
            }
        }
    })
}