const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");
const fs = require("fs");
const path = require("path");

const commandsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "commandsData.json"))
);

const commands = [];

const loadSlashCommands = (commandsArray, isAdmin) => {
    commandsArray.forEach((commandData) => {
        // Warunek sprawdzający, czy komenda jest dostępna dla administratorów
        if (!commandData.adminOnly || isAdmin) {
            const command = new SlashCommandBuilder()
                .setName(commandData.name)
                .setDescription(commandData.description);
            commands.push(command.toJSON());
        }
    });
};

loadSlashCommands(commandsData.userCommands, false);
loadSlashCommands(commandsData.adminCommands, true);

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Rejestrowanie komned slash...");

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log("Komendy zostały zarejestrowane");
    } catch (error) {
        console.error(error);
    }
})();
