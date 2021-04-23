const permissions = require('../assets/permissions');

module.exports = class Command {
    constructor(client, manager, options) {

        // Validate all options passed
        this.constructor.validateOptions(client, manager, options);

        this.client = client;
        this.manager = manager;
        this.name = options.name.toString();
        this.aliases = options.aliases || null;
        this.usage = options.usage || options.name;
        this.description = options.description || null;
        this.details = options.details || null;
        this.type = options.type || 'Unknown'
        this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];
        this.userPermissions = options.userPermissions || null;
        this.examples = options.examples || null;
        this.ownerOnly = options.ownerOnly || false;
        this.disabled = options.disabled || false;
        this.cooldown = options.cooldown || 3000;
        this.guildOnly = options.guildOnly || true;
        this.nsfw = options.nsfw || false;
        this.hidden = options.hidden || false;
        this.dirname = options.dirname;
        this.reloadable = options.dirname ? true : false;
    }

    /**
     * Runs the command
     * @param {Message} message 
     * @param {string[]} args 
     */
    run(message, args, data) {
        throw new Error(`The ${this.name} command has no run() method`);
    }

    async resolveMember(search, guild) {
        let member = guild.members.cache.get(search) || this.getMemberFromMention(search) || guild.members.cache.find(u => this.getUserName(u).toLowerCase() === search.toLowerCase());

        if (!member) member = await this.client.users.fetch(search);

        return member;
    } 

    /**
     * Gets member from mention
     * @param {Message} message 
     * @param {string} mention 
     */
    getMemberFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.members.cache.get(id);
    }

    /**
     * Gets role from mention
     * @param {Message} message 
     * @param {string} mention 
     */
    getRoleFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<@&(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.roles.cache.get(id);
    }

    /**
     * Gets text channel from mention
     * @param {Message} message 
     * @param {string} mention 
     */
    getChannelFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<#(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.channels.cache.get(id);
    }

    /**
     * Checks client and users permissions
     * @param {Message} message 
     * @param {boolean} ownerOverride 
     */
    checkPermissions(message, ownerOverride = true) {
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return false;
        const clientPermission = this.checkClientPermissions(message);
        const userPermission = this.checkUserPermissions(message, ownerOverride);
        if (clientPermission && userPermission) return true;
        else return false;
    }

    /**
     * Checks the user permissions
     * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
     * @param {Message} message 
     * @param {boolean} ownerOverride 
     */
    checkUserPermissions(message, ownerOverride = true) {
        if (!this.ownerOnly && !this.userPermissions) return true;
        if (ownerOverride && this.client.isOwner(message.author)) return true;
        if (this.ownerOnly && !this.client.isOwner(message.author)) {
            return false;
        }

        if (message.member.hasPermission('ADMINISTRATOR')) return true;
        if (this.userPermissions) {
            console.log(this.userPermission)
            const missingPermissions =
                message.channel.permissionsFor(message.member).missing(this.userPermissions).map(p => permissions[p]);
            if (missingPermissions.length !== 0) {
                message.reply('You don\'t have permissions');
                return false;
            }
        }
        return true;
    }

    /**
     * Checks the client permissions
     * @param {Message} message 
     * @param {boolean} ownerOverride 
     */
    checkClientPermissions(message) {
        if (message.guild.me.hasPermission('ADMINISTRATOR')) return true;

        const missingPermissions =
            message.channel.permissionsFor(message.guild.me).missing(this.clientPermissions).map(p => permissions[p]);
        if (missingPermissions.length !== 0) {
            message.reply('I don\'t have permissions');
            return false;

        } else return true;
    }

    /**
   * Validates all options provided
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   * @param {Client} client 
   * @param {Object} options 
   */
    static validateOptions(client, manager, options) {

        if (!manager) throw new Error('No manager was found');
        if (!client) throw new Error('No client was found');
        if (typeof options !== 'object') throw new TypeError(`${this.name}: Command options is not an Object`);

        // Name
        if (typeof options.name !== 'string') throw new TypeError('Command name is not a string');
        if (options.name !== options.name.toLowerCase()) throw new Error('Command name is not lowercase');

        // Aliases
        if (options.aliases) {
            if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
                throw new TypeError('Command aliases is not an Array of strings');

            if (options.aliases.some(ali => ali !== ali.toLowerCase()))
                throw new RangeError('Command aliases are not lowercase');

            for (const alias of options.aliases) {
                if (client.aliases.cache.get(alias)) throw new Error('Command alias already exists');
            }
        }

        // Usage
        if (options.usage && typeof options.usage !== 'string') throw new TypeError('Command usage is not a string');

        // Description
        if (options.description && typeof options.description !== 'string')
            throw new TypeError('Command description is not a string');

        // Type
        if (options.type && typeof options.type !== 'string') throw new TypeError('Command type is not a string');
        if (options.type && !Object.values(manager.types).includes(options.type))
            throw new Error('Command type is not valid');

        // Client permissions
        if (options.clientPermissions) {
            if (!Array.isArray(options.clientPermissions))
                throw new TypeError('Command clientPermissions is not an Array of permission key strings');

            for (const perm of options.clientPermissions) {
                if (!permissions[perm]) throw new RangeError(`Invalid command clientPermission: ${perm}`);
            }
        }

        // User permissions
        if (options.userPermissions) {
            if (!Array.isArray(options.userPermissions))
                throw new TypeError('Command userPermissions is not an Array of permission key strings');

            for (const perm of options.userPermissions) {
                if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
            }
        }

        // Examples
        if (options.examples && !Array.isArray(options.examples))
            throw new TypeError('Command examples is not an Array of permission key strings');

        // Owner only
        if (options.ownerOnly && typeof options.ownerOnly !== 'boolean')
            throw new TypeError('Command ownerOnly is not a boolean');

        // Disabled
        if (options.disabled && typeof options.disabled !== 'boolean')
            throw new TypeError('Command disabled is not a boolean');

        if (options.guildOnly && typeof options.guildOnly !== 'boolean')
            throw new TypeError('Command guildOnly is not a boolean');

        if (options.reloadable && typeof options.reloadable !== 'boolean')
            throw new TypeError('Command reloadable is not a boolean');
    }

    /**
     * Checks if member is a guild owner
     * @param {Object} guild 
     * @param {Object} user 
     * @returns {Boolean}
     */
    isGuildOwner(guild, user) {
        return guild.ownerID === user.id;
    }

    isBot(user) {
        const botState = user.bot || user.user.bot;

        return botState;
    }

    getTag(user) {
        const tag = user.tag || user.user.tag;

        return tag;
    }

    getUserName(user) {
        const username = user.username || user.user.username;

        return username;
    }
}