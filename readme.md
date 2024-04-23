# Discord Bots Creation

## This project is to create a simple discord bot with javascript

**Bot invite Link: https://discord.com/oauth2/authorize?client_id=1230287001513885712&permissions=8&scope=bot+applications.commands**

**Below list all the steps being followed to create the entire project!**

### The project folder is created with "npm init -y" (for prefilled command for initialization)

### The bot is primarily using discord.js to create
    * To install discord.js:
        * npm install discord.js

### To keep codes tidy and clean, ESLint is being used!
    * To install eslint:
        * npm install --save-dev eslint
    * All the rules are being added to .eslintrc.json file!

### Setting up bot application
    * Start by create a discord application on discord dev portal!
    * Then create a token of the bot (save this token for later use)
    * Generating Invite URL of the bot:
        * Got to OAuth2 (Sidebar)
            * Under OAuth2 URL Generator, pick "bot" and "applications.commands" (then the setting would pop up, pick base on needs)
        * Copy the URL link and put it in browser to connect to discord account
            * Then pick the server to add the bot to
                * Once authorized, the bot should be in the server directly

### From this part is about creating the bot and configuring the bots
    * For the token, make sure to put them in .env files instead and .env should be added to .gitignore to prevent pushing to public
    * Creating the main code file (index.js)
    * Once index.js is created, perform "node index.js" in terminal
        * This should say "Ready! Logged in as {Bot name}" in terminal

### Creating Slash Commands
    **Slash Command is a way for user to interact with bot directly in client application by typing in "\[Command]"**
    * To make slash commands work, 3 pieces of codes are needed!
        1. Individual Command Files: to define each commaind definition and functionalities
        2. Command Handler: read the files and execute commands
        3. Command Deployment Scrip: register slash commands with discord so they appear in the interface
    * Making the "individual command files":
        * For this part, a "SlashCommandBuilder" is used to construct the command definitions
            * Each command would at minimum has:
                * Name: .setName('Name')
                * Description: .setDescription('String defining description')
            * Each command would need a function to run too (when command is used) --> to respond to the interaction!
                * Define a execute(interaction) function and respond by:
                    * await interaction.reply("Anything you want to reply :D")
            * Both bullet points above should be in the same .js files!
        **Individual command files are stored in './commands/utility' folder**
    * Making the "Command Handling":
        * This command handling part is for creating a single command file with a giant if/else if chain to handle each command!!
        * In index.js, define:
            * fs module: to be used as a scanner to read command directory
            * path module: to find the path to access files!
            * .commands object: to be used as a way to refer to commands in other files
        * Construct a dynamically retrieval of command files in index.js (check in index.js file)
        * Add a event listener in index.js (receiving command interactions)
    * Making the "Command Deployment Script" (Registering the commands):
        * Typically command registration consists of two ways:
            1. In one specific guild (server)
            2. In every guild (server) the bot is in!
        * Doing one guild command registration first (just to test out!):
            * Create a deploy-command.js 
            * Perform "node deploy-command.js" in terminal
    *** NOTE: once there's changes on index.js, do CMD + Z to exit first, then "node index.js" again to take effect!

    * Event Handling for the bots:
        * At this point, there are:
            1. ClientReady Event: when client is ready to use --> emit once
            2. InteractionCreate Event: when interaction is received --> emit once
        * Move both event to a file in "Event" folder
            * ready.js
            * interactionCreate.js respectively
        * Then in index.js add a way to find the path to events folder and listen to the event files!
