const { SlashCommandBuilder } = require('discord.js');

// module.exports here is used to export data from this file in other files with require()
module.exports = {
    cooldown: 5,
    // Definition of slash command!
    data: new SlashCommandBuilder()
        .setName('hehe')
        .setDescription('Replies with questions on why user laugh?'),
    // function to execute while interacting!
    async execute(interaction) {
        await interaction.reply('Yo, what you laughing about? What so funny?');
    },
};