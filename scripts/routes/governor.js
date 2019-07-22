var common = require('./common');
var mongoose = require('mongoose');
var constants = require('../../src/constant_backend');

var governorSchema = require('../models/governors').governorSchema;
var voteResultSchema = require('../models/voteResult').voteResultSchema;
var taxSchema = require('../models/taxes').taxSchema;

exports.all = function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    var Tax = mongoose.model("Tax", taxSchema);

    Governor.find({}).sort({state: 1}).exec( function ( err, _data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(_data.length > 0){
                return common.send(res, 200, _data, 'Success');
            }
            else{
                var saveData=[]
                
                Tax.find({}).exec( function ( err, _tax){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if (_tax == undefined || _tax == null) {
                            return common.send(res, 200, [], 'Empty Data');
                        }
                        else{
                            var govTax = 0;
                            var tadTax = 0;
                            
                            _tax.forEach(element => {
                                if(element.key == 'govTax'){
                                    govTax = element.value
                                }
                                else {
                                    tadTax = element.value
                                }
                            });

                            for(let x = 0; x < 50; x++){
                                saveData.push({
                                    userName:'', 
                                    userCode: '', 
                                    state:constants.states[x].name,
                                    stateCode:constants.states[x].code,
                                    govTax,
                                    tadTax,
                                    population: 0,
                                    mostPopularGroup: '',
                                })
                            }
                            // console.log({saveData});
                            Governor.collection.insertMany(saveData, function (err, response) {
                                if (err){ 
                                    return common.send(res, 400, '', err);
                                } else {
                                    return common.send(res, 200, response.ops, 'Success');
                                }
                            });
                        }
                    }
                });                
            }   
        }
    });   
}

exports.update = function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);
    var VoteResult = mongoose.model("VoteResult", voteResultSchema);

    if (req.body.id == undefined) {
        return common.send(res, 401, '', 'Id is undefined');
    }
    
    if (req.body.govTax == undefined || req.body.govTax == 0) {
        return common.send(res, 401, '', 'govTax is undefined or empty');
    }

    if (req.body.tadTax == undefined || req.body.tadTax == 0) {
        return common.send(res, 401, '', 'tadTax is undefined or empty');
    }

    if (req.body.isNew == undefined) {
        return common.send(res, 401, '', 'isNew is undefined or empty');
    }

    if (req.body.isNew) {
        if (req.body.userCode == undefined || req.body.userCode == '') {
            return common.send(res, 401, '', 'userCode is undefined or empty');
        }
    }
    else {
        if (req.body.userName == undefined || req.body.userName == '') {
            return common.send(res, 401, '', 'userName is undefined or empty');
        }
    }

    if(req.body.isNew){
        VoteResult.findOne({ candidacyCode: req.body.userCode }, ['candidacyName'], async function(err, _vote) {
            if(err){
                return common.send(res, 400, '', err);
            }
            else{
                
                if (_vote == undefined || _vote == null) {
                    return common.send(res, 300, '', "This user didn't get any votes.");
                }
                else{
                    
                    Governor.findOne({ userCode: req.body.userCode }, async function ( err, _governor){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            if(_governor == undefined || _governor == null){
                                Governor.findOne({ _id: req.body.id }, async function ( err, _g){
                                    if(err){
                                        return common.send(res, 400, '', err);
                                    }
                                    else{
                                        if (_g == undefined || _g == null) {
                                            return common.send(res, 300, '', 'Undefined user.');
                                        } else {
                                            _g.userName = _vote.candidacyName;
                                            _g.userCode = req.body.userCode;
                                            _g.govTax = req.body.govTax;
                                            _g.tadTax = req.body.tadTax;
                                            await _g.save();
                                            Governor.find({}).sort({state: 1}).exec( function(err, result) {
                                                if(err){
                                                    return common.send(res, 400, '', err);
                                                }
                                                else{
                                                    if(result.length > 0){
                                                        return common.send(res, 200, result, 'Success');
                                                    }
                                                    else{
                                                        return common.send(res, 400, '', 'server error');
                                                    }
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                            else{
                                return common.send(res, 300, '', 'Governor exists.');
                            }
                        }
                    })
                    
                }
            }
        });
    }
    else{
        Governor.findOne({ userName: req.body.userName }, async function ( err, _governor){
            if(err){
                return common.send(res, 400, '', err);
            }
            else{
                if(_governor == undefined || _governor == null){
                    Governor.findOne({ _id: req.body.id }, async function ( err, _g){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            if (_g == undefined || _g == null) {
                                return common.send(res, 300, '', 'Undefined user.');
                            } else {
                                if(_g.userCode){
                                    _g.userName = req.body.userName;
                                    _g.govTax = req.body.govTax;
                                    _g.tadTax = req.body.tadTax;
                                    await _g.save();
                                    Governor.find({}).sort({state: 1}).exec( function(err, result) {
                                        if(err){
                                            return common.send(res, 400, '', err);
                                        }
                                        else{
                                            if(result.length > 0){
                                                return common.send(res, 200, result, 'Success');
                                            }
                                            else{
                                                return common.send(res, 400, '', 'server error');
                                            }
                                        }
                                    });
                                }
                                else{
                                    return common.send(res, 300, '', 'User Code is empty.');
                                }                            
                            }
                        }
                    })
                }
                else{
                    return common.send(res, 300, '', 'Governor Name exists.');
                }
            }
        });
    }    
}

exports.updateTax = function(req, res) {
    var Governor = mongoose.model("Governor", governorSchema);

    if (req.body.id == undefined) {
        return common.send(res, 401, '', 'Id is undefined');
    }

    if (req.body.govTax == undefined || req.body.govTax == 0) {
        return common.send(res, 401, '', 'govTax is undefined or empty');
    }

    if (req.body.tadTax == undefined || req.body.tadTax == 0) {
        return common.send(res, 401, '', 'tadTax is undefined or empty');
    }

    Governor.findOne({ _id: req.body.id }, async function ( err, _g){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (_g == undefined || _g == null) {
                return common.send(res, 300, '', 'Undefined user.');
            } else {
                _g.govTax = req.body.govTax;
                _g.tadTax = req.body.tadTax;
                await _g.save();
                Governor.find({}).sort({state: 1}).exec( function(err, result) {
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if(result.length > 0){
                            return common.send(res, 200, result, 'Success');
                        }
                        else{
                            return common.send(res, 400, '', 'server error');
                        }
                    }
                });
            }
        }
    })
}