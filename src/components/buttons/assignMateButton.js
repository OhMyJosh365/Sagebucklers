const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'assignMateButton'
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

        var placement = interaction.customId.substr(-1);
        var mateIndex = currentGame.gameData[0][`Player${playerIndex}`].Selections[0].substr(-1);

        // Removes it from the inventory
        var newMate = currentGame.gameData[0][`Player${playerIndex}`].MateInventory[mateIndex];
        currentGame.gameData[0][`Player${playerIndex}`].MateInventory.splice(mateIndex, 1);

        // Adds Part to ship
        var oldMate = currentGame.gameData[0][`Player${playerIndex}`].Ship[placement][1];
        if(oldMate != null){
            currentGame.gameData[0][`Player${playerIndex}`].MateInventory[
                currentGame.gameData[0][`Player${playerIndex}`].MateInventory.length] = oldMate;
        }
        currentGame.gameData[0][`Player${playerIndex}`].Ship[placement][1] = newMate;
        currentGame.gameData[0][`Player${playerIndex}`].Selections = [];
        
        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        require(`../../programs/battlePrep`).prep(interaction, client, currentGame.id, playerIndex);

    }
}