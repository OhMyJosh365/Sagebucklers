const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

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
            console.log("Disban //Edit Imbed instead!");
            interaction.editReply({content: "Good as Gone Captain!"});
            currentGame.delete();
        }

    }
}