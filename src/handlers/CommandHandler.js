const Handler = require('./BaseHandler.js');
const { readdirSync } = require('fs');
const Command = require('../commands/Command.js');

module.exports = class CommandHandler extends Handler {
    constructor(client, manager) {
        super(client, manager);

        // Collections
        this.validCommands = [];
        this.invalidCommands = [];
    }

    loadAll() {
        this.emit('debug', 'Loading commands');

        readdirSync('./src/commands/').filter(f => !f.endsWith('.js')).forEach(dir => {
            readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js')).forEach(cmd => {
                const Command = require(`../commands/${dir}/${cmd}`);
                const command = new Command(this.client, this.manager);

                if (command.name) {
                    this.validCommands.push(command);
                    this.manager.cache.set(command.name, command);
                } else {
                    this.invalidCommands.push(Command.toString());
                    this.emit('err', 'Invalid Command', `Cannot get 'command.name' from '${Command.toString()}'`);
                }
            });
        });

        this.emit('debug', `Loaded ${this.validCommands.length} commands, ${this.invalidCommands.length} errors`);
    }

    loadCommand(command, commandPath = null) {
        if (!command) return;
        if (typeof(command) === 'function') command = new command(this.client, this.manager);
        else if (!(command instanceof Command) && commandPath === null) throw new Error('Invalid command to load');
        else if (commandPath) { 
            const Command = require(commandPath); 
            command = new Command(this.client, this.manager);
        }
        
        this.manager.cache.set(command.name, command);
        this.client.emit('debug', `Lodaded command '${command.name}'`);
    }

    unloadCommand(command) {
        if (!command) return;
        if (!command.name || typeof(command) !== 'object') throw new Error('Invalid command to unload');
        if (!command.dirname || !command.reloadable) return this.client.emit('err', `Cannot unload command '${command.name}'`);

        this.manager.cache.delete(command.name);
        this.client.emit('debug', `Unloaded command '${command.name}'`);
    }
}