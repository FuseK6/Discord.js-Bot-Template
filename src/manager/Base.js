const EventEmmiter = require('events');
const { Collection } = require('discord.js');

module.exports = class Manager extends EventEmmiter {
    constructor(client, options) {
        super();

        // Options
        this.name = options.name;

        // Other
        this.client = client;
        this.cache = new Collection();

        // Actions
        this.on('err', async (name, message) => {
            this.client.Log.e(name, message);
        });

        this.on('debug', async (message) => {
            this.client.Log.d(message)
        });
    }

    destroy() {
        this.emit('debug', `Destroyed ${this.name}`);

        return this.cache.clear();
    }

    add(data, cache = true, { id, extras = [] } = {}) {
        const existing = this.cache.get(id || data.id);
        if (existing && existing._patch && cache) existing._patch(data);
        if (existing) return existing;

        const entry = data;
        if (cache) this.cache.set(id || entry.id, entry);
        return entry;
    }

    /**
     * Resolves a data entry to a data Object.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?Object} An instance from this Manager
     */
    resolve(idOrInstance) {
        if (idOrInstance instanceof this.cache) return idOrInstance;
        if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) || null;
        return null;
    }

    /**
     * Resolves a data entry to a instance ID.
     * @param {string|Object} idOrInstance The id or instance of something in this Manager
     * @returns {?Snowflake}
     */
    resolveID(idOrInstance) {
        if (idOrInstance instanceof this.cache) return idOrInstance.id;
        if (typeof idOrInstance === 'string') return idOrInstance;
        return null;
    }

    valueOf() {
        return this.cache;
    }
}