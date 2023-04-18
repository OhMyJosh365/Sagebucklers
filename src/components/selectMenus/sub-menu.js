module.exports = {
    data: {
        name: 'sub-menu'
    },
    async execute(interaction, client){
        await interaction.editReply({
            content: `You select: ${interaction.values[0]}`
        })
    }
}