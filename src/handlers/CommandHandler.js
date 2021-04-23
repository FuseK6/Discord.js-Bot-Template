const Handler = require('./BaseHandler.js');
const { readdirSync } = require('fs');

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
}