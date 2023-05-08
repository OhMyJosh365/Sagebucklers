const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'lobbyButton'
    },
    async execute(interaction, client){
        
        interaction.user.send(interaction.customId);

    }
}