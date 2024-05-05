const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
            let content = "";
            const items = response.data;

            switch (category) {
                case 'artifacts':
                    content = items.map(artifact => `• ${capitalizeFirstLetter(artifact.name)}`).join('\n');
                    break;
                case 'bosses':
                    content = items.map(boss => `• ${capitalizeFirstLetter(boss.name)}, Level: ${boss.level}`).join('\n');
                    break;
                case 'domains':
                    content = items.map(domain => `• ${capitalizeFirstLetter(domain.name)}, Type: ${domain.type}`).join('\n');
                    break;
                case 'characters':
                    content = items.map(char => `• ${capitalizeFirstLetter(char.name)}, Rarity: ${char.rarity}`).join('\n');
                    break;
                case 'consumables':
                    content = items.map(consumable => `• ${capitalizeFirstLetter(consumable.name)}, Effect: ${consumable.effect}`).join('\n');
                    break;
                case 'elements':
                    content = items.map(element => `• ${capitalizeFirstLetter(element)}`).join('\n');
                    break;
                case 'materials':
                    content = items.map(material => `• ${capitalizeFirstLetter(material.name)}, Use: ${material.use}`).join('\n');
                    break;
                case 'weapons':
                    content = items.map(weapon => `• ${capitalizeFirstLetter(weapon.name)}, Type: ${weapon.type}`).join('\n');
                    break;
                default:
                    content = "No data available for this category.";
                    break;
            }
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`List of ${capitalizeFirstLetter(category)}`)
                .setDescription(content);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('Failed to fetch data from the API.');
        }
    },
};