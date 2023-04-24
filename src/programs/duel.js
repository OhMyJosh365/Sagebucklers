const Canvas = require("canvas");
const GIFEncoder = require("gif-encoder-2");
var fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const partClasses = require("../programs/partClasses");
const spellClasses = require("../programs/spellClasses");
const LiveGames = require('../schemas/liveGames');
const UserProfile = require('../schemas/userProfile');

var canvas, ctx;

async function startDuel(interaction, client, gameId){

    var userProfile = await UserProfile.findOne({userId: interaction.user.id});
    var currentGame = await LiveGames.findById(userProfile.activeGameID);

    var objectArray = [];
    var players = ["Player1", "Player2"];
    var sides = ["left", "right"];
    var matchName = `${players[0]}VS${players[1]}`;
    if(!currentGame.gameData[0].activeDuels){
        currentGame.gameData[0].activeDuels = {};
    }
    currentGame.gameData[0].activeDuels[matchName] = {};
    currentGame.gameData[0].activeDuels[matchName].LeftShip = currentGame.gameData[0][players[0]];
    currentGame.gameData[0].activeDuels[matchName].RightShip = currentGame.gameData[0][players[1]];
    currentGame.gameData[0].activeDuels[matchName].objectArray = [];
    
    for(var i = 0; i < 2; i++){
        for(var j = 0; j < 7; j++){
            if(currentGame.gameData[0][players[i]].Ship[j][0] != null){
                currentGame.gameData[0].activeDuels[matchName].objectArray.push(new partClasses[`${currentGame.gameData[0][`${players[i]}`].Ship[j][0]}`]());
                var leng = currentGame.gameData[0].activeDuels[matchName].objectArray.length;
                currentGame.gameData[0].activeDuels[matchName].objectArray[leng-1].team = sides[i];
                currentGame.gameData[0].activeDuels[matchName].objectArray[leng-1].positionX = partClasses[`${sides[i]}ShipPartPlacements`][j][0];
                currentGame.gameData[0].activeDuels[matchName].objectArray[leng-1].positionY = partClasses[`${sides[i]}ShipPartPlacements`][j][1];
                if(currentGame.gameData[0][players[i]].Ship[j][1] != null){
                    currentGame.gameData[0].activeDuels[matchName].objectArray[leng-1].mateManning = currentGame.gameData[0][players[i]].Ship[j][1];
                }
            }
        }
    }


    for(var i = 0; i < currentGame.gameData[0].activeDuels[matchName].objectArray.length; i++){
        objectArray.push(new partClasses[`${currentGame.gameData[0].activeDuels[matchName].objectArray[i].className}`]());

        for(var item in currentGame.gameData[0].activeDuels[matchName].objectArray[i]){
            objectArray[objectArray.length-1][item] = currentGame.gameData[0].activeDuels[matchName].objectArray[i][item];
        }
    }

    var sizeH = 250, sizeW = 250;
    canvas = Canvas.createCanvas(sizeH, sizeW) // set the height and width of the canvas
    ctx = canvas.getContext('2d');

    const encoder = new GIFEncoder(sizeH, sizeW);
    encoder.setDelay(100);
    encoder.setRepeat(-1);
    encoder.setQuality(30);
    encoder.start(); // starts the encoder

    var backgroundImage = await Canvas.loadImage(`./src/Images/BattleBackground2.png`);

    async function background() {
        ctx.drawImage(backgroundImage, 0, 0, sizeH, sizeW);
    };


    for(var i = 0; i < 150; i++){
        background();
        for(var j = 0; j < objectArray.length; j++){
            await objectArray[j].onFrame(ctx, objectArray);
        }
        encoder.addFrame(ctx);

        //Check for collisions
        for(var j = 0; j < objectArray.length; j++){
            for(var k = 0; k < objectArray.length; k++){
                if(j != k){
                    await objectArray[j].checkCollision(objectArray[k], j, k, objectArray);
                }
            }
        }

        //Clean Up
        for(var j = 0; j < objectArray.length; j++){
            if(!objectArray[j].active ||
                objectArray[j].positionX <= 0 ||
                objectArray[j].positionY <= 0 ||
                objectArray[j].positionX >= sizeH ||
                objectArray[j].positionX >= sizeW){
                if(!(objectArray[j].className == "ArmageddonObject" && objectArray[j].active == false)){
                    objectArray.splice(j, 1);
                    j--;
                }    
            }
        }

    }
    encoder.finish();
    
    const buffer = encoder.out.getData();
    await fs.writeFileSync('./src/Images/animated.gif', buffer, error => {
    error ? console.log(error) : console.log("Saved!");
    });

    

    var embed = new EmbedBuilder()
        .setTitle(`It's works!`)
        .setThumbnail(interaction.user.avatarURL())
        .setImage('attachment://animated.gif') //adding a image
        .setColor(0x101526)
        .setTimestamp();

    interaction.editReply({embeds: [embed], files: ["./src/Images/animated.gif"]});

    currentGame.gameData[0].activeDuels[matchName].objectArray = await objectArray;
    await LiveGames.findByIdAndUpdate(gameId,
        {
            gameData : currentGame.gameData
        });

    //While in testing
    await LiveGames.findByIdAndDelete(gameId);
}

module.exports = {startDuel};