const { getUserBalance } = require("../../database/db");

module.exports = {
    name: "balance",
    description: "Pokazuje balans użytkownika",
    adminOnly: false,
    execute(interaction) {
        const userId = interaction.user.id; // Użyj interaction.user.id zamiast message.user.id

        getUserBalance(userId, (balance) => {
            interaction.reply(
                `${interaction.user.username}, twój balans wynosi: ${balance} monet.`
            );
        });
    },
};
