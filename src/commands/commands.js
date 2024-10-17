const { PermissionFlagsBits } = require("discord.js");

const foldersPath = __dirname;
const commandFolders = fs.readdirSync(foldersPath);

function registerAll(client) {
  client.commands = new Collection();

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        if (command.adminOnly) {
          command.data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
          command.data.description += " (tylko dla administratorów)";
        }
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[OSTRZEŻENIE] Komenda ${filePath} nie posiada wymaganych wartości "data" lub "execute".`);
      }
    }
  }
}
