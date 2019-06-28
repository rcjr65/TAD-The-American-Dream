var common = require('./common');
var mongoose = require('mongoose');

/*** models ***/
var taxSchema = require('../models/taxes').taxSchema;
var governorSchema = require('../models/governors').governorSchema;

exports.getGovTax = function(req, res) {
    var Tax = mongoose.model("Tax", taxSchema);

    Tax.findOne({key: 'govTax'}, ['value']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (data == undefined || data == null) {
                return common.send(res, 200, [], 'Empty Data');
            }
            else{
                return common.send(res, 200, data['value'], 'Successs');
            }
        }
    });
}
exports.setGovTax = function(req, res) {
    var Tax = mongoose.model("Tax", taxSchema);
    var Governor = mongoose.model("Governor", governorSchema);

    if (req.body.govTax == undefined) {
        return common.send(res, 401, '', 'govTax is undefined');
    }

    Tax.findOne({key: 'govTax'}, ['value']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (data == undefined || data == null) {
                return common.send(res, 200, [], 'Empty Data');
            }
            else{
                data.value = req.body.govTax;
                data.save(function(err) {
                    if (err)
                        return common.send(res, 400, '', err);
                    else{
                        Governor.updateMany({}, {govTax: req.body.govTax, tadTax: req.body.govTax}, function(err){
                            if(err){
                                return common.send(res, 400, '', err);
                            }
                            else{
                                return common.send(res, 200, '', 'Successs');
                            }
                        })
                    }                        
                });                
            }
        }
    });
}
exports.getTadTax = function(req, res) {
    var Tax = mongoose.model("Tax", taxSchema);

    Tax.findOne({key: 'tadTax'}, ['value']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (data == undefined || data == null) {
                return common.send(res, 200, [], 'Empty Data');
            }
            else{
                return common.send(res, 200, data['value'], 'Successs');
            }
        }
    });
}
exports.setTadTax = function(req, res) {
    var Tax = mongoose.model("Tax", taxSchema);
    var Governor = mongoose.model("Governor", governorSchema);

    if (req.body.tadTax == undefined) {
        return common.send(res, 401, '', 'tadTax is undefined');
    }

    Tax.findOne({key: 'tadTax'}, ['value']).exec(function(err, data) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (data == undefined || data == null) {
                return common.send(res, 200, [], 'Empty Data');
            }
            else{
                data.value = req.body.tadTax;
                data.save(function(err) {
                    if (err)
                        return common.send(res, 400, '', err);
                    else{
                        Governor.updateMany({}, {govTax: req.body.tadTax, tadTax: req.body.tadTax}, function(err){
                            if(err){
                                return common.send(res, 400, '', err);
                            }
                            else{
                                return common.send(res, 200, '', 'Successs');
                            }
                        })
                    }
                });                
            }
        }
    });
}