const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'removeShipButton'
    },
    async execute(interaction, client){
        
        var placement = interaction.customId.substr(-1);

        var userProfile = await UserProfile.findOne({userId: interaction.user.id});
        var currentGame = await LiveGames.findById(userProfile.activeGameID);

        // Adds Part to ship
        var oldPart = currentGame.gameData[0].Player1.Ship[placement][0];
        if(oldPart != null){
            currentGame.gameData[0].Player1.PartInventory[
                currentGame.gameData[0].Player1.PartInventory.length] = oldPart;
        }
        currentGame.gameData[0].Player1.Ship[placement][0] = null;
        
        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        require(`../../programs/battlePrep`).prep(interaction, client);

    }
}