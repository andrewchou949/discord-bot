const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const MAX_EMBED_DESCRIPTION_LENGTH = 4096; // Discord's limit for embed descriptions
const EMBED_COLOR = '#0099ff';

let materialsCache = [];

// Function to fetch all materials from the API and refresh the cache
async function refreshMaterialsCache() {
    try {
        const response = await axios.get('https://genshin.jmp.blue/materials');
        materialsCache = response.data;
        console.log('Materials cache after fetch:', materialsCache); // Log the materials cache after fetch
    } catch (error) {
        console.error('Failed to fetch materials:', error.message);
        // Adding sample data for testing purposes
        materialsCache = [
            'boss-material',
            'character-ascension',
            'character-experience',
            'common-ascension',
            'cooking-ingredients',
            'local-specialties',
            'talent-book',
            'talent-boss',
            'weapon-ascension',
            'weapon-experience'
        ];
    }
}


// Utility function to capitalize the first letter of each word and remove hyphens
function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.split('-').join(' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Function to create multiple embeds from a large content string
function createEmbeds(title, content) {
    let embeds = [], currentContent = "";
    for (const section of content.split('\n\n')) {
        if (currentContent.length + section.length + 2 > MAX_EMBED_DESCRIPTION_LENGTH) {
            embeds.push(new EmbedBuilder().setColor(EMBED_COLOR).setDescription(currentContent));
            currentContent = "";
        }
        currentContent += `${section}\n\n`;
    }
    if (currentContent.length > 0) {
        embeds.push(new EmbedBuilder().setColor(EMBED_COLOR).setDescription(currentContent));
    }
    if (embeds.length === 0) {
        embeds.push(new EmbedBuilder().setColor(EMBED_COLOR).setDescription("No information available."));
    }
    embeds[0].setTitle(title);
    return embeds;
}

// For sending multiple embeds to get around the 6000 character limit on Discord
async function sendEmbedsInChunks(interaction, embeds) {
    await interaction.editReply({ embeds: [embeds.shift()] });
    for (const embed of embeds) {
        await interaction.followUp({ embeds: [embed] });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testgenshin')
        .setDescription('Fetch Genshin Impact game info using a fanmade API')
        .addSubcommand(subcommand =>
            subcommand.setName('characters')
                .setDescription('Get information about characters')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Enter the name of the character'))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('artifacts')
                .setDescription('Get information about artifacts'))
        .addSubcommand(subcommand =>
            subcommand.setName('bosses')
                .setDescription('Get information about bosses'))
        .addSubcommand(subcommand =>
            subcommand.setName('domains')
                .setDescription('Get information about domains'))
        .addSubcommandGroup(group =>
            group.setName('consumables')
                .setDescription('Get information about consumables')
                .addSubcommand(subcommand =>
                    subcommand.setName('food')
                        .setDescription('Get info about Food Type consumables'))
                .addSubcommand(subcommand =>
                    subcommand.setName('potions')
                        .setDescription('Get info about Potions type consumables'))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('elements')
                .setDescription('Get information about elements'))
        .addSubcommand(subcommand =>
            subcommand.setName('materials')
                .setDescription('Get information about materials')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Enter the name of the material')
                        .setAutocomplete(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('weapons')
                .setDescription('Get information about weapons')),
        async execute(interaction) {
            const subcommand = interaction.options.getSubcommand();
            let apiUrl = `https://genshin.jmp.blue/`;
        
            if (subcommand === 'materials') {
                const materialName = interaction.options.getString('name');
                apiUrl += `materials/${materialName.replace(/\s+/g, '-').toLowerCase()}`;
            } else {
                apiUrl += `${subcommand}`;
            }
        
            await interaction.deferReply();
        
            try {
                const response = await axios.get(apiUrl);
                let content = "";
                const items = response.data;
        
                console.log('Fetched items:', items); // Debugging statement to check the fetched data
        
                if (subcommand === 'materials') {
                    // Handle different material types based on fetched data
                    // Adjust based on the fetched data structure
        
                    for (const materialType in items) {
                        if (items.hasOwnProperty(materialType)) {
                            switch (materialType) {
                                case 'boss-material':
                                    for (const key in items[materialType]) {
                                        const item = items[materialType][key];
                                        const formattedCharacters = item.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                        content += `**${item.name}**\nSource: ${item.source}\nCharacters: ${formattedCharacters}\n\n`;
                                    }
                                    break;
                                case 'character-ascension':
                                    for (const elementType in items[materialType]) {
                                        const elementInfo = items[materialType][elementType];
                                        content += `**${capitalizeFirstLetter(elementType)} Ascension Materials:**\n`;
                                        for (const stage in elementInfo) {
                                            const material = elementInfo[stage];
                                            content += `• **${material.name}**\nRarity: ${'★'.repeat(material.rarity)}\nSources: ${material.sources.join(", ")}\n\n`;
                                        }
                                        content += '\n';
                                    }
                                    break;
                                case 'character-experience':
                                    for (const item of items[materialType].items) {
                                        if (item && item.name && typeof item.experience === 'number' && typeof item.rarity === 'number') {
                                            content += `**${item.name}**\nExperience: ${item.experience} XP\nRarity: ${'★'.repeat(item.rarity)} (${item.rarity})\n\n`;
                                        }
                                    }
                                    break;
                                case 'common-ascension':
                                    for (const materialKey in items[materialType]) {
                                        const materialInfo = items[materialType][materialKey];
                                        content += `**${capitalizeFirstLetter(materialKey.replace(/-/g, ' '))}**\n`;
                                        if (materialInfo.characters && Array.isArray(materialInfo.characters)) {
                                            const formattedCharacters = materialInfo.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                            content += `Characters: ${formattedCharacters}\n`;
                                        } else {
                                            content += `Characters: None\n`;
                                        }
                                        if (materialInfo.weapons && Array.isArray(materialInfo.weapons)) {
                                            const formattedWeapons = materialInfo.weapons.map(weapon => capitalizeFirstLetter(weapon.replace(/-/g, ' '))).join(", ");
                                            content += `Weapons: ${formattedWeapons}\n`;
                                        } else {
                                            content += `Weapons: None\n`;
                                        }
                                        content += "Items:\n";
                                        if (materialInfo.items && Array.isArray(materialInfo.items)) {
                                            materialInfo.items.forEach(item => {
                                                content += `• **${item.name}**: Rarity ${'★'.repeat(item.rarity)}\n`;
                                            });
                                        }
                                        if (materialInfo.sources && Array.isArray(materialInfo.sources)) {
                                            const sourcesList = materialInfo.sources.join(", ");
                                            content += `Sources: ${sourcesList}\n\n`;
                                        } else {
                                            content += `Sources: None\n\n`;
                                        }
                                    }
                                    break;
                                case 'cooking-ingredients':
                                    for (const ingredientKey in items[materialType]) {
                                        const ingredient = items[materialType][ingredientKey];
                                        content += `**${capitalizeFirstLetter(ingredient.name)}**\n`;
                                        content += `Description: ${ingredient.description}\n`;
                                        if (ingredient.rarity) {
                                            content += `Rarity: ${'★'.repeat(ingredient.rarity)} (${ingredient.rarity})\n`;
                                        }
                                        if (ingredient.sources && Array.isArray(ingredient.sources)) {
                                            const sourcesList = ingredient.sources.join(", ");
                                            content += `Sources: ${sourcesList}\n\n`;
                                        } else {
                                            content += `Sources: Not available\n\n`;
                                        }
                                    }
                                    break;
                                case 'local-specialties':
                                    for (const region in items[materialType]) {
                                        if (items[materialType].hasOwnProperty(region)) {
                                            content += `**${capitalizeFirstLetter(region)} Specialties:**\n`;
                                            for (const specialty of items[materialType][region]) {
                                                const formattedCharacters = specialty.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                                content += `• **${specialty.name}**: Used by ${formattedCharacters}\n`;
                                            }
                                            content += '\n';
                                        }
                                    }
                                    break;
                                case 'talent-book':
                                    for (const bookType in items[materialType]) {
                                        const bookInfo = items[materialType][bookType];
                                        content += `**${capitalizeFirstLetter(bookType)}**\n`;
                                        content += `Source: ${capitalizeFirstLetter(bookInfo.source)}\n`;
                                        content += `Availability: ${bookInfo.availability.join(", ")}\n`;
                                        const formattedCharacters = bookInfo.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                        content += `Characters: ${formattedCharacters}\n`;
                                        content += "Items:\n";
                                        for (const item of bookInfo.items) {
                                            content += `• **${item.name}**: Rarity ${'★'.repeat(item.rarity)} (${item.rarity})\n`;
                                        }
                                        content += "\n";
                                    }
                                    break;
                                case 'talent-boss':
                                    for (const boss in items[materialType]) {
                                        const bossInfo = items[materialType][boss];
                                        const formattedCharacters = bossInfo.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                        content += `**${bossInfo.name}**\nCharacters: ${formattedCharacters}\n\n`;
                                    }
                                    break;
                                case 'weapon-ascension':
                                    for (const category in items[materialType]) {
                                        const categoryInfo = items[materialType][category];
                                        content += `**${capitalizeFirstLetter(category)}**\n`;
                                        content += `Source: ${capitalizeFirstLetter(categoryInfo.source)}\n`;
                                        content += `Availability: ${categoryInfo.availability.join(", ")}\n`;
                                        const formattedWeapons = categoryInfo.weapons.map(weapon => capitalizeFirstLetter(weapon.replace(/-/g, ' '))).join(", ");
                                        content += `Weapons: ${formattedWeapons}\nItems:\n`;
                                        for (const item of categoryInfo.items) {
                                            content += `• **${item.name}**: Rarity ${'★'.repeat(item.rarity)} (${item.rarity})\n`;
                                        }
                                        content += "\n";
                                    }
                                    break;
                                case 'weapon-experience':
                                    for (const item of items[materialType].items) {
                                        content += `**${capitalizeFirstLetter(item.name)}**\n`;
                                        content += `Experience: ${item.experience} XP\n`;
                                        content += `Rarity: ${'★'.repeat(item.rarity)} (${item.rarity})\n`;
                                        if (item.source && Array.isArray(item.source)) {
                                            const sourcesList = item.source.join(", ");
                                            content += `Source: ${sourcesList}\n\n`;
                                        } else {
                                            content += `Source: Not available\n\n`;
                                        }
                                    }
                                    break;
                                default:
                                    content = "No specific data available for this subcategory.";
                                    break;
                            }
                        }
                    }
                } else {
                    switch (subcommand) {
                        case 'artifacts':
                            content = items.map(artifact => `• ${capitalizeFirstLetter(artifact)}`).join('\n');
                            break;
                        case 'domains':
                            content = items.map(domain => `• ${capitalizeFirstLetter(domain)}`).join('\n');
                            break;
                        case 'characters':
                            content = items.map(char => `• ${capitalizeFirstLetter(char)}`).join('\n');
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
        
                const embeds = createEmbeds(`List of ${capitalizeFirstLetter(subcommand)}`, content);
                if (embeds.length > 1) {
                    await sendEmbedsInChunks(interaction, embeds);
                } else {
                    await interaction.editReply({ embeds });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                await interaction.editReply('Failed to fetch data from the API.');
            }
        },
    async autocomplete(interaction) {
        if (interaction.commandName === 'testgenshin' && interaction.options.getSubcommand() === 'materials') {
            const focusedOption = interaction.options.getFocused(true);
            console.log('Focused option:', focusedOption); // Log the focused option
            console.log('Materials cache:', materialsCache); // Log the materials cache
    
            let filteredMaterials = [];
            if (focusedOption.value) {
                filteredMaterials = materialsCache.filter(mat =>
                    mat.toLowerCase().includes(focusedOption.value.toLowerCase())
                );
            } else {
                // If the input is empty, return all options (or the first 25)
                filteredMaterials = materialsCache.slice(0, 25);
            }
    
            console.log('Filtered materials:', filteredMaterials); // Log the filtered materials
    
            await interaction.respond(filteredMaterials.map(mat => ({
                name: mat,
                value: mat
            })));
        }
    }
};

// Refresh the materials cache when the bot starts
refreshMaterialsCache().then(() => console.log('Materials cache loaded')).catch(err => console.error('Failed to load materials cache:', err));
