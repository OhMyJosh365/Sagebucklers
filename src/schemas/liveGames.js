const { Schema, model } = require("mongoose");

const liveGameSchema = new Schema({
    gameData: Array,
    activeMatches: Array,
    _id: Schema.Types.ObjectId
});

module.exports = model("LiveGames", liveGameSchema, "livegames");