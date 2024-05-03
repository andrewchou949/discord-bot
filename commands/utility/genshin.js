// EmbedBuilder is for the each data showing grid
// ActionRowBuilder, ButtonBuilder, ButtonStyle is for choice selection of materials
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); // For api requesting

// Cap first letter and remove -
function capitalizeFirstLetter(string) {
    return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Material needs further choice selection!
// "boss-material","character-ascension",
// "character-experience","common-ascension",
// "cooking-ingredients","local-specialties","talent-book",
//"talent-boss","weapon-ascension",""]
function createMaterialButtons() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('boss-material')
                .setLabel('Boss Materials')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('character-ascension')
                .setLabel('Character Ascension')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('character-experience')
                .setLabel('Character Experience')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('common-ascension')
                .setLabel('Common Ascension')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('cooking-ingredients')
                .setLabel('Cooking Ingredients')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('local-specialties')
                .setLabel('Local Specialties')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('talent-book')
                .setLabel('Talent Book')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('weapon-ascension')
                .setLabel('Weapon Ascension')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('weapon-experience')
                .setLabel('Weapon Experience')
                .setStyle(ButtonStyle.Primary),
        );
}

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
        // Raw json format!
        // try {
        //     const response = await axios.get(apiUrl);
        //     const data = response.data; // Assuming the API returns JSON data
        //     console.log(data); // Log the data to the console
        //     await interaction.reply(`Info for ${category}: ${JSON.stringify(data)}`);
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        //     await interaction.reply('Failed to fetch data from the API.');
        // }
        try {
            const response = await axios.get(apiUrl);
            let content;

            switch (category) {
                case 'artifacts':
                    content = "**List of Artifacts:**\n" + response.data.map(item => `• ${capitalizeFirstLetter(item)}`).join('\n');
                    break;
                case 'domains':
                    content = "**List of Domains:**\n" + response.data.map(domain => `• ${capitalizeFirstLetter(domain)}`).join('\n');
                    break;
                case 'characters':
                    content = "**List of Characters:**\n" + response.data.map(character => `• ${capitalizeFirstLetter(character)}`).join('\n');
                    break;
                // need further breakdown since there's more categories
                case 'consumables':
                    content = "**List of Consumables:**\n" + response.data.map(consume => `• ${capitalizeFirstLetter(consume)}`).join('\n');
                    break;
                case 'elements':
                    content = "**List of Supported Elements:**\n" + response.data.map(elements => `• ${capitalizeFirstLetter(elements)}`).join('\n');
                    break;
                // need further breakdown!
                // After material, it has mutliple categories.
                case 'materials':
                    content = "**List of Materials:**\n" + response.data.map(material => `• ${capitalizeFirstLetter(material)}`).join('\n');
                    break;
                case 'weapons':
                    content = "**List of Weapons:**\n" + response.data.map(weapons => `• ${capitalizeFirstLetter(weapons)}`).join('\n');
                    break;
                default:
                    content = "Unsupported category.";
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                //.setTitle(`Info for ${capitalizeFirstLetter(category)}`)
                .setDescription(content);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('Failed to fetch data from the API.');
        }

    },
};