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
            "Player1" : {
                "userId": interaction.user.id
            }
        };

        let currentGame = await new LiveGames({
            _id: mongoose.Types.ObjectId(),
            gameData: gameData
        });

        userProfile.activeGameID = await currentGame.id;
        await currentGame.save();
        await userProfile.save();

        var embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} is Starting a Party!`)
            .setDescription(`They are starting a public game of Sagebucklers!\nUnfurl the Sails and Hop Aborad!`)
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp(); 
        
        var buttons = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
                .setCustomId('Joining').setLabel("Join the Adventure!")
                .setStyle(ButtonStyle.Secondary).setDisabled(false),

            new ButtonBuilder()
                .setCustomId('Leaving').setLabel("Leave Party")
                .setStyle(ButtonStyle.Danger).setDisabled(false)
        ]);

        interaction.editReply({embeds: [embed], components: [buttons]});
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