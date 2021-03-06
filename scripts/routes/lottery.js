var common = require('./common');
var firebase = require('./firebase.js');
var mongoose = require('mongoose');

var ticketSchema = require('../models/tickets').ticketSchema;
var scratcherSchema = require('../models/scratchers').scratcherSchema;
var dreammachineSchema = require('../models/dreammachines').dreammachineSchema;

exports.sendPickData =  function(req, res) {
    var Ticket = mongoose.model('Ticket', ticketSchema);

    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'userName is undefined');
    }
    
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }
    
    if (req.body.numbers == undefined) {
        return common.send(res, 401, '', 'numbers is undefined');
    }

    var curr = new Date(); // get current date
    var days = ((curr.getDay() + 7) - 1) % 7;
    var first = curr.getDate() - days;
    var temp = new Date(curr.getFullYear(), curr.getMonth(), first+1);
    temp.setUTCHours(0, 0, 0, 0);
    var firstDayOfWeek = Math.round(temp.getTime()/1000);
    console.log({temp})
    console.log({firstDayOfWeek})
    console.log({curr})
    console.log(curr.getTime())
    
    Ticket.find({'createdAt':{$lt:firstDayOfWeek}}, ['_id'],function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data.length > 0){
                var temp = [];
                data.forEach(e=>{
                    temp.push(e._id);
                })

                Ticket.deleteMany({ _id: { $in: temp}}, function(err) {
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        saveTicket(Ticket, req, res);
                    }
                })
            }
            else{
                saveTicket(Ticket, req, res);
            }
        }
    })
}

function saveTicket(Ticket, req, res){
    var createAt = Math.round(new Date().getTime()/1000);
    var newTicket = new Ticket({
        userName: req.body.userName,
        userCode: req.body.userCode,
        numbers: JSON.parse(req.body.numbers),
        createdAt: createAt
    });

    newTicket.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, '', 'success');
        }
    })
}

exports.getPickData =  function(req, res) {

    var Ticket = mongoose.model('Ticket', ticketSchema);

    Ticket.find({'winingNumbers':[]}, ['userName', 'userCode', 'numbers'],function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}

exports.setWinnerNumber =  function(req, res) {
    var Ticket = mongoose.model('Ticket', ticketSchema);
    
    if (req.body.winningNumbers == undefined) {
        return common.send(res, 401, '', 'winningNumbers is undefined');
    }
    
    if (req.body.winnerData == undefined) {
        return common.send(res, 401, '', 'winnerData is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newTicket = new Ticket({
        winingNumbers: req.body.winningNumbers,
        winnerData: req.body.winnerData,
        createdAt: createAt
    });

    Ticket.deleteMany({}, function(err) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            newTicket.save(function(err, result){
                if(err){
                    return common.send(res, 400, '', err);
                }
                else{
                    return common.send(res, 200, result, 'success');
                }
            })
        }
    })
}

exports.lastWinningNumber =  function(req, res) {
    var Ticket = mongoose.model('Ticket', ticketSchema);

    Ticket.findOne({'winingNumbers': {$ne:[]}}, ['winingNumbers', 'winnerData', 'createdAt']).sort({'createdAt': -1}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data ==  undefined || data == null) {
                var param = {
                    winingNumbers: [0, 0, 0, 0, 0, 0],
                    _id: '',
                    winnerData: [],
                    createdAt: ''
                }
                return common.send(res, 200, param, 'success');
            }
            else{
                return common.send(res, 200, data, 'success');
            }
        }
    })
}

exports.setScratcherNumber =  function(req, res) {
    var Scratcher = mongoose.model('Scratcher', scratcherSchema);

    if (req.body.winingNumbers == undefined) {
        return common.send(res, 401, '', 'winingNumbers is undefined');
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newScratcher = new Scratcher({
        winingNumbers: req.body.winingNumbers,
        originalWiningNumbers: req.body.winingNumbers,
        isWiningNumber: true,
        createdAt: createAt
    });

    // Scratcher.find({'isWiningNumber':true}, ['_id'],function(err, data){
    //     if(err){
    //         return common.send(res, 400, '', err);
    //     }
    //     else{
    //         if(data != null && data.length > 0){
    //             var temp = [];
    //             data.forEach(e=>{
    //                 temp.push(e._id);
    //             })
    //             Scratcher.deleteMany({ _id: { $in: temp}}, function(err) {
    //                 if(err){
    //                     return common.send(res, 400, '', err);
    //                 }
    //                 else{
    //                     newScratcher.save(function(err, result){
    //                         if(err){
    //                             return common.send(res, 400, '', err);
    //                         }
    //                         else{
    //                             return common.send(res, 200, result, 'success');
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //         else{
    //             newScratcher.save(function(err, result){
    //                 if(err){
    //                     return common.send(res, 400, '', err);
    //                 }
    //                 else{
    //                     return common.send(res, 200, result, 'success');
    //                 }
    //             })
    //         }
    //     }
    // }) 
    Scratcher.deleteMany({}, function(err) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            newScratcher.save(function(err, result){
                if(err){
                    return common.send(res, 400, '', err);
                }
                else{
                    return common.send(res, 200, result, 'success');
                }
            })
        }
    })
}

