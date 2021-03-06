var common = require('./common');
var mongoose = require('mongoose');

var auctionSchema = require('../models/auction').auctionSchema;
var itemSchema = require('../models/items').itemSchema;
var trackSchema = require('../models/tracks').trackSchema;

exports.post =  function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    
    if (req.body.itemId == undefined) {
        return common.send(res, 401, '', 'itemId is undefined');
    }

    if (req.body.itemName == undefined) {
        return common.send(res, 401, '', 'itemName is undefined');
    }

    if (req.body.itemCategory == undefined) {
        return common.send(res, 401, '', 'itemCategory is undefined');
    }

    if (req.body.minPrice == undefined) {
        return common.send(res, 401, '', 'minPrice is undefined');
    }

    if (req.body.ownerGamerCode == undefined) {
        return common.send(res, 401, '', 'ownerGamerCode is undefined');
    }
    
    if (req.body.ownerName == undefined) {
        return common.send(res, 401, '', 'ownerName is undefined');
    }
    
    var createAt = Math.round(new Date().getTime()/1000);
    var expiry = parseInt(createAt, 10) + parseInt(24*60*60, 10);
    var newAuction = new Auction({
        itemId: req.body.itemId,
        itemName: req.body.itemName,
        itemCategory: req.body.itemCategory,
        minPrice: req.body.minPrice,
        bidPrice: 0,
        oFlag: 0,
        bFlag: 0,
        buyPrice: req.body.buyPrice == undefined ? 0 : req.body.buyPrice,
        ownerGamerCode: req.body.ownerGamerCode,
        ownerName: req.body.ownerName,
        biderName: '',
        biderGamerCode: '',
        biderItemId: '',
        createdAt: createAt,
        expiry: expiry,
    });

    newAuction.save(function(err, result){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, {auctionId: result._id}, 'success');
        }
    })
};

exports.get =  function(req, res) {
    var Auction = mongoose.model('Auction', auctionSchema);
    var createAt = Math.round(new Date().getTime()/1000);
    Auction.find({bidPrice:0, expiry: {$gt: createAt}}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'minPrice', 'bidPrice', 'buyPrice', 'createdAt', 'expiry']).sort({'createdAt': 1}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    }); 
}

exports.result =  function(req, res) {
    var Auction = mongoose.model('Auction', auctionSchema);
    var createAt = Math.round(new Date().getTime()/1000);
    Auction.find({$or: [{bidPrice:{$ne: 0}}, {expiry: {$lt: createAt}, bidPrice: 0}]}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'biderGamerCode', 'biderName', 'minPrice', 'bidPrice', 'buyPrice', 'oFlag', 'bFlag']).sort({'createdAt': 1}).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    }); 
    /**
    Auction.aggregate([
        {
            $match: {
                bidPrice: {$ne: 0}
            }
        },
        { $sort : {"bidPrice" : -1} },
        { $group : { 
                "_id" : "$biderItemId",
                "data" : {"$first" : "$$ROOT"},
            }
        },
        { $project : { 
            "itemName":"$data.itemName", 
            "itemCategory":"$data.itemCategory", 
            "ownerGamerCode":"$data.ownerGamerCode", 
            "ownerName":"$data.ownerName", 
            "biderGamerCode":"$data.biderGamerCode", 
            "biderName":"$data.biderName", 
            "minPrice":"$data.minPrice", 
            // "expiry":"$data.expiry", 
            "bidPrice": "$data.bidPrice" 
        }}
    ], function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, data, 'success');
        }
    })  **/
}

