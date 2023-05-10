const Canvas = require("canvas");
const GIFEncoder = require("gif-encoder-2");
var fs = require('fs')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
var partClasses = require(`../programs/partClasses`);
const LiveGames = require('../schemas/liveGames');
const UserProfile = require('../schemas/userProfile');

async function prep(interaction, client, currentGameId, playerIndex){

    var currentGame = await LiveGames.findById(currentGameId);

    var rival;
    for(gameInd = 0; gameInd < currentGame.activeMatches[0].numGames; gameInd++){
        if(currentGame.activeMatches[0][`Game${gameInd}`].left == `Player${playerIndex}`){
            rival = await client.users.fetch(currentGame.gameData[0][(currentGame.activeMatches[0][`Game${gameInd}`].right)].MessageInfo[0]);
            break;
        }
        if(currentGame.activeMatches[0][`Game${gameInd}`].right == `Player${playerIndex}`){
            rival = await client.users.fetch(currentGame.gameData[0][(currentGame.activeMatches[0][`Game${gameInd}`].left)].MessageInfo[0]);
            break;
        }
    }

    //Should swap sides based on current side
    var sizeH = 250, sizeW = 250;
    canvas = Canvas.createCanvas(sizeH, sizeW)
    ctx = canvas.getContext('2d');
    var sides = ["left", "right"];

    var backgroundImage = await Canvas.loadImage(`./src/Images/BattleBackground2.png`);
    ctx.drawImage(backgroundImage, 0, 0, sizeH, sizeW);
    var backgroundImage = await Canvas.loadImage(`./src/Images/cloud.png`);
    ctx.drawImage(backgroundImage, sizeH*(1/2), 0, sizeH, sizeW);

    for(var i = 0; i < currentGame.gameData[0][`Player${playerIndex}`].Ship.length; i++){
        if(currentGame.gameData[0][`Player${playerIndex}`].Ship[i][0] != null){
            
            var part = new partClasses[`${currentGame.gameData[0][`Player${playerIndex}`].Ship[i][0]}`]();
            part.team = sides[i];
            part.positionX = partClasses[`leftShipPartPlacements`][i][0];
            part.positionY = partClasses[`leftShipPartPlacements`][i][1];
            part.charge = -1;
            await part.onFrame(ctx, null);
        }
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), "Can.png");

    var embed = new EmbedBuilder()
        .setTitle(`Prepare to set Sail!`)
        .setDescription(`You are about to set sail to face ${rival.username}\nNeed any more prepared before sailing Captain?`)
        .setThumbnail(rival.avatarURL())
        .setImage('attachment://Can.png')
        .setColor(0x101526)
        .setTimestamp();
    
    const messageComponents = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('menuBattlePrep')
            .setPlaceholder(`Prepare to face ${rival.username}!`)
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
            new StringSelectMenuOptionBuilder({
                label: "Place a Ship Part",
                description: "Places a ship part on the next location you press.",
                value: 'placePart'
            }), 
            new StringSelectMenuOptionBuilder({
                label: "Remove a Ship Part",
                description: "Removes a ship part on the next location you press.",
                value: 'removePart'
            }), 
            new StringSelectMenuOptionBuilder({
                label: "Assign a Mate",
                description: "Assign a Mate to a part of the ship!",
                value: 'assignMate'
            }),
            new StringSelectMenuOptionBuilder({
                label: "Ready for the Plunder!",
                description: "Ready up to face your oppenent!",
                value: 'readyUp'
            })
        )
    );

    const user = await client.users.fetch(currentGame.gameData[0][`Player${playerIndex}`].MessageInfo[0]);
    const dmChannel = await user.createDM();
    const messageManager = dmChannel.messages;
    const messages = await messageManager.fetch({ limit: 100 });
    const message = messages.find(m => m.id === currentGame.gameData[0][`Player${playerIndex}`].MessageInfo[1]);
    if (message) {
        await message.edit({ embeds: [embed], files: [attachment], components: [messageComponents]});
    }
}

