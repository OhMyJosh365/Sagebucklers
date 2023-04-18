const LiveGames = require('../../schemas/liveGames');
const UserProfile = require('../../schemas/userProfile');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: {
        name : 'menuBattlePrep'
    },
    async execute(interaction, client){

        var userProfile = await UserProfile.findOne({userId: interaction.user.id});
        var currentGame = await LiveGames.findById(userProfile.activeGameID);

        if(interaction.values[0] == "readyUp"){
            await interaction.editReply({components: [], files: []});
            require(`../../programs/duel`).startDuel(interaction, client, userProfile.activeGameID);
        }
        else if(interaction.values[0] == "placePart"){

            var embed = new EmbedBuilder()
                .setTitle(`It works!`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor(0x101526)
                .setTimestamp();

            var options = [], i = 0;
            for(var j = 0; j < currentGame.gameData[0].Player1.PartInventory.length; j++){
                var objectName = currentGame.gameData[0].Player1.PartInventory[j];
                var partName = objectName.substring(0, objectName.length-6);

                options[i++] = new StringSelectMenuOptionBuilder({
                    label: `${partName}`,
                    description: `Place a ${partName} from your inventory on your ship.`,
                    value: `${objectName}${i}`
                });
            }

            options[i++] = new StringSelectMenuOptionBuilder({
                label: "Cancel",
                description: "Returns to Prep Menu",
                value: 'returnToPrep'
            });

            const messageComponents = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('placePartMenu')
                    .setPlaceholder('What part do you want to place?')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setOptions(options)
            );
            
            interaction.editReply({embed: [embed], components: [messageComponents]});
        }
        else if(interaction.values[0] == "removePart"){

            var embed = new EmbedBuilder()
                .setTitle(`It works!`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor(0x101526)
                .setTimestamp();

            var buttons = await require(`../../programs/battlePrep`).shipOfButton(interaction, "removeShipButton", "PartEmojis");
            
            interaction.editReply({embed: [embed], components: buttons});
        }
        else if(interaction.values[0] == "assignMate"){

            var embed = new EmbedBuilder()
                .setTitle(`It works!`)
                .setThumbnail(interaction.user.avatarURL())
                .setColor(0x101526)
                .setTimestamp();

            
            var options = [], i = 0;
            for(var j = 0; j < currentGame.gameData[0].Player1.MateInventory.length; j++){
                var mateName = currentGame.gameData[0].Player1.MateInventory[j].name;

                options[i] = new StringSelectMenuOptionBuilder({
                    label: `${mateName}`,
                    description: `Assign ${mateName} to somewhere on the ship.`,
                    value: `MateIndex${i++}`
                });
            }

            options[i++] = new StringSelectMenuOptionBuilder({
                label: "Cancel",
                description: "Returns to Prep Menu",
                value: 'returnToPrep'
            });

            const messageComponents = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('assignMateMenu')
                    .setPlaceholder('What mate do you want to assign?')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setOptions(options)
            );
            
            interaction.editReply({embed: [embed], components: [messageComponents]});
        }
    }
}