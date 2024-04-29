const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Sends a random message!')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				// Choice options!
				.addChoices(
					{ name: 'Game', value: 'Genshin Impact is so fun!' },
					{ name: 'Music', value: 'TTPD is the newest top album' },
					{ name: 'Job', value: 'It is so hard to find a new job now!' },
				)),
    async execute(interaction) {
		// getting the value!
        const message = interaction.options.getString('category');
        await interaction.reply(message);
    },
};