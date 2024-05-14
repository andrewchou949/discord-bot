const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const MAX_EMBED_DESCRIPTION_LENGTH = 4096; // Discord's limit for embed descriptions
const EMBED_COLOR = '#0099ff';

let characterCache = ['Amber', 'Albedo']; // Cache for storing character data

// Function to fetch all characters from the API and refresh the cache
async function refreshCharacterCache() {
    try {
        const response = await axios.get('https://genshin-api.com/api/characters');
        characterCache = response.data.map(char => char.name);
    } catch (error) {
        console.error('Failed to fetch characters:', error.message);
        // Adding sample data for testing purposes
        characterCache = ['Amber', 'Barbara', 'Chongyun', 'Diluc', 'Eula', 'Fischl', 'Ganyu', 'Hu Tao', 'Jean', 'Keqing', 'Lisa', 'Mona', 'Ningguang', 'Qiqi', 'Razor', 'Sucrose', 'Tartaglia', 'Venti', 'Xiangling', 'Xiao', 'Xingqiu', 'Zhongli'];
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
                .setDescription('Enter the name of the character')
                .setAutocomplete(true))
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
        .addSubcommandGroup(group =>
            group.setName('materials')
                .setDescription('Get information about in game materials')
                .addSubcommand(subcommand =>
                    subcommand.setName('boss-material')
                        .setDescription('Get info for materials from bosses'))
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
        const group = interaction.options.getSubcommandGroup(false); // For material category, will be null if not material
        const subcommand = interaction.options.getSubcommand();
        let apiUrl = `https://genshin.jmp.blue/`;

        if (group) {
            apiUrl += `${group}/${subcommand}`; // Add the choices to URL
        } else {
            apiUrl += `${subcommand}`; // Normal append
        }

        await interaction.deferReply();

        try {
            const response = await axios.get(apiUrl);
            let content = "";
            const items = response.data;

            if (group === 'materials') {
                switch (subcommand) {
                    case 'boss-material':
                        for (const key in items) {
                            const item = items[key];
                            const formattedCharacters = item.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                            content += `**${item.name}**\nSource: ${item.source}\nCharacters: ${formattedCharacters}\n\n`;
                        }
                        break;
                    case 'character-ascension':
                        for (const elementType in items) {
                            const elementInfo = items[elementType];
                            content += `**${capitalizeFirstLetter(elementType)} Ascension Materials:**\n`;
                            for (const stage in elementInfo) {
                                const material = elementInfo[stage];
                                content += `• **${material.name}**\nRarity: ${'★'.repeat(material.rarity)}\nSources: ${material.sources.join(", ")}\n\n`;
                            }
                            content += '\n'; 
                        }
                        break;
                    case 'character-experience':
                        for (const item of items.items) {
                            if (item && item.name && typeof item.experience === 'number' && typeof item.rarity === 'number') {
                                content += `**${item.name}**\nExperience: ${item.experience} XP\nRarity: ${'★'.repeat(item.rarity)} (${item.rarity})\n\n`;
                            }
                        }
                        break;
                    case 'common-ascension':
                        for (const materialType in items) {
                            const materialInfo = items[materialType];
                            content += `**${capitalizeFirstLetter(materialType.replace(/-/g, ' '))}**\n`;                
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
                        for (const ingredientKey in items) {
                            const ingredient = items[ingredientKey];
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
                        for (const region in items) {
                            if (items.hasOwnProperty(region)) {
                                content += `**${capitalizeFirstLetter(region)} Specialties:**\n`;
                                for (const specialty of items[region]) {
                                    const formattedCharacters = specialty.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                                    content += `• **${specialty.name}**: Used by ${formattedCharacters}\n`;
                                }
                                content += '\n';
                            }
                        }                    
                        break;
                    case 'talent-book':
                        for (const bookType in items) {
                            const bookInfo = items[bookType];
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
                        for (const boss in items) {
                            const bossInfo = items[boss];
                            const formattedCharacters = bossInfo.characters.map(char => capitalizeFirstLetter(char.replace(/-/g, ' '))).join(", ");
                            content += `**${bossInfo.name}**\nCharacters: ${formattedCharacters}\n\n`;
                        }
                        break;
                    case 'weapon-ascension':
                        for (const category in items) {
                            const categoryInfo = items[category];
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
                        for (const item of items.items) {
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
            } else if (group === 'consumables') {
                switch (subcommand) {
                    case 'food':
                        for (const foodKey in items) {
                            const food = items[foodKey];
                            content += `**${food.name}**\nType: ${food.type}\nEffect: ${food.effect}\nRarity: ${'★'.repeat(food.rarity)} (${food.rarity})\nDescription: ${food.description}\n`;
                            if (food.hasRecipe) {
                                content += "Recipe:\n";
                                food.recipe.forEach(ingredient => {
                                    content += `• **${ingredient.item}**: ${ingredient.quantity}\n`;
                                });
                            } else {
                                content += "No recipe available.\n";
                            }
                            if (food.proficiency !== undefined) {
                                content += `Proficiency: ${food.proficiency}\n\n`;
                            } else {
                                content += `Proficiency: Unknown\n\n`;
                            }
                        }
                        break;
                    case 'potions':
                        for (const potionKey in items) {
                            const potion = items[potionKey];
                            content += `**${capitalizeFirstLetter(potion.name)}**\nEffect: ${potion.effect}\nRarity: ${'★'.repeat(potion.rarity)} (${potion.rarity})\n`;
                            content += "Crafting:\n";
                            potion.crafting.forEach(ingredient => {
                                content += `• **${ingredient.item}**: ${ingredient.quantity}\n`;
                            });
                            content += `Cost: ${potion.crafting.find(item => item.item === "Mora").quantity} Mora\n\n`;
                        }
                        break;
                    default:
                        content = "No data available for this category.";
                        break;
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
                    case 'consumables':
                        content = items.map(consumable => `• ${capitalizeFirstLetter(consumable)}, Effect: ${consumable.effect}`).join('\n');
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
        if (interaction.commandName === 'testgenshin' && interaction.options.getSubcommand() === 'characters') {
            const focusedOption = interaction.options.getFocused(true);
            if (focusedOption.name === 'name') {
                const filteredCharacters = characterCache.filter(char => char.toLowerCase().includes(focusedOption.value.toLowerCase()));
                await interaction.respond(
                    filteredCharacters.slice(0, 25).map(name => ({ name, value: name }))
                );
            }
        }
    }
};

// Refresh the character cache when the bot starts
refreshCharacterCache().then(() => console.log('Character cache loaded')).catch(err => console.error('Failed to load character cache:', err));