const LiveGames = require('../../schemas/liveGames');
const UserProfile = require('../../schemas/userProfile');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: {
        name : 'assignMateMenu'
    },
    async execute(interaction, client){

        var userProfile = await UserProfile.findOne({userId: interaction.user.id});
        var currentGame = await LiveGames.findById(userProfile.activeGameID);

        var playerIndex = -1;
        for(var i = 0; i < currentGame.gameData[0].NumPlayers; i++){
            if(currentGame.gameData[0][`Player${i+1}`].username == userProfile.username){
                playerIndex = i+1;
                break;
            }
        }
        if(playerIndex == -1) return;

        if(interaction.values[0] == "returnToPrep"){
            require("../../programs/battlePrep").prep(interaction, client);
        }
        else{
            var mateName = currentGame.gameData[0][`Player${playerIndex}`].MateInventory[interaction.values[0].substring(interaction.values[0].length-1)].name;
            currentGame.gameData[0][`Player${playerIndex}`]["Selections"] = await [];
            currentGame.gameData[0][`Player${playerIndex}`]["Selections"][0] = interaction.values[0];

            var embed = new EmbedBuilder()
                .setTitle(`Where do you assign ${mateName}?`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor(0x101526)
                .setTimestamp();

            var buttons = await require(`../../programs/battlePrep`).shipOfButton(interaction, "assignMateButton", "MateEmojis");
            
            interaction.editReply({embed: [embed], components: buttons});
            await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        }

    }
}