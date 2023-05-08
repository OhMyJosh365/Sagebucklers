const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'lobbyButton'
    },
    async execute(interaction, client){
        console.log(interaction.customId)
        
        var command = interaction.customId.substr(interaction.customId.indexOf(":")+1, interaction.customId.length);

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
            console.log("Disban!")
        }

    }
}