exports.bid =  function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    var createAt = Math.round(new Date().getTime()/1000);
    if (req.body.bidPrice == undefined) {
        return common.send(res, 401, '', 'bidPrice is undefined');
    }

    if (req.body.biderGamerCode == undefined) {
        return common.send(res, 401, '', 'ownerGamerCode is undefined');
    }

    if (req.body.biderName == undefined) {
        return common.send(res, 401, '', 'biderName is undefined');
    }
    
    if (req.body.auctionId == undefined) {
        return common.send(res, 401, '', 'auctionId is undefined');
    }

    Auction.findOne({_id : req.body.auctionId}, ['itemId', 'itemName', 'itemCategory', 'expiry', 'ownerGamerCode', 'ownerName', 'minPrice', 'buyPrice']).exec(function(err, data){
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            if (data == undefined || data == null) {
                return common.send(res, 300, '', 'No exists.');
            }
            else{
                var createAt = Math.round(new Date().getTime()/1000);
                var expiredTime = parseInt(data.expiry, 10);
                if( createAt < expiredTime){
                    
                    Auction.findOne({biderItemId : req.body.auctionId.toString()}).exec( function(err, topBidderData){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            if (topBidderData == undefined || topBidderData == null) {
                                var newAuction = new Auction({
                                    itemId: data.itemId,
                                    itemName: data.itemName,
                                    itemCategory: data.itemCategory,
                                    bidPrice: req.body.bidPrice,
                                    biderName: req.body.biderName,
                                    buyPrice: data.buyPrice,
                                    biderGamerCode: req.body.biderGamerCode,
                                    biderItemId: req.body.auctionId.toString(),
                                    ownerGamerCode: data.ownerGamerCode,
                                    ownerName: data.ownerName,
                                    minPrice: data.minPrice,
                                    oFlag: 0,
                                    bFlag: 0,
                                    expiry: data.expiry,
                                });
                
                                newAuction.save(function(err, result){
                                    if(err){
                                        return common.send(res, 400, '', err);
                                    }
                                    else{
                                        // return common.send(res, 200, '', 'success');

                                        Auction.find({$or: [{bidPrice:{$ne: 0}}, {expiry: {$lt: createAt}, bidPrice: 0}]}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'biderGamerCode', 'biderName', 'minPrice', 'bidPrice', 'buyPrice', 'oFlag', 'bFlag']).sort({'createdAt': 1}).exec(function(_err, _data){
                                            if(_err){
                                                return common.send(res, 400, '', err);
                                            }
                                            else{
                                                return common.send(res, 200, _data, 'success');
                                            }
                                        }); 
                                    }
                                })
                            }
                            else{
                                if(req.body.bidPrice > topBidderData.bidPrice){
                                    topBidderData.bidPrice = req.body.bidPrice;
                                    topBidderData.biderGamerCode = req.body.biderGamerCode;
                                    topBidderData.biderName = req.body.biderName;
                                    topBidderData.biderItemId = req.body.auctionId.toString();

                                    topBidderData.save(function(err, result){
                                        if(err){
                                            return common.send(res, 400, '', err);
                                        }
                                        else{
                                            // return common.send(res, 200, '', 'success');
                                            Auction.find({$or: [{bidPrice:{$ne: 0}}, {expiry: {$lt: createAt}, bidPrice: 0}]}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'biderGamerCode', 'biderName', 'minPrice', 'bidPrice', 'buyPrice', 'oFlag', 'bFlag']).sort({'createdAt': 1}).exec(function(_err, _data){
                                                if(_err){
                                                    return common.send(res, 400, '', err);
                                                }
                                                else{
                                                    return common.send(res, 200, _data, 'success');
                                                }
                                            }); 
                                        }
                                    })
                                }
                                else{
                                    // return common.send(res, 200, '', 'success');
                                    Auction.find({$or: [{bidPrice:{$ne: 0}}, {expiry: {$lt: createAt}, bidPrice: 0}]}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'biderGamerCode', 'biderName', 'minPrice', 'bidPrice', 'buyPrice', 'oFlag', 'bFlag']).sort({'createdAt': 1}).exec(function(_err, _data){
                                        if(_err){
                                            return common.send(res, 400, '', err);
                                        }
                                        else{
                                            return common.send(res, 200, _data, 'success');
                                        }
                                    }); 
                                }                                
                            }
                        }
                    })
                }
                else{
                    return common.send(res, 300, '', 'Auction time was expired');    
                }
            }
        }
    })    
};

