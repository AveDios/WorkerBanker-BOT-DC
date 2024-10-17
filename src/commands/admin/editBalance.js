const { setUserBalance } = require("../../database/db");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editbalance")
        .setDescription("Edytuje balans innego użytkownika.")
        .addUserOption(option => option.setName("uzytkownik").setDescription("Użytkownik do edycji balansu."))
        .addIntegerOption(option => option.setName("kwota").setDescription("Kwota do ustawienia.")),
    adminOnly: true,
    async execute(interaction) {
        const targetUser = interaction.options.getUser("uzytkownik");
        const amount = interaction.options.getInteger("kwota");

        if (!targetUser || isNaN(amount))
            return interaction.reply("Poprawne użycie: /editbalance @user <kwota>", { ephemeral: true });

        setUserBalance(targetUser.id, amount, (success) => {
            if (success)
                interaction.reply(`Balans użytkownika ${targetUser.username} został zmieniony o ${amount} monet.`);
            else
                interaction.reply("Wystąpił błąd podczas edytowania balansu.", { ephemeral: true, });
        });
    }
}
