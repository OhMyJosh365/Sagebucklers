const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name : 'lobbyButton'
    },
    async execute(interaction, client){
        
        var command = interaction.customId.substr(interaction.customId.indexOf(":")+1, 1);
        var gameID = interaction.customId.substr(interaction.customId.indexOf(".")+1, interaction.customId.length);
        var currentGame = await LiveGames.findById(gameID);

        if(command == "J"){
            for(var i = 0; i < currentGame.gameData[0].ActiveMessages.length; i++){
                if(currentGame.gameData[0].ActiveMessages[i][2] == "Host" || currentGame.gameData[0].ActiveMessages[i][2] == "Pending" || currentGame.gameData[0].ActiveMessages[i][2] == "Guest"){
                    var user = await client.users.fetch(currentGame.gameData[0].ActiveMessages[i][0]);
                    if(user.username === interaction.user.username) return;
                }
            }

            const dmChannel = await interaction.user.createDM();
            const message = await dmChannel.send("Loading...");
            currentGame.gameData[0].ActiveMessages.push([interaction.user.id, message.id, "Guest"])
            currentGame.gameData[0].NumPlayers++;
            require(`../../programs/battlePrep`).editAllEmbeds(currentGame.gameData[0], interaction, client, currentGame);

            await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        }
        else if(command == "L"){
            var unitIndex = -1;
            for(var i = 0; i < currentGame.gameData[0].ActiveMessages.length; i++){
                if(currentGame.gameData[0].ActiveMessages[i][2] == "Host" || currentGame.gameData[0].ActiveMessages[i][2] == "Pending" || currentGame.gameData[0].ActiveMessages[i][2] == "Guest"){
                    var user = await client.users.fetch(currentGame.gameData[0].ActiveMessages[i][0]);
                    if(user.username === interaction.user.username){
                        unitIndex = i;
                        break;
                    } 
                }
            }
            if(unitIndex == -1) return;
            var embed = new EmbedBuilder()
            .setTitle(`Left the Party!`)
            .setDescription(`You left the party!`)
            .setColor(0x101526)
            .setTimestamp(); 

            const userr = await client.users.fetch(currentGame.gameData[0].ActiveMessages[i][0]);
            const dmChannel = await userr.createDM();
            const message = await dmChannel.send({embeds: [embed], components: []});

            currentGame.gameData[0].ActiveMessages.pop(i);
            currentGame.gameData[0].NumPlayers--;
            require(`../../programs/battlePrep`).editAllEmbeds(currentGame.gameData[0], interaction, client, currentGame);

            await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });

        }
        else if(command == "S"){
            console.log("All Set!")
        }
        else if(command == "D"){
            var messageBoard = currentGame.gameData[0].ActiveMessages;
            var embed = new EmbedBuilder()
            .setTitle(`Lobby Canceled`)
            .setDescription(`The Host canceled this party!`)
            .setColor(0x101526)
            .setTimestamp(); 

            for(var i = 0; i < messageBoard.length; i++){
                if(messageBoard[i][2] == "Host" || messageBoard[i][2] == "Pending" || messageBoard[i][2] == "Guest"){
                    const user = await client.users.fetch(messageBoard[i][0]);
                    const dmChannel = await user.createDM();
                    const messageManager = dmChannel.messages;
                    const messages = await messageManager.fetch({ limit: 100 });
                    const message = messages.find(m => m.id === messageBoard[i][1]);
                    if (message) {
                        await message.edit({embeds: [embed], components: []});
                    }
                }
                else{
        
                    const guild = await client.guilds.cache.get(messageBoard[i][0]);
                    const channel = await guild.channels.fetch(messageBoard[i][1]);
                    const messageManager = channel.messages;
                    const messages = await messageManager.fetch({ limit: 100 });
            
                    const message = messages.find(m => m.id === messageBoard[i][2]);
                    if (message) {
                    await message.edit({embeds: [embed], components: []});
                    }
                }
            currentGame.delete();
        }
    }

    }
}