const { SlashCommandBuilder } = require('discord.js')
const UserProfile = require('../schemas/userProfile');
const LiveGames = require('../schemas/liveGames');
const mateClasses = require(`../programs/mateClasses`);
const mongoose = require("mongoose");

async function beginGame(interaction, client, gameID){

        var userProfile = await UserProfile.findOne({userId: interaction.user.id});
        var currentGame = await LiveGames.findById(gameID);
        var oldGameData = currentGame.gameData[0];

        currentGame.gameData[0] = {};
        var gameData = {};
        var playerIndex = 1;

        for(var i = 0; i < oldGameData.ActiveMessages.length; i++){
            if(oldGameData.ActiveMessages[i][2] == "Host" || oldGameData.ActiveMessages[i][2] == "Pending" || oldGameData.ActiveMessages[i][2] == "Guest"){
                gameData[`Player${playerIndex++}`] = {
                    "userId": oldGameData.ActiveMessages[i][0],
                    "Ship": [
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null]
                    ],
                    "PartInventory": [
                        "CannonObject"
                    ],
                    "MateInventory": [
                        new mateClasses.MateObject(),
                    ],
                    "ShipConditions" : [],
                    "MessageInfo" : oldGameData.ActiveMessages[i]
                }
            }
        }

        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : gameData
            });

        for(var i = 0; i < gameData.length; i++){
            await require(`../programs/battlePrep`).prep(interaction, client, currentGame.id, i+1);
        }
}

module.exports = {beginGame}