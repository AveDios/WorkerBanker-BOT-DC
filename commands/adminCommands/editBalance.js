const { setUserBalance } = require("../../database/db");
const { adminRole } = require("../../config.json");

module.exports = {
    name: "editbalance",
    description:
        "Edytuje balans innego użytkownika (tylko dla administratorów)",
    adminOnly: true,
    execute(interaction) {
        const member = interaction.member; // Użyj interaction.member
        const targetUser = interaction.options.getUser("user"); // Pobierz użytkownika z argumentów
        const amount = interaction.options.getInteger("amount"); // Pobierz kwotę jako liczbę całkowitą

        // Sprawdzanie uprawnień administratora
        if (!member.permissions.has(adminRole)) {
            return interaction.reply(
                "Nie masz uprawnień do użycia tej komendy.",
                {
                    ephemeral: true,
                }
            );
        }

        if (!targetUser || isNaN(amount)) {
            return interaction.reply(
                "Poprawne użycie: /editbalance @user <kwota>",
                {
                    ephemeral: true,
                }
            );
        }

        setUserBalance(targetUser.id, amount, (success) => {
            if (success) {
                interaction.reply(
                    `Balans użytkownika ${targetUser.username} został zmieniony o ${amount} monet.`
                );
            } else {
                interaction.reply("Wystąpił błąd podczas edytowania balansu.", {
                    ephemeral: true,
                });
            }
        });
    },
};
