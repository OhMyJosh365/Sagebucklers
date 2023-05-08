const { InteractionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const UserProfile = require('../../schemas/userProfile');
const mongoose = require("mongoose");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        client.lastMessage = interaction.id;
        
        if(interaction.user.bot) return;
        
        if(interaction.update) await interaction.deferUpdate();
        else await interaction.deferReply();

        await interaction.channel.messages.fetch(client.lastMessage)
            .then(msg => msg.edit(`${client.lastMessage}`));
        return;

        var userProfile = await UserProfile.findOne({userId: interaction.user.id})
        if(!userProfile){
            userProfile = await new UserProfile({
                activeGameID: null,
                username: interaction.user.username,
                userId: interaction.user.id,
                userStats: null,
                _id: mongoose.Types.ObjectId()
            });
            await userProfile.save();
        }
        

        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;
            
            try {
                await command.execute(interaction, client);
            }
            catch (error) {
                console.error(error);
            }
        }

        else if(interaction.isButton()){
            const {buttons} = client;
            const {customId} = interaction;
            const button = buttons.get(customId.substring(0, customId.indexOf(":")));
            if(!button) return new Error("There is no code for this button!");

            try{
                await button.execute(interaction,client);
            }
            catch(error) {
                console.error(error);
            }
        }

        else if(interaction.isStringSelectMenu()){
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);
            if(!menu) return new Error("There is no code for this menu");

            try{
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        else if(interaction.isUserContextMenuCommand()){
            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);
            if(!contextCommand) return;

            try{
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        else if(interaction.type = InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if(!modal) return new Error("There is no code for this modal.");

            try{
                await modal.execute(interaction, client);
            } catch (error){
                console.error(error);
            }
        }

    }
}