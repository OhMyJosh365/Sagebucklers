const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    activeGameID: Object,
    userStats: Array,
    username: String,
    userId: String
});

module.exports = model("UserProfile", userProfileSchema, "userprofile");