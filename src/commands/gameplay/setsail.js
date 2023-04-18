const { SlashCommandBuilder } = require('discord.js')
const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');
const mateClasses = require(`../../programs/mateClasses`);
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setsail')
        .setDescription('Set sail to fight others for Treasure!'),
    async execute(interaction, client){

        console.log("EXPLOSION IS GETTING THERE, BUT NEEDS TO BE FINISHED/FIX RADIUS");
        var userProfile = await UserProfile.findOne({userId: interaction.user.id});

        var gameData = {
            "Player1" : {
                "userId": interaction.user.id,
                "Ship": [
                    ["CannonObject", new mateClasses.MateObject()],
                    [null, null],
                    [null, null],
                    [null, null],
                    [null, null],
                    [null, null],
                    [null, null]
                ],
                "PartInventory": [
                    "CannonObject",
                    "CannonObject",
                    "CannonObject"
                ],
                "MateInventory": [
                    new mateClasses.MateObject(),
                    new mateClasses.MateObject(),
                    new mateClasses.MateObject()
                ]
            },
            "Player2" : {
                "userId": null,
                "Ship": [
                    ["CannonObject", new mateClasses.MateObject()],
                    [null, null],
                    ["CannonObject", new mateClasses.MateObject()],
                    [null, null],
                    [null, null],
                    ["CannonObject", new mateClasses.MateObject()],
                    [null, null]
                ]
            }
        };

        let currentGame = await new LiveGames({
            _id: mongoose.Types.ObjectId(),
            gameData: gameData
        });

        userProfile.activeGameID = await currentGame.id;
        await currentGame.save();
        await userProfile.save();

        var file = await require(`../../programs/battlePrep.js`);
        file.prep(interaction, client);
    }
}