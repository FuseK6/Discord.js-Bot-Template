const Command = require('../Command.js');

module.exports = class Test extends Command {
    constructor(client, manager) {
        super(client, manager, {
            name: 'test',
            aliases: ['t', 'example'],
            description: 'Example and test command'
        });
    }

    run(message, args) {
        return message.reply(':>');
    }
}