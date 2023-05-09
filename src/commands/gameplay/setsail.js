const { SlashCommandBuilder } = require('discord.js')
const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');
const mateClasses = require(`../../programs/mateClasses`);
const mongoose = require("mongoose");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setsail')
        .setDescription('Create a Lobby for People to Join your Adventure!'),
    async execute(interaction, client){

        var userProfile = await UserProfile.findOne({userId: interaction.user.id});

        var gameData = {
            "Users" : [`${interaction.user.username}`],
            "LobbySize" : 2,
            "NumPlayers" : 1,
            "ActiveMessages" : [client.lastMessage]
        };

        let currentGame = await new LiveGames({
            _id: mongoose.Types.ObjectId(),
            gameData: gameData
        });

        userProfile.activeGameID = await currentGame.id;
        interaction.editReply({content: "Loading..."});

        const dmChannel = await interaction.user.createDM();
        const message = await dmChannel.send({content: "Loading..."});
        gameData.ActiveMessages.push([interaction.user.id, message.id, "Host"])

        await require(`../../programs/battlePrep`).editAllEmbeds(gameData, interaction, client, currentGame);
        await currentGame.save();
        await userProfile.save();
    }
}
// const { SlashCommandBuilder } = require('discord.js')
// const UserProfile = require('../../schemas/userProfile');
// const LiveGames = require('../../schemas/liveGames');
// const mateClasses = require(`../../programs/mateClasses`);
// const mongoose = require("mongoose");

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('setsail')
//         .setDescription('Set sail to fight others for Treasure!'),
//     async execute(interaction, client){

//         var userProfile = await UserProfile.findOne({userId: interaction.user.id});

//         var gameData = {
//             "Player1" : {
//                 "userId": interaction.user.id,
//                 "Ship": [
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     [null, null]
//                 ],
//                 "PartInventory": [
//                     "CannonObject",
//                     "CannonObject",
//                     "CannonObject"
//                 ],
//                 "MateInventory": [
//                     new mateClasses.MateObject(),
//                     new mateClasses.MateObject(),
//                     new mateClasses.MateObject()
//                 ],
//                 "ShipConditions" : []
//             },
//             "Player2" : {
//                 "userId": null,
//                 "Ship": [
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     ["CannonObject", new mateClasses.MateObject()],
//                     [null, null],
//                     [null, null]
//                 ],
//                 "PartInventory": [
//                     "CannonObject",
//                     "CannonObject",
//                     "CannonObject"
//                 ],
//                 "MateInventory": [
//                     new mateClasses.MateObject(),
//                     new mateClasses.MateObject(),
//                     new mateClasses.MateObject()
//                 ],
//                 "ShipConditions" : []
//             }
//         };

//         let currentGame = await new LiveGames({
//             _id: mongoose.Types.ObjectId(),
//             gameData: gameData
//         });

//         userProfile.activeGameID = await currentGame.id;
//         await currentGame.save();
//         await userProfile.save();

//         var file = await require(`../../programs/battlePrep.js`);
//         file.prep(interaction, client);
//     }
// }