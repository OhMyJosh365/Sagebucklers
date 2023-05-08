const { InteractionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const UserProfile = require('../../schemas/userProfile');
const mongoose = require("mongoose");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        
        if(interaction.user.bot) return;
        
        if(interaction.update) await interaction.deferUpdate();
        else{
            var mes = await interaction.reply("Hey");
            console.log(mes)
            client.lastMessage = [interaction.guildId, interaction.channelId, mes.id];
        }
        //1105244584885354586
        //'1105246205438603365'
        //'1105246205438603365'

        const guild = await client.guilds.cache.get(client.lastMessage[0]);
        const channel = await guild.channels.fetch(client.lastMessage[1]);
        const messageManager = channel.messages;
        const messages = await messageManager.fetch({ limit: 100 });
        console.log(messages)

        const message = messages.find(m => m.interaction.id === client.lastMessage[2]);
        if (message) {
        await message.edit('New message content');
        }
        else{
            console.log(message)
        }
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