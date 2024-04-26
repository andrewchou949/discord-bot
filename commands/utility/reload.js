const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
        // require another option!
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const commandsPath = path.join(__dirname, '..', 'commands');  // Adjust to the directory where commands are stored
        const commandFiles = fs.readdirSync(commandsPath);
        const commandFile = commandFiles.find(file => file.split('.')[0] === commandName);

        if (!commandFile) {
            return interaction.reply(`There is no command file with name \`${commandName}\`. Make sure the command file exists.`);
        }

        const filePath = path.join(commandsPath, commandFile);

        try {
            delete require.cache[require.resolve(filePath)];
            const newCommand = require(filePath);
            interaction.client.commands.delete(commandName);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }

		// const commandName = interaction.options.getString('command', true).toLowerCase();
        // const command = interaction.client.commands.get(commandName);

        // if (!command) {
        //     return interaction.reply(`There is no command with name \`${commandName}\`!`);
        // }
        // delete require.cache[require.resolve(`./${command.data.name}.js`)];

		// try {
	    //     interaction.client.commands.delete(command.data.name);
	    //     const newCommand = require(`./${command.data.name}.js`);
	    //     interaction.client.commands.set(newCommand.data.name, newCommand);
	    //     await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		// } catch (error) {
	    //     console.error(error);
	    //     await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		// }
	},
};