exports.delete =  function(req, res) {
    var Auction = mongoose.model("Auction", auctionSchema);
    
    if (req.body.auctionId == undefined) {
        return common.send(res, 401, '', 'auctionId is undefined');
    }

    if (req.body.isOwner == undefined) { // 0 : owner , 1: bidder
        return common.send(res, 401, '', 'isOwner is undefined');
    }

    Auction.findOne({_id: req.body.auctionId}).exec(function(auctionErr, auctionData){
        if(auctionErr){
            return common.send(res, 400, '', auctionErr);
        }
        else{
            if (auctionData == undefined || auctionData == null) {
                return common.send(res, 300, '', 'No exists.');
            }
            else{
                if((req.body.isOwner == 0 && auctionData.bFlag == 1) || (req.body.isOwner == 1 && auctionData.oFlag == 1)){
                    Auction.deleteOne({ $or:[ {_id: req.body.auctionId}, {biderItemId: req.body.auctionId}]}, function (err) {
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            return common.send(res, 200, '', 'success');
                        }
                    });
                }
                else if(req.body.isOwner == 0 && auctionData.bFlag == 0){
                    auctionData.oFlag = 1;

                    auctionData.save(function(err, result){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            return common.send(res, 200, '', 'success');
                        }
                    })
                }
                else {
                    auctionData.bFlag = 1;

                    auctionData.save(function(err, result){
                        if(err){
                            return common.send(res, 400, '', err);
                        }
                        else{
                            return common.send(res, 200, '', 'success');
                        }
                    })
                }
            }
        }
    })
}

exports.buy =  function(req, res) {
    var Item = mongoose.model("Items", itemSchema);
    var Track = mongoose.model("Tracks", trackSchema);
    var Auction = mongoose.model("Auction", auctionSchema);

    if (req.body.auctionId == undefined) {
        return common.send(res, 401, '', 'auction id is undefined');
    }

    if (req.body.itemId == undefined) {
        return common.send(res, 401, '', 'item id is undefined');
    }

    if (req.body.itemName == undefined) {
        return common.send(res, 401, '', 'itemName is undefined');
    }

    if (req.body.itemCategory == undefined) {
        return common.send(res, 401, '', 'itemCategory is undefined');
    }

    if (req.body.price == undefined) {
        return common.send(res, 401, '', 'price is undefined');
    }

    if (req.body.quantity == undefined) {
        return common.send(res, 401, '', 'quantity is undefined');
    }
    
    if (req.body.ownerName == undefined) {
        return common.send(res, 401, '', 'gamer name is undefined');
    }
    
    if (req.body.ownerGamerCode == undefined) {
        return common.send(res, 401, '', 'gamer code is undefined');
    }
    
    if (req.body.isTSR == undefined) {
        return common.send(res, 401, '', 'isTSR is undefined');
    }
    
    var createAt = Math.round(new Date().getTime()/1000);
                
    var newTrack = new Track({
        itemId: req.body.itemId,
        itemName: req.body.itemName,
        itemCategory: req.body.itemCategory,
        price: req.body.price,
        quantity: req.body.quantity,
        ownerName: req.body.ownerName,
        ownerGamerCode: req.body.ownerGamerCode,
        isTSR: req.body.isTSR,
        createdAt: createAt
    });

    
    Auction.findOne({_id: req.body.auctionId}).exec(function(auctionErr, auctionData){
        if(auctionErr){
            return common.send(res, 400, '', auctionErr);
        }
        else{
            if (auctionData == undefined || auctionData == null) {
                return common.send(res, 300, '', 'No exists.');
            }
            else{
                auctionData.bidPrice = req.body.price;
                auctionData.biderName = req.body.ownerName;
                auctionData.biderGamerCode = req.body.ownerGamerCode;
                auctionData.save(function(err, result){
                    if(err){
                        return common.send(res, 400, '', err);
                    }
                    else{
                        newTrack.save(function(err, result){
                            if(err){
                                return common.send(res, 400, '', err);
                            }
                            else{
                                return common.send(res, 200, '', 'success');
                            }
                        });
                    }
                })
            }
        }
    });
}