const { Client, GatewayIntentBits, REST } = require("discord.js");
const commands = require("./commands/commands.js");
const config = require("../run/config.json");

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, ],
});
const rest = new REST().setToken(config.token);

commands.registerAll(client, rest, config);

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return; // Czy interakcja jest komendą
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction); // Wywołanie komendy
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Wystąpił błąd podczas wykonywania komendy.",
            ephemeral: true,
        });
    }
});

client.login(config.token); // Logowanie bota
