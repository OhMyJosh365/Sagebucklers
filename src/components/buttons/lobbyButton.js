const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');
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
            const guild = await client.guilds.cache.get(currentGame.gameData[0].ActiveMessages[0][0]);
            const channel = await guild.channels.fetch(currentGame.gameData[0].ActiveMessages[0][1]);
            const messageManager = channel.messages;
            const messages = await messageManager.fetch({ limit: 100 });

            const message = messages.find(m => m.id === currentGame.gameData[0].ActiveMessages[0][2]);
            if (message) {
            await message.edit({content: "Joining", embeds: [], components: []});
            }
            else{
                console.log(message)
            }
        }
        else if(command == "L"){
            console.log("Leaving!")
        }
        else if(command == "S"){
            console.log("All Set!")
        }
        else if(command == "D"){
            var embed = new EmbedBuilder()
            .setTitle(`Lobby Canceled`)
            .setDescription(`The Host canceled this party!`)
            .setColor(0x101526)
            .setTimestamp(); 

            interaction.editReply({embeds: [embed], components: []});
            currentGame.delete();
        }

    }
}

async function editAllEmbeds(embed){

}