exports.getScratcherNumber =  function(req, res) {
    var Scratcher = mongoose.model('Scratcher', scratcherSchema);
    Scratcher.findOne({'isWiningNumber': true}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(data ==  undefined || data == null) {
                var param = {
                    originalWiningNumbers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    winingNumbers: [],
                    winnerCount: 0,
                    loserCount: 0,
                }
                return common.send(res, 200, param, 'success');
            }
            else{
                Scratcher.aggregate([
                    {
                        $match: {
                            isWiningNumber: false,
                        }
                    },
                    { $group : { 
                        '_id' : '$isWiningNumber',
                        'count': { $sum:  { $cond:[{$eq:['$isWinner', true]}, 1, 0]}},
                        'count1': { $sum:  { $cond:[{$eq:['$isWinner', false]}, 1, 0]}},
                        'data' : {'$first' : '$$ROOT'}
                    }
                },
                { $sort : {'count' : -1} },
                { $project : { 'winnerCount':'$count', 'loserCount':'$count1'} },
                    
                ], function(err, result){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        if(result != null && result.length > 0){
                            var param = {
                                originalWiningNumbers: data.originalWiningNumbers,
                                winingNumbers: data.winingNumbers,
                                winnerCount: result[0].winnerCount,
                                loserCount: result[0].loserCount,
                            }
                            return common.send(res, 200, param, 'success');
                        }
                        else{
                            var param = {
                                originalWiningNumbers: data.originalWiningNumbers,
                                winingNumbers: data.winingNumbers,
                                winnerCount: 0,
                                loserCount: 0,
                            }
                            return common.send(res, 200, param, 'success');
                        }                
                    }        
                })
            }            
        }
    })
}

exports.sendScratcherWinnerData =  function(req, res) {
    
    var Scratcher = mongoose.model('Scratcher', scratcherSchema);
    
    if (req.body.userName == undefined) {
        return common.send(res, 401, '', 'userName is undefined');
    }
    
    if (req.body.userCode == undefined) {
        return common.send(res, 401, '', 'userCode is undefined');
    }
    
    if (req.body.winingCost == undefined) {
        return common.send(res, 401, '', 'winingCost is undefined');
    }
    
    if (req.body.isWinner == undefined) {
        return common.send(res, 401, '', 'isWinner is undefined');
    }

    if(req.body.isWinner == 'true' && parseFloat(req.body.winingCost) == 0){
        return common.send(res, 401, '', "The winning cost can't be 0.");
    }

    if( req.body.isWinner != 'true' && parseFloat(req.body.winingCost) > 0 ){
        return common.send(res, 401, '', "The loser has no winning cost more than 0");            
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newScratcher = new Scratcher({
        userName: req.body.userName,
        userCode: req.body.userCode,
        winingCost: parseFloat(req.body.winingCost),
        isWinner: req.body.isWinner,
        isWiningNumber: false,
        createdAt: createAt
    });
    
    if(req.body.isWinner == 'true'){
        Scratcher.findOne({'isWiningNumber':true}, []).exec(function(err, data){
            if(err){
                return common.send(res, 400, '', err);
            }
            else{
                if(data == null || data == undefined){
                    return common.send(res, 300, '', 'There is no winning numbers');
                }
                else{
                    var winingNumbers = data.winingNumbers;
                    var index = winingNumbers.indexOf(parseFloat(req.body.winingCost))
                    if(index > -1)
                        winingNumbers.splice(index, 1)
                    else
                        return common.send(res, 300, '', 'Incorrect winning number');

                    data.winingNumbers = winingNumbers;
                    data.save(function(err, result){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            newScratcher.save(function(err, result){
                                if(err){
                                    return common.send(res, 400, '', err);
                                }
                                else{
                                    return common.send(res, 200, '', 'success');
                                }
                            })
                        }
                    })

                }                        
            }
        })
    }
    else{
        newScratcher.save(function(err, result){
            if(err){
                return common.send(res, 400, '', err);
            }
            else{
                return common.send(res, 200, '', 'success');
            }
        })
    }
}

