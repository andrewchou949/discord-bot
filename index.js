// These two are for commands portion! (Command Handling :D)
const fs = require('node:fs'); // --> to be used as Node's native file system module --> to read "commands" directory and identify command files
const path = require('node:path'); // -->Path utility --> construct path to access files and directories. (This will adjust the joiner automatically based on OS you're on :D)

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Load env variable from .env
require('dotenv').config();

// If loading from config.json file
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// defining a command object!
client.commands = new Collection(); // --> This way, we can refer to commands in other files too!
client.cooldowns = new Collection();

// Dynamically retrive commands
const foldersPath = path.join(__dirname, 'commands'); // --> construct path to 'commands' directory
const commandFolders = fs.readdirSync(foldersPath).filter(folder => {
    const folderPath = path.join(foldersPath, folder);
    return fs.statSync(folderPath).isDirectory();
}); // --> read path to directory and return an array of all folder names in it! (['utility'])

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // --> this read all the .js command files in utility folder!
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // This is confirming that each command has at least data and execute in it (a complete command only)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Moved to events/ready.js
// // When the client is ready, run this code (only once).
// // ClientReady event listener
// client.once(Events.ClientReady, readyClient => {
// 	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });


// Moved to interactionCreate.js
// // Event Listener (For each command) --> For Client#event:interactionCreate event
// // Executing Commands --> Use the #event:interactionCreate to execute the requested commands
// client.on(Events.InteractionCreate, async interaction => {
//     // Only Listen to when it's actually interaction for command!
//     if (!interaction.isChatInputCommand()) return; // --> exiting if not command type response
    
//     const command = client.commands.get(interaction.commandName);

//     if (!command) {
//         console.error(`No command matchin ${interaction.commandName} was found.`);
//         return;
//     }

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         if (interaction.replied || interaction.deferred) {
//             await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
//         } else {
//             await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
//         }
//     }
// });

// Reading through events file --> listening to each event
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);