const Handler = require('./BaseHandler');
const { readdirSync } = require('fs');

module.exports = class PluginHandler extends Handler {
    constructor(client, manager) {
        super(client, manager);

        this.plugins = [];
    }

    loadAll() {
        this.emit('debug', 'Loading plugins');

            readdirSync(`./src/plugins/`).filter(f => f.endsWith('.js') && f !== 'Base.js').forEach(plug => {
                const Plugin = require(`../plugins/${plug}`);
                const plugin = new Plugin(this.client, this.manager);

                plugin.load(this.client, this);

                this.plugins.push(plugin);
                this.manager.cache.set(plugin.name, plugin);
            });

        this.emit('debug', `Loaded ${this.plugins.length} plugins`);
    }
}