exports.getScratcherWinnerData =  function(req, res) {
    var Scratcher = mongoose.model('Scratcher', scratcherSchema);
    Scratcher.find({'isWiningNumber': false, 'isWinner': true}, ['userName', 'userCode', 'winingCost']).sort({'createdAt': -1}).limit(100).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })
}

exports.getDreamBankBalance =  function(req, res) {
    // var ref = firebase.db.ref("/DreamSlot/Cash");
    // ref.once("value", function(snapshot) {
    //     return common.send(res, 200, snapshot.val(), 'success');
    // }, function (errorObject) {
    //     return common.send(res, 400, '', errorObject.code);
    // });
    var DreamMachine = mongoose.model("DreamMachine", dreammachineSchema);
    DreamMachine.findOne({}, async function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            var params = {}
            if (data == "undefined" || data == null) {
                var nDreamMachine = new DreamMachine({
                    balance: 0
                });
                await nDreamMachine.save();
                params = {
                    id : nDreamMachine._id,
                    balance: 0
                }
            } else {
                params = {
                    id : data._id,
                    balance: data.balance
                }
            }
            return common.send(res, 200, params, 'success');
        }
    });
}

exports.updateDreamBankBalance =  function(req, res) {
    
    var DreamMachine = mongoose.model("DreamMachine", dreammachineSchema);

    if (req.body.balance == undefined) {
        return common.send(res, 401, '', 'balance is undefined');
    }

    if (req.body.id == undefined) {
        return common.send(res, 401, '', 'id is undefined');
    }
    
    DreamMachine.findOne({ _id: req.body.id }, async function(err, _dreamMachine) {
        if(!err){
            if (_dreamMachine == "undefined" || _dreamMachine == null) {
                var nDreamMachine = new DreamMachine({
                    balance: req.body.balance
                });
                await nDreamMachine.save();
                var params = {
                    id : nDreamMachine._id,
                    balance: parseFloat(nDreamMachine.balance)
                }
                return common.send(res, 200, params, 'Success');
            } else {
                _dreamMachine.balance = req.body.balance;
                await _dreamMachine.save();
                var params = {
                    id : _dreamMachine._id,
                    balance: parseFloat(_dreamMachine.balance)
                }
                return common.send(res, 200, params, 'Success');
            }            
        }
        else{
            return common.send(res, 300, '', err);
        }
    });

    // var ref = firebase.db.ref("/DreamSlot");
    // ref.set({ Cash : parseFloat(req.body.balance)}, function (error) {
    //     if (error) {
    //         // The write failed...
    //         return common.send(res, 400, '', error.code);
    //     } else {
    //         return common.send(res, 200, '', 'success');
    //     }
    // });
}

exports.addDreamBankBalance =  function(req, res) {
    
    var DreamMachine = mongoose.model("DreamMachine", dreammachineSchema);

    if (req.body.id == undefined) {
        return common.send(res, 401, '', 'id is undefined');
    }
    
    if (req.body.delta == undefined) {
        return common.send(res, 401, '', 'delta is undefined');
    }

    DreamMachine.findOne({ _id: req.body.id }, async function(err, _dreamMachine) {
        if(!err){
            if (_dreamMachine == "undefined" || _dreamMachine == null) {
                var nDreamMachine = new DreamMachine({
                    balance: req.body.delta
                });
                await nDreamMachine.save();
                var params = {
                    id : nDreamMachine._id,
                    balance: parseFloat(nDreamMachine.balance)
                }
                return common.send(res, 200, params, 'Success');
            } else {
                _dreamMachine.balance += parseFloat(req.body.delta);
                await _dreamMachine.save();
                var params = {
                    id : _dreamMachine._id,
                    balance: parseFloat(_dreamMachine.balance)
                }
                return common.send(res, 200, params, 'Success');
            }            
        }
        else{
            return common.send(res, 300, '', err);
        }
    });

    // var ref = firebase.db.ref("/DreamSlot");
    // ref.set({ Cash : parseFloat(req.body.balance)}, function (error) {
    //     if (error) {
    //         // The write failed...
    //         return common.send(res, 400, '', error.code);
    //     } else {
    //         return common.send(res, 200, '', 'success');
    //     }
    // });
}