const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout; // For edit response and deferred response

// module.exports here is used to export data from this file in other files with require()
module.exports = {
    // Added cooldown time frame
    cooldown: 5,
    // Definition of slash command!
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with the name of the bot and basic functionalities (TBD)'),
    // function to execute while interacting!
    async execute(interaction) {
        // 1. Direct respond
        // await interaction.reply('Greetings! This is AndrewBot🥳');
        // 2. Ephemeral respond
        // await interaction.reply({ content: `Secret Hello`, ephemeral: true});
        // 3. Edit respond
        // await interaction.reply('Hello');
        // await wait(2_000); // Time to wait before response again
        // await interaction.editReply("Hello again");
        // 4. Deferred respond: asking to wait for wait seconds and respond
        // await interaction.deferReply();
        // await wait(4_000);
        // await interaction.editReply("Hello and thanks for waiting");
        // 5. Follow up
        // await interaction.reply('Greetings! This is AndrewBot🥳');
        // await interaction.followUp('Hello again');
        // 6. Fetching response
        // await interaction.reply("Hello there!");
        // const message = await interaction.fetchReply();
        // console.log(message);
        // 7. Deleting response
        await interaction.reply("Hello there");
        await wait(2_000);
        await interaction.deleteReply();
        // 8. localize respons
        // const locales = {
        //     pl: 'Witag Swiecie!',
        //     de: 'Hallo Welt!',
        // };
        // interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
    },
};