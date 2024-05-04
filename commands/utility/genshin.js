const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const axios = require('axios');

// Cap first letter and remove -
function capitalizeFirstLetter(string) {
    return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('genshin')
		.setDescription('Using fanmade Genshin API to get game infos.')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('Choose a category to fetch info from Genshin API')
				.setRequired(true)
				.addChoices(
					{ name: 'Artifact', value: 'artifacts' },
					{ name: 'Boss', value: 'bosses' },
					{ name: 'Domain', value: 'domains' },
                    { name: 'Characters', value: 'characters' },
                    { name: 'Consumables', value: 'consumables' },
                    { name: 'Elements', value: 'elements' },
                    { name: 'Materials', value: 'materials' },
                    { name: 'Weapons', value: 'weapons' },
				)),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const apiUrl = `https://genshin.jmp.blue/${category}`;

        try {
            const response = await axios.get(apiUrl);
            const artifactList = response.data.map(artifact => `• ${capitalizeFirstLetter(artifact)}`).join('\n'); // Formatting each item with a bullet
            await interaction.reply(`**Info for ${category}:**\n${artifactList}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('Failed to fetch data from the API.');
        }
    },
};