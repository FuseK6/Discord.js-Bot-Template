const Handler = require('./BaseHandler.js');
const { readdirSync } = require('fs');

module.exports = class AliasesHandler extends Handler {
    constructor(client, manager) {
        super(client, manager);

        // Collections
        this.commands = [];
        this.validAliases = [];
        this.invalidAliases = [];
    }

    loadAll() {
        this.emit('debug', 'Loading aliases');

        this.client.commands.cache.forEach(command => {
            this.commands.push(command);

            if (command.aliases) {
                if (Array.isArray(command.aliases)) command.aliases.forEach(alias => {
                    this.manager.cache.set(alias, command.name);
                    this.validAliases.push(alias);
                }); else {
                    this.invalidAliases.push(command);
                }
            }
        });

        this.emit('debug', `Loaded ${this.validAliases.length} aliases in ${this.commands.length} commands, ${this.invalidAliases.length} errors`);
    }
}