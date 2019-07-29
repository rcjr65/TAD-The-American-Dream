var restful = require("node-restful");
var mongoose = restful.mongoose;

var auctionSchema = new mongoose.Schema({
    auctionId: mongoose.Schema.Types.ObjectId,
    itemId: Number,
    itemName: String,
    itemCategory: String,
    minPrice: { type: Number, default: 0 },
    buyPrice: { type: Number, default: 0 },
    bidPrice: { type: Number, default: 0 },
    winnerPrice: { type: Number, default: 0 },
    isBuy: { type: Number, default: 0 }, // 0: default, 1: bought
    ownerGamerCode: String, //coinbase
    ownerName: String, //coinbase
    biderGamerCode: String, //coinbase
    biderName: String, //coinbase
    biderItemId: Number, //coinbase
    expiry: String,
    createdAt: String
});

module.exports = restful.model("Auction", auctionSchema);
