const { setUserBalance } = require("../../database/db");
const { SlashCommandBuilder } = require("discord.js");

const cooldowns = new Map();
const COOLDOWN_TIME = 60000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("earn")
        .setDescription("Zarabiaj wirtualne monety."),
    async execute(interaction) {
        const userId = interaction.user.id;

        if (cooldowns.has(userId)) {
            const lastUsed = cooldowns.get(userId);
            const timeNow = Date.now();
            const timePassed = timeNow - lastUsed;

            if (timePassed < COOLDOWN_TIME) {
                const timeLeft = (COOLDOWN_TIME - timePassed) / 1000;
                return interaction.reply(
                    `Musisz poczekać jeszcze ${Math.round(timeLeft)} sekund przed ponownym użyciem tej komendy.`
                );
            }
        }

        const earnAmount = Math.floor(Math.random() * 100) + 1;
        setUserBalance(userId, earnAmount, (success) => {
            if (success) {
                interaction.reply({ content: `${interaction.user.username}, zarobiłeś ${earnAmount} monet!` });
                cooldowns.set(userId, Date.now());
            } else {
                interaction.reply({ content: "Wystąpił błąd podczas zarabiania." });
            }
        });
    }
}
