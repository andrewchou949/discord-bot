# Discord Bots Creation

## This project is to create a simple discord bot with javascript

**Below list all the steps being followed to create the entire project!**

### The project folder is created with "npm init -y" (for prefilled command for initialization)

### The bot is primarily using discord.js to create
    ### To install discord.js:
        ### * npm install discord.js

### To keep codes tidy and clean, ESLint is being used!
    ### To install eslint:
        ### * npm install --save-dev eslint
    ### All the rules are being added to .eslintrc.json file!

### Setting up bot application
    ### Start by create a discord application on discord dev portal!
    ### Then create a token of the bot (save this token for later use)
    ### Generating Invite URL of the bot:
        ### * Got to OAuth2 (Sidebar)
            ### * Under OAuth2 URL Generator, pick "bot" and "applications.commands" (then the setting would pop up, pick base on needs)
        ### * Copy the URL link and put it in browser to connect to discord account
            ### * Then pick the server to add the bot to
                ### * Once authorized, the bot should be in the server directly

### From this part is about creating the bot and configuring the bots
    ### For the token, make sure to put them in .env files instead and .env should be added to .gitignore to prevent pushing to public
    ### Creating the main code file (index.js)