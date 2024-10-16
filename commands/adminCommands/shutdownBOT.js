const { adminRole } = require("../../config.json");
const { execute } = require("../userCommands/balance");

module.exports = {
    name: "shutdown",
    description: "Shutdown Roulete-BOT (Only for the admin)",
    adminOnly: true, // Dodaj ten warunek, aby jasno wskazać, że komenda jest tylko dla administratorów
    execute(interaction) {
        // Sprawdzenie, czy użytkownik ma odpowiednie uprawnienia
        if (!interaction.member.permissions.has(adminRole)) {
            return interaction.reply({
                content: "Nie masz uprawnień do wyłączenia bota.",
                ephemeral: true, // Odpowiedź widoczna tylko dla tego użytkownika
            });
        }

        interaction.reply("Wyłączanie bota...").then(() => {
            process.exit(); // Wyłącza proces bota
        });
    },
};
