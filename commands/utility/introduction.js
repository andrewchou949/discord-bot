const { SlashCommandBuilder } = require('discord.js');

// module.exports here is used to export data from this file in other files with require()
module.exports = {
    // Definition of slash command!
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with the name of the bot and basic functionalities (TBD)'),
    // function to execute while interacting!
    async execute(interaction) {
        await interaction.reply('Greetings! This is AndrewBot🥳');
    },
};