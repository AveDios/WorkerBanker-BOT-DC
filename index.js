const { Client, GatewayIntentBits } = require("discord.js");
const { token, prefix, adminRole } = require("./config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Map();

// Funkcja do ładowania komend z folderu
const loadCommands = (dir) => {
    const commandFiles = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of commandFiles) {
        const filePath = path.join(dir, file.name);

        // Sprawdzenie, czy plik jest folderem
        if (file.isDirectory()) {
            // Rekurencyjnie ładowanie komend z podfolderów
            loadCommands(filePath);
        } else if (file.name.endsWith(".js")) {
            const command = require(filePath);
            client.commands.set(command.name, command);
        }
    }
};

loadCommands(path.join(__dirname, "./commands/userCommands"));
loadCommands(path.join(__dirname, "./commands/adminCommands"));

client.on("messageCreate", (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return; // Ignoruj boty i wiadomości bez prefixu

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);

        if (command.adminOnly && !message.member.permissions.has(adminRole)) {
            return message.reply("Nie masz uprawnień do używania tej komendy.");
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There is something wrong with the commend.");
        }
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return; // Użyj isCommand, aby sprawdzić, czy to komenda slash

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Sprawdzenie uprawnień dla komend admina
    if (command.adminOnly && !interaction.member.permissions.has(adminRole)) {
        return interaction.reply({
            content: "Nie masz uprawnień do używania tej komendy.",
            ephemeral: true,
        });
    }

    try {
        await command.execute(interaction); // Wywołanie funkcji wykonawczej komendy
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Wystąpił błąd podczas wykonywania komendy.",
            ephemeral: true,
        });
    }
});
// Logowanie bota
client.login(token);
