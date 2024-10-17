const { PermissionFlagsBits, Collection, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs");

const commands = [];
const foldersPath = __dirname;
const commandFiles = fs.readdirSync(foldersPath, { recursive: true })
  .filter(e => e.includes("\\"))
  .map(filePath => path.join(foldersPath, filePath));

function registerAll(client, rest, config) {
  client.commands = new Collection();

  for (const commandFile of commandFiles) {
    const command = require(commandFile);

    if ("data" in command && "execute" in command) {
      if (command.adminOnly) {
        command.data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
        command.data.description += " (tylko dla administratorów)";
      }
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(`[OSTRZEŻENIE] Komenda ${commandFile} nie posiada wymaganych wartości "data" lub "execute".`);
    }
  }

  // Rejestrowanie komend
  (async () => {
    try {
      const data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands },
      );
      console.log(`Zarejestrowano ${data.length} komend.`);
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = { registerAll };
