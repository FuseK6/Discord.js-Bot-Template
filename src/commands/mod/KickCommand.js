const Command = require('../Command.js');
const { MessageEmbed } = require("discord.js");

module.exports = class Kick extends Command {
    constructor(client, manager) {
        super(client, manager, {
            name: 'kick',
            aliases: ['k'],
            description: 'Kicks member from a guild',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            reloadable: true,
            dirname: __dirname
        });
    }

    async run(message, args) {
        if (!args[0]) return message.reply('Please give the user');

        const member = await this.resolveMember(args[0], message.guild);

        if (!member) return message.reply('No user found');
        if (this.isGuildOwner(message.guild, member)) return message.reply('Cannot kick guild owner');
        if (member.kickable) return message.reply('Cannot kick this user');

        const reason = args.slice(1).join(" ") || 'No reason given';
        const displayReason = this.client.util.reduceString(reason, 23);
        const kickedByTag = this.getTag(message.author);
        const kickedTag = this.getTag(member);
        const kickedId = member.id;

        try {
            const toUserEmbed = new MessageEmbed()
                .setTitle('Kick')
                .setColor('RED')
                .addField('Server', message.guild.name)
                .addField('Kicked by', kickedByTag)
                .addField('Reason', displayReason);
            
            member.send(toUserEmbed).catch(err => {
                message.channel.send('Cannot send private message to the user');
            });

            await member.kick();
            this.client.emit('debugLog', `Kicked '${kickedTag}(${kickedId})' from '${message.guild.name}(${message.guild.id})'`)
        } finally {
            const embed = new MessageEmbed()
                .setTitle('Kicked')
                .setColor('RED')
                .addField('Kicked', kickedTag)
                .addField('Kicked by', kickedByTag)
                .addField('Reason', displayReason);

            return message.channel.send(embed);
        }
    }
}