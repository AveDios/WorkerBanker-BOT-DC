const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Wyłącz bota."),
    adminOnly: true,
    async execute(interaction) {
        interaction.reply("Wyłączanie bota...").then(() => process.exit());
    }
}
