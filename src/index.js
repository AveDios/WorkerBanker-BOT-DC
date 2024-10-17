const { Client, GatewayIntentBits } = require("discord.js");
const commands = require("./commands/commands.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

commands.registerAll(client);

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

client.login(require("./config.json").token); // Logowanie bota
