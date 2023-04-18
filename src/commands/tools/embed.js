const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Returns an embed!'),
    async execute(interaction, client){
        try{
        const embed = new EmbedBuilder()
            .setTitle(`This is an Embed!`)
            .setDescription(`This is a very cool description`)
            .setColor(0x101526)
            .setThumbnail(interaction.user.avatarURL())
            .setTimestamp(Date.now())
            .addFields([
                {
                    name: 'Name1',
                    value: 'Value1',
                    inline: true
                },
                {
                    name: 'Name2',
                    value: 'Value2',
                    inline: true
                }
            ])
            .setAuthor({
                url: `https://youtube.com`,
                iconURL: interaction.user.avatarURL(),
                name: interaction.user.tag
            })
            .setFooter({
                iconURL: interaction.user.avatarURL(),
                text: client.user.tag
            })
            .setURL(`https://google.com`);

            await interaction.editReply({
                embeds: [embed]
            })
        }catch(err){console.log(err)}
    } 
}