const Canvas = require("canvas");
const GIFEncoder = require("gif-encoder-2");
var fs = require('fs')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
var partClasses = require(`../programs/partClasses`);
const LiveGames = require('../schemas/liveGames');
const UserProfile = require('../schemas/userProfile');

async function prep(interaction, client){

    var userProfile = await UserProfile.findOne({userId: interaction.user.id});
    var currentGame = await LiveGames.findById(userProfile.activeGameID);

    var sizeH = 250, sizeW = 250;
    canvas = Canvas.createCanvas(sizeH, sizeW)
    ctx = canvas.getContext('2d');
    var sides = ["left", "right"];

    var backgroundImage = await Canvas.loadImage(`./src/Images/BattleBackground2.png`);
    ctx.drawImage(backgroundImage, 0, 0, sizeH, sizeW);
    var backgroundImage = await Canvas.loadImage(`./src/Images/cloud.png`);
    ctx.drawImage(backgroundImage, sizeH*(1/2), 0, sizeH, sizeW);

    for(var i = 0; i < currentGame.gameData[0].Player1.Ship.length; i++){
        if(currentGame.gameData[0].Player1.Ship[i][0] != null){
            
            var part = new partClasses[`${currentGame.gameData[0].Player1.Ship[i][0]}`]();
            part.team = sides[i];
            part.positionX = partClasses[`leftShipPartPlacements`][i][0];
            part.positionY = partClasses[`leftShipPartPlacements`][i][1];
            part.charge = -1;
            await part.onFrame(ctx, null);
        }
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), "Can.png");

    var embed = new EmbedBuilder()
        .setTitle(`It's works!`)
        .setThumbnail(interaction.user.avatarURL())
        .setImage('attachment://Can.png') //adding a image
        .setColor(0x101526)
        .setTimestamp(); 
    
    const messageComponents = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('menuBattlePrep')
            .setPlaceholder('Prepare to face <OppenentName>!')
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

    interaction.editReply({embeds: [embed], files: [attachment], components: [messageComponents]});
}

async function shipOfButton(interaction, nameOfButton, emojiType){

    var userProfile = await UserProfile.findOne({userId: interaction.user.id});
    var currentGame = await LiveGames.findById(userProfile.activeGameID);
    if(!currentGame) return;

    var emojiList = ["🟫", "🟫", "🟫", "🟫", "🟫", "🟫", "🟫"];
    if(emojiType == "PartEmojis"){
        for(var i = 0; i < 7; i++){
            if(currentGame.gameData[0].Player1.Ship[i][0] != null){ //Needs to be for all players later
                emojiList[i] = new partClasses[`${currentGame.gameData[0].Player1.Ship[i][0]}`]().emoji;
            }
        }
    }
    else if(emojiType == "MateEmojis"){
        var mateList = ["🦉", "🦚", "🦩", "🦜", "🦅"], emojiIndex = 0;
        for(var i = 0; i < 7; i++){
            if(currentGame.gameData[0].Player1.Ship[i][1] != null){ //Needs to be for all players later
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
                .setCustomId(`${nameOfButton}0`).setLabel(emojiList[0])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null5').setLabel("🌊")
                .setStyle(ButtonStyle.Primary).setDisabled(true)
        ]
    );
    const row3 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}1`).setLabel(emojiList[1])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null6').setLabel("🟤")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}2`).setLabel(emojiList[2])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );
    const row4 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}3`).setLabel(emojiList[3])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null7').setLabel("🟫")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}4`).setLabel(emojiList[4])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );
    const row5 = new ActionRowBuilder().addComponents(
        [
            new ButtonBuilder()
                .setCustomId(`${nameOfButton}5`).setLabel(emojiList[5])
                .setStyle(ButtonStyle.Secondary).setDisabled(false),
            new ButtonBuilder()
                .setCustomId('null8').setLabel("🟫")
                .setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder()
                .setCustomId(`${nameOfButton}6`).setLabel(emojiList[6])
                .setStyle(ButtonStyle.Secondary).setDisabled(false)
        ]
    );

    return [row2, row3, row4, row5];
}

module.exports = {prep, shipOfButton};