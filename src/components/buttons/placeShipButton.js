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

        var objectName = currentGame.gameData[0].Player1.Selections[0];

        // Removes it from the inventory
        for(var i = 0; i < currentGame.gameData[0].Player1.PartInventory.length; i++){
            if(currentGame.gameData[0].Player1.PartInventory[i] == objectName){
                currentGame.gameData[0].Player1.PartInventory.splice(i, 1);
                i = currentGame.gameData[0].Player1.PartInventory.length;
            }
        }

        // Adds Part to ship
        var oldPart = currentGame.gameData[0].Player1.Ship[placement][0];
        if(oldPart != null){
            currentGame.gameData[0].Player1.PartInventory[
                currentGame.gameData[0].Player1.PartInventory.length] = oldPart;
        }
        currentGame.gameData[0].Player1.Ship[placement][0] = objectName;
        currentGame.gameData[0].Player1.Selections = [];
        
        await LiveGames.findByIdAndUpdate(currentGame.id,
            {
                gameData : currentGame.gameData
            });
        require(`../../programs/battlePrep`).prep(interaction, client);

    }
}