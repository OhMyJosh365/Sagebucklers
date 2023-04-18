const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'assignMateButton'
    },
    async execute(interaction, client){
        
        var userProfile = await UserProfile.findOne({userId: interaction.user.id});
        var currentGame = await LiveGames.findById(userProfile.activeGameID);

        var placement = interaction.customId.substr(-1);
        var mateIndex = currentGame.gameData[0].Player1.Selections[0].substr(-1);

        // Removes it from the inventory
        var newMate = currentGame.gameData[0].Player1.MateInventory[mateIndex];
        currentGame.gameData[0].Player1.MateInventory.splice(mateIndex, 1);

        // Adds Part to ship
        var oldMate = currentGame.gameData[0].Player1.Ship[placement][1];
        if(oldMate != null){
            currentGame.gameData[0].Player1.MateInventory[
                currentGame.gameData[0].Player1.MateInventory.length] = oldMate;
        }
        currentGame.gameData[0].Player1.Ship[placement][1] = newMate;
        currentGame.gameData[0].Player1.Selections = [];
        
        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        require(`../../programs/battlePrep`).prep(interaction, client);

    }
}