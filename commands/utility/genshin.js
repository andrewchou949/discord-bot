const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // For api requesting

module.exports = {
	data: new SlashCommandBuilder()
		.setName('genshin')
		.setDescription('Using fanmade genshin api to get game infos.')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The api description')
				.setRequired(true)
				// Choice options!
				.addChoices(
					{ name: 'Artifact', value: 'artifacts' },
					{ name: 'Boss', value: 'boss' },
					{ name: 'Domain', value: 'domains' },
                    { name: 'Characters', value: 'characters' },
                    { name: 'Consumables', value: 'consumables' },
                    { name: 'Elements', value: 'elements' },
                    { name: 'Materials', value: 'materials' },
                    { name: 'Weapons', value: 'weapons' },
				)),
    async execute(interaction) {
		// getting the value!
        const category = interaction.options.getString('category');
        const apiUrl = `https://genshin.jmp.blue/${category}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data; // Assuming the API returns JSON data
            console.log(data); // Log the data to the console
            await interaction.reply(`Info for ${category}: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('Failed to fetch data from the API.');
        }
    },
};