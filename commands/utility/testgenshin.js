const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Function to capitalize the first letter of each word and remove hyphens
function capitalizeFirstLetter(string) {
    if (!string) return ""; 
    return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testgenshin')
        .setDescription('Fetch Genshin Impact game info using a fanmade API')
        .addSubcommand(subcommand =>
            subcommand.setName('artifacts')
                .setDescription('Get information about artifacts'))
        .addSubcommand(subcommand =>
            subcommand.setName('bosses')
                .setDescription('Get information about bosses'))
        .addSubcommand(subcommand =>
            subcommand.setName('domains')
                .setDescription('Get information about domains'))
        .addSubcommand(subcommand =>
            subcommand.setName('characters')
                .setDescription('Get information about characters'))
        .addSubcommand(subcommand =>
            subcommand.setName('consumables')
                .setDescription('Get information about consumables'))
        .addSubcommand(subcommand =>
            subcommand.setName('elements')
                .setDescription('Get information about elements'))
        .addSubcommandGroup(group =>
            group.setName('materials')
                .setDescription('Get information about in game materials')
                .addSubcommand(subcommand =>
                    subcommand.setName('boss-material')
                        .setDescription('Get info for materials from bosses'))
                        // If need another level, do .addStringOption
                .addSubcommand(subcommand =>
                    subcommand.setName('character-ascension')
                        .setDescription('Get info for character ascension'))
                .addSubcommand(subcommand =>
                    subcommand.setName('character-experience')
                        .setDescription('Get info for character experience'))
                .addSubcommand(subcommand =>
                    subcommand.setName('common-ascension')
                        .setDescription('Get info for common ascension'))
                .addSubcommand(subcommand =>
                    subcommand.setName('cooking-ingredients')
                        .setDescription('Get info for cooking ingredients'))
                .addSubcommand(subcommand =>
                    subcommand.setName('local-specialties')
                        .setDescription('Get info for local specialties'))
                .addSubcommand(subcommand =>
                    subcommand.setName('talent-book')
                        .setDescription('Get info for talent book'))
                .addSubcommand(subcommand =>
                    subcommand.setName('talent-boss')
                        .setDescription('Get info for talent boss'))
                .addSubcommand(subcommand =>
                    subcommand.setName('weapon-ascension')
                        .setDescription('Get info for weapon ascension'))
                .addSubcommand(subcommand =>
                    subcommand.setName('weapon-experience')
                        .setDescription('Get info for weapon experience'))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('weapons')
                .setDescription('Get information about weapons')),
    async execute(interaction) {
        const group = interaction.options.getSubcommandGroup(false); // FOr material category, will be null if not material
        const subcommand = interaction.options.getSubcommand();
        let apiUrl = `https://genshin.jmp.blue/`;

        if (group) {
            // group is the material
            // subcommand is the small subcommand in material
            apiUrl += `${group}/${subcommand}`; // Add the choices to url
        } else {
            apiUrl += `${subcommand}`; // Normal append
        }

        try {
            const response = await axios.get(apiUrl);
            //console.log(response.data);
            let content = "";
            const items = response.data;
            
            if (group === 'materials') {
                switch (subcommand) {
                    // Have name, source and array of cahracter
                    case 'boss-material':
                        // Item
                        for (const key in items) {
                            const item = items[key];
                            const characters = item.characters.join(', ');
                            content += `**${item.name}**\nSource: ${item.source}\nCharacters: ${characters}\n\n`;
                        }
                        break;
                    case 'character-ascension':
                        // Item
                        break;
                    case 'character-experience':
                        for (const item of items.items) {
                            // Ensure that all properties exist and are correctly referenced
                            if (item && item.name && typeof item.experience === 'number' && typeof item.rarity === 'number') {
                                content += `**${item.name}**\nExperience: ${item.experience} XP\nRarity: ${'★'.repeat(item.rarity)} (${item.rarity})\n\n`;
                            }
                        }
                        break;
                    case 'common-ascension':
                        // Item
                        break;
                    case 'cooking-ingredients':
                        // Item
                        break;
                    case 'local-specialties':
                        // Item
                        // the key is regions
                        // value is array of dictionary
                            // dictionary: name
                            // characters
                        for (const region in items) {
                            if (items.hasOwnProperty(region)) {
                                content += `**${region.charAt(0).toUpperCase() + region.slice(1)} Specialties:**\n`; // Capitalize the region name
                                for (const specialty of items[region]) {
                                    const characters = specialty.characters.join(', ');
                                    content += `• **${specialty.name}**: Used by ${characters}\n`;
                                }
                                content += '\n'; // Add a newline for spacing between regions
                            }
                        }                    
                        break;
                    case 'talent-book':
                        // Item
                        break;
                    case 'talent-boss':
                        // Item
                        break;
                    case 'weapon-ascension':
                        // Item
                        break;
                    case 'weapon-experience':
                        // Item
                        break;
                    default:
                        content = "No specific data available for this subcategory.";
                        break;
                }
            } else {
                switch (subcommand) {
                    case 'artifacts':
                        content = items.map(artifact => `• ${capitalizeFirstLetter(artifact)}`).join('\n');
                        break;
                    case 'bosses':
                        content = items.map(boss => `• ${capitalizeFirstLetter(boss.name)}, Level: ${boss.level}`).join('\n');
                        break;
                    case 'domains':
                        content = items.map(domain => `• ${capitalizeFirstLetter(domain)}`).join('\n');
                        break;
                    case 'characters':
                        content = items.map(char => `• ${capitalizeFirstLetter(char.name)}`).join('\n');
                        break;
                    case 'consumables':
                        content = items.map(consumable => `• ${capitalizeFirstLetter(consumable.name)}, Effect: ${consumable.effect}`).join('\n');
                        break;
                    case 'elements':
                        content = items.map(element => `• ${capitalizeFirstLetter(element)}`).join('\n');
                        break;
                    case 'weapons':
                        content = items.map(weapon => `• ${capitalizeFirstLetter(weapon)}`).join('\n');
                        break;
                    default:
                        content = "No data available for this category.";
                        break;
                }
            }
        
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`List of ${capitalizeFirstLetter(subcommand)}`)
                .setDescription(content);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('Failed to fetch data from the API.');
        }
    },
};