async function shipOfButton(interaction, nameOfButton, emojiType){

    var userProfile = await UserProfile.findOne({userId: interaction.user.id});
    var currentGame = await LiveGames.findById(userProfile.activeGameID);
    if(!currentGame) return;

    var playerIndex = -1;
    for(var i = 0; i < currentGame.gameData[0].NumPlayers; i++){
        if(currentGame.gameData[0][`Player${i+1}`].username == userProfile.username){
            playerIndex = i+1;
            break;
        }
    }
    if(playerIndex == -1) return;

    var buttonIndexes = [];
    var leftButtons = [0, 1, 2, 3, 4, 5, 6];
    var rightButtons = [0, 2, 1, 4, 3, 6, 5];

    for(gameInd = 0; gameInd < currentGame.activeMatches[0].numGames; gameInd++){

        if(currentGame.activeMatches[0][`Game${gameInd}`].left == `Player${playerIndex}`){
            buttonIndexes = leftButtons;
            break;
        }
        if(currentGame.activeMatches[0][`Game${gameInd}`].right == `Player${playerIndex}`){
            buttonIndexes = rightButtons;
            break;
        }
    }

    var emojiList = ["🟫", "🟫", "🟫", "🟫", "🟫", "🟫", "🟫"];
    if(emojiType == "PartEmojis"){
        for(var i = 0; i < 7; i++){
            if(currentGame.gameData[0][`Player${playerIndex}`].Ship[i][0] != null){
                emojiList[i] = new partClasses[`${currentGame.gameData[0][`Player${playerIndex}`].Ship[i][0]}`]().emoji;
            }
        }
    }
    else if(emojiType == "MateEmojis"){
        var mateList = ["🦉", "🦚", "🦩", "🦜", "🦅"], emojiIndex = 0;
        for(var i = 0; i < 7; i++){
            if(currentGame.gameData[0][`Player${playerIndex}`].Ship[i][1] != null){
                emojiList[i] = mateList[emojiIndex++]
            }
        }
    }
    

    const row2 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId('null4').setLabel("🌊")
                .setStyle(ButtonStyle.Primary).setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[0]}`).setLabel(emojiList[0])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null5').setLabel("🌊")
                .setStyle(ButtonStyle.Primary).setDisabled(true)
        ]
    );
    const row3 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[1]}`).setLabel(emojiList[1])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null6').setLabel("🟤")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[2]}`).setLabel(emojiList[2])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );
    const row4 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[3]}`).setLabel(emojiList[3])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null7').setLabel("🟫")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[4]}`).setLabel(emojiList[4])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );
    const row5 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[5]}`).setLabel(emojiList[5])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null8').setLabel("🟫")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}:${buttonIndexes[6]}`).setLabel(emojiList[6])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );

    return [row2, row3, row4, row5];
}

async function editAllEmbeds(gameData, interaction, client, currentGame){
    var messageBoard = gameData.ActiveMessages;

    var numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
    var emojiIndex = 0;
    var hostIndex = -1;
    var feildVals = ``;

    for(var i = 0; i < messageBoard.length; i++){
        if(messageBoard[i][2] == "Host"){
            hostIndex = i;
        }
        if(messageBoard[i][2] == "Host" || messageBoard[i][2] == "Pending" || messageBoard[i][2] == "Guest"){
            var user = await client.users.fetch(messageBoard[i][0]);
            feildVals += `${numEmojis[emojiIndex++]}    ${user.username}\n`
        }
    }
    for(; emojiIndex < gameData.LobbySize; emojiIndex++){
        feildVals += `${numEmojis[emojiIndex]}\n`
    }

    var user = await client.users.fetch(messageBoard[hostIndex][0])
    var embed = new EmbedBuilder()
        .setTitle(`${user.username} is Starting a Party!`)
        .setDescription(`They are starting a public game of Sagebucklers!\nUnfurl the Sails and Hop Aborad!`)
        .addFields([
            {
                name: 'Current Captains Aboard',
                value: feildVals,
                inline: true
            }
        ])
        .setColor(0x101526)
        .setTimestamp(); 

    var joinButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`lobbyButton:J.${currentGame.id}`).setLabel("Join the Adventure!")
            .setStyle(ButtonStyle.Primary).setDisabled(false),
    ]);
    var guestButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`lobbyButton:L.${currentGame.id}`).setLabel("Leave the Lobby")
            .setStyle(ButtonStyle.Danger).setDisabled(false),
    ]);
    var hostButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`lobbyButton:S.${currentGame.id}`).setLabel("All Set!")
            .setStyle(ButtonStyle.Primary).setDisabled(false),
        new ButtonBuilder()
            .setCustomId(`lobbyButton:D.${currentGame.id}`).setLabel("Disban the Crew")
            .setStyle(ButtonStyle.Danger).setDisabled(false)
    ]);


    for(var i = 0; i < messageBoard.length; i++){
        if(messageBoard[i][2] == "Host" || messageBoard[i][2] == "Pending" || messageBoard[i][2] == "Guest"){
            var usingButtons = (messageBoard[i][2] != "Host") ? ((messageBoard[i][2] == "Guest") ? guestButtons : joinButtons) : hostButtons;

            const user = await client.users.fetch(messageBoard[i][0]);
            const dmChannel = await user.createDM();
            const messageManager = dmChannel.messages;
            const messages = await messageManager.fetch({ limit: 100 });
            const message = messages.find(m => m.id === messageBoard[i][1]);
            if (message) {
                await message.edit({embeds: [embed], components: [usingButtons]});
            }
        }
        else{

            const guild = await client.guilds.cache.get(messageBoard[i][0]);
            const channel = await guild.channels.fetch(messageBoard[i][1]);
            const messageManager = channel.messages;
            const messages = await messageManager.fetch({ limit: 100 });
    
            const message = messages.find(m => m.id === messageBoard[i][2]);
            if (message) {
            await message.edit({embeds: [embed], components: [joinButtons]});
            }
        }
    }
}

module.exports = {prep, shipOfButton, editAllEmbeds};