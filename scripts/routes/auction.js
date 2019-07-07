var common = require('./common');
var mongoose = require('mongoose');

var auctionSchema = require('../models/auction').auctionSchema;

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
        buyPrice: req.body.buyPrice == undefined ? 0 : req.body.buyPrice,
        ownerGamerCode: req.body.ownerGamerCode,
        ownerName: req.body.ownerName,
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
    Auction.find({bidPrice:0}).sort({'createdAt': 1}).exec(function(err, data){
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
    Auction.find({bidPrice:{$ne: 0}}, ['itemId', 'itemName', 'itemCategory', 'ownerGamerCode', 'ownerName', 'biderGamerCode', 'biderName', 'minPrice', 'bidPrice', 'buyPrice']).sort({'createdAt': 1}).exec(function(err, data){
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
                    Auction.findOne({biderItemId : req.body.auctionId}).exec( function(err, topBidderData){
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
                                    biderItemId: req.body.auctionId,
                                    ownerGamerCode: data.ownerGamerCode,
                                    ownerName: data.ownerName,
                                    minPrice: data.minPrice,
                                    expiry: data.expiry,
                                });
                
                                newAuction.save(function(err, result){
                                    if(err){
                                        return common.send(res, 400, '', err);
                                    }
                                    else{
                                        return common.send(res, 200, '', 'success');
                                    }
                                })
                            }
                            else{
                                if(req.body.bidPrice > topBidderData.bidPrice){
                                    topBidderData.bidPrice = req.body.bidPrice;
                                    topBidderData.biderGamerCode = req.body.biderGamerCode;
                                    topBidderData.biderName = req.body.biderName;
                                    topBidderData.biderItemId = req.body.auctionId;

                                    topBidderData.save(function(err, result){
                                        if(err){
                                            return common.send(res, 400, '', err);
                                        }
                                        else{
                                            return common.send(res, 200, '', 'success');
                                        }
                                    })
                                }
                                else{
                                    return common.send(res, 200, '', 'success');
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

    Auction.deleteOne({ $or:[ {_id: req.body.auctionId}, {biderItemId: req.body.auctionId}]}, function (err) {
        if(err){
            return common.send(res, 400, '', err);
        }
        else{
            return common.send(res, 200, '', 'success');
        }
    });

}