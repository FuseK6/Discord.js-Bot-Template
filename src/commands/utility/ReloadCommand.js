const Command = require('../Command.js');

module.exports = class Reload extends Command {
    constructor(client, manager) {
        super(client, manager, {
            name: 'reload',
            aliases: ['r', 're', 'rel'],
            description: 'Unloads and loads command again',
            ownerOnly: true,
            reloadable: false
        });
    }

    run(message, args) {
        if (!args[0]) return message.reply('Please provide a command name to reload');

        const command = this.client.commands.resolveCommand(args[0]);

        if (!command) return message.reply('Invalid command provided');
        if (!command.reloadable || !command.dirname) return message.reply(`Cannot reload command \`${command.name}\``);

        try {
            this.client.commands.handler.unloadCommand(command);
            this.client.commands.handler.loadCommand(command);
            this.client.emit('debug', `Reloaded command '${command.name}'`);
        } catch(err) {
            console.log(err)
            message.reply(`Cannot reload command \`${command.name}\`. Something went wrong`);
            this.emit('err', `Cannot reload command \`${command.name}\`` + err);
        } finally {
            return message.reply(`Reloaded comand \`${command.name}\``)
        }
    }
}