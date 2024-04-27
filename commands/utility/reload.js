const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();

		const commandsPath = path.join(__dirname); // __dirname points to the current directory of this script

		try {
			const commandFile = `${commandName}.js`;
			const filePath = path.join(commandsPath, commandFile);

			if (!fs.existsSync(filePath)) {
				return interaction.reply(`There is no command file with name \`${commandName}\` in the utility directory. Make sure the command file exists.`);
			}

			delete require.cache[require.resolve(filePath)];
			const newCommand = require(filePath);
			interaction.client.commands.delete(commandName);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		} catch (error) {
			console.error('Reload command error:', error);
			await interaction.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
	},
};
