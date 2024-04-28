const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
        // Option 1
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true)) // THis make the option required!
        // Option 2
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
                // Since missing the .setRequired, this only needed when user select
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
        async execute(interaction) {
            // CommandInteractionOptionResolver#get___()
                // Primitive type: String, Integer, Number, Boolean
                // Discordjs: User, Channel, Role, Mentionable
            // Getting the value of two option by using the CommandInteractionOptionResolver
            const target = interaction.options.getUser('target'); // use the option name!
            // This option is not required, so "??"(Nullish coalescing operator) is used to set default incase user does not provide
            // This is essentially saying option provided? --> Yes (got the reason), No? (No reason provided)
            const reason = interaction.options.getString('reason') ?? 'No reason provided'; 
    
            await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
            await interaction.guild.members.ban(target);
        },
};