const Manager = require('./Base.js');
const CommandHandler = require('../handlers/CommandHandler.js');

module.exports = class CommandManager extends Manager {
    constructor(client) {
        super(client, {
            name: 'CommandManager'
        });

        // Handlers
        this.handler = new CommandHandler(client, this);

        // Other
        this.types = ['Information','Moderation','Config','Utilities','Economy'];
        this.cooldowns = new Map();
        this.client = client
    }

    start() {
        this.handler.loadAll();
    }

    /**
     * Checks if message is command
     * @param {Object} message
     */
    isCommand(message) {
        if (message.author.bot || !message.content.startsWith(this.client.prefix)) return false;
        else return true;
    }
}