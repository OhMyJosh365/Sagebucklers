module.exports = {
    data: {
        name : 'sub-yt'
    },
    async execute(interaction, client){
        await interaction.editReply({
            content: `https://youtube.com`
        });
    }
}