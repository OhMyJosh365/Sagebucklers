module.exports = {
    data : {
        name: 'fav-color'
    },
    async execute(interaction, client){
        await interaction.editReply({
            content: `You said your favorite color is: ${interaction.fields.getTextInputValue("favColorInput")}`
        });
    }
}