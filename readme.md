# Discord Bot

This Discord bot is designed to provide various functionalities to enhance the user experience on Discord servers. It features command handling, event management, and easy deployment.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features
- Command Handling
- Event Management
- Easy Deployment

## Installation

### Prerequisites
- Node.js
- npm (Node Package Manager)
- Discord account and server
- Discord Bot Token

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/andrewchou949/discord-bot.git
    cd discord-bot
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Set up your environment variables:
   - Create a `.env` file in the root directory and add your Discord Bot Token:
     ```env
     DISCORD_TOKEN=your_discord_bot_token
     ```

## Usage
1. Deploy the commands to your Discord server:
    ```bash
    node deploy-commands.js
    ```
2. Run the bot:
    ```bash
    node index.js
    ```

## Project Structure
```plaintext
discord-bot
├── .DS_Store
├── .eslintrc.json                # ESLint configuration file
├── .gitignore                    # Git ignore file
├── commands                      # Directory for command modules
│   └── ...                       # Command files
├── deploy-commands.js            # Script to deploy commands to Discord
├── events                        # Directory for event modules
│   └── ...                       # Event files
├── index.js                      # Main bot file
├── node_modules                  # Node.js modules
├── package-lock.json             # Package lock file
├── package.json                  # Node.js package configuration
├── readme.md                     # Project readme
├── requirements.txt              # Requirements for deployment
```

### Components
- **commands/**: Contains individual command modules.
- **events/**: Includes event handling modules.
- **index.js**: The entry point for the bot.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.