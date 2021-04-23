const { Client } = require('discord.js');
const Logger = require('./helpers/logger.js');
const CommandManager = require('./manager/CommandManager');
const AliasesManager = require('./manager/AliasesManager.js');
const EmojiManager = require('./manager/EmojiManager.js');
const EventsManager = require('./manager/EventsManager.js');

module.exports = class Bot extends Client {
    constructor(options = {}, config = {}) {
        super(options);

        // Validate all options passed
        this.validateOptions(options, config);

        // Options & Config
        this.token = config.token;
        this.owner = config.owner;
        this.prefix = config.prefix;

        // Helpers & Managers
        this.Log = new Logger();
        this.commands = new CommandManager(this);
        this.aliases = new AliasesManager(this);
        this.events = new EventsManager(this);
        this.emoji = new EmojiManager(this);
    }

    start() {
        this.commands.start();
        this.aliases.start();
        this.events.start();

        this.login(this.token);
    }

    /**
     * Validates all options provided
     * @param {Object} options 
     * @param {Object} config 
     */
    validateOptions(options, config) {
        if (typeof(options) !== 'object' || typeof(config) !== 'object') throw Error("Invalid argument given");

        if (!config) throw Error("No config given");
        if (!config.token) throw Error("No token given");
        if (!config.owner) throw Error("No owners given");
        if (!config.prefix) throw Error("No prefix given");
    }
}