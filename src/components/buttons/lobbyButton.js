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
            console.log("Joining!")
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