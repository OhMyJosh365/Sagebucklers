const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Return a button!'),
    async execute(interaction, client){
        const button = new ButtonBuilder()
            .setCustomId('sub-yt')
            .setLabel("Click Me!")
            .setStyle(ButtonStyle.Primary);

        await interaction.editReply({
            components: [new ActionRowBuilder().addComponents(button)]
        })
    } 
}