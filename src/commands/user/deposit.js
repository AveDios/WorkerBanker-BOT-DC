const { setUserBalance } = require("../../database/db");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Wpłać wirtualne monety na swoje konto.")
        .addIntegerOption(option => option.setName("kwota").setDescription("Kwota do wpłacenia.")),
    async execute(interaction) {
        const userId = interaction.user.id;
        const depositAmount = parseInt(interaction.options.getInteger("kwota"));

        if (!isNaN(depositAmount) && depositAmount > 0) {
            setUserBalance(userId, depositAmount, (success) => {
                if (success)
                    interaction.reply(`${interaction.user.username}, wpłaciłeś ${depositAmount} monet!`);
                else
                    interaction.reply("Wystąpił błąd podczas wpłacania.");
            });
        } else {
            interaction.reply("Podaj poprawną kwotę do wpłacenia.");
        }
    }
}
