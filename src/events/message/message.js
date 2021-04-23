const Event = require('../Event');

module.exports = class MessageEvent extends Event {
    constructor(client, manager) {
        super(client, manager, {
            name: 'message'
        });
    }

    async run(client, message) {
        if (!client.commands.isCommand(message)) return;

        const args = this.parseArgs(message);
        const cmd = this.parseCmd(args);

        if (cmd.length === 0) return;

        const command = this.client.commands.cache.get(cmd) || this.client.commands.cache.get(client.aliases.cache.get(cmd));

        if (!command) return message.reply("Can't find that command");
        if (!command.checkPermissions(message)) return;

        command.run(message, args);
    }

    parseArgs(message) {
        if (!message) return;

        return message.content.slice(this.client.prefix.length).trim().split(/ +/g);
    }

    parseCmd(args) {
        if (!args) return;

        return args.shift().toLowerCase();
    }
}