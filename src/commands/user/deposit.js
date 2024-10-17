const { setUserBalance } = require("../../database/db");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Wpłać wirtualne monety na swoje konto."),
    async execute(interaction) {
        const userId = interaction.user.id;
        const depositAmount = parseInt(interaction.options.getString("amount")); // Odbieranie kwoty jako opcji

        // Sprawdź, czy kwota jest liczbą i większa od zera
        if (!isNaN(depositAmount) && depositAmount > 0) {
            setUserBalance(userId, depositAmount, (success) => {
                if (success) {
                    interaction.reply(
                        `${interaction.user.username}, wpłaciłeś ${depositAmount} monet!`
                    );
                } else {
                    interaction.reply("Wystąpił błąd podczas wpłacania.");
                }
            });
        } else {
            interaction.reply("Podaj poprawną kwotę do wpłacenia.");
        }
    }
}
