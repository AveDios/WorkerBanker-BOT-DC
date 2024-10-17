const { getUserBalance } = require("../../database/db");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Pokazuje balans użytkownika."),
    async execute(interaction) {
        const userId = interaction.user.id; // Użyj interaction.user.id zamiast message.user.id

        getUserBalance(userId, (balance) => {
            interaction.reply(
                `${interaction.user.username}, twój balans wynosi: ${balance} monet.`
            );
        });
    }
}
