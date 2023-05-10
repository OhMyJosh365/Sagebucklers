const UserProfile = require('../../schemas/userProfile');
const LiveGames = require('../../schemas/liveGames');

module.exports = {
    data: {
        name : 'placeShipButton'
    },
    async execute(interaction, client){
        
        var placement = interaction.customId.substr(-1);

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

        var objectName = currentGame.gameData[0][`Player${playerIndex}`].Selections[0];

        // Removes it from the inventory
        for(var i = 0; i < currentGame.gameData[0][`Player${playerIndex}`].PartInventory.length; i++){
            if(currentGame.gameData[0][`Player${playerIndex}`].PartInventory[i] == objectName){
                currentGame.gameData[0][`Player${playerIndex}`].PartInventory.splice(i, 1);
                i = currentGame.gameData[0][`Player${playerIndex}`].PartInventory.length;
            }
        }

        // Adds Part to ship
        var oldPart = currentGame.gameData[0][`Player${playerIndex}`].Ship[placement][0];
        if(oldPart != null){
            currentGame.gameData[0][`Player${playerIndex}`].PartInventory[
                currentGame.gameData[0][`Player${playerIndex}`].PartInventory.length] = oldPart;
        }
        currentGame.gameData[0][`Player${playerIndex}`].Ship[placement][0] = objectName;
        currentGame.gameData[0][`Player${playerIndex}`].Selections = [];
        
        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        require(`../../programs/battlePrep`).prep(interaction, client, currentGame.id, playerIndex);
    }
}