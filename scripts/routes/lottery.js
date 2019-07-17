var common = require('./common');
var mongoose = require('mongoose');

var ticketSchema = require('../models/tickets').ticketSchema;
var scratcherSchema = require('../models/scratchers').scratcherSchema;

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

    newTicket.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, result, 'success');
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

    if(req.body.isWinner == true && (req.body.winingCost == 0 || req.body.winingCost == '' || req.body.winingCost == '0')){
        return common.send(res, 401, '', "The winning cost can't be 0.");
    }

    if(req.body.isWinner == false && req.body.winingCost > 0){
        return common.send(res, 401, '', "The loser has no winning cost");
    }

    var createAt = Math.round(new Date().getTime()/1000);
    var newScratcher = new Scratcher({
        userName: req.body.userName,
        userCode: req.body.userCode,
        winingCost: req.body.winingCost,
        isWinner: req.body.isWinner,
        isWiningNumber: false,
        createdAt: createAt
    });
    
    newScratcher.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if(req.body.isWinner ==  true){
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
                            var index = winingNumbers.indexOf(req.body.winingCost)
                            if(index > -1)
                                winingNumbers.splice(index, 1)
                            
                            data.winingNumbers = winingNumbers;
                            data.save(function(err, result){
                                if(err){
                                    return common.send(res, 400, '', err);
                                }
                                else{
                                    return common.send(res, 200, '', 'success');
                                }
                            })

                        }                        
                    }
                })
            }
            else{
                return common.send(res, 200, '', 'success');
            }
        }
    })
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