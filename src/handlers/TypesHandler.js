const Handler = require('./BaseHandler');
const { readdirSync } = require('fs');

module.exports = class TypesHandler extends Handler {
    constructor(client, manager) {
        super(client, manager, {
            name: 'TypesHandler',
            basedir: __dirname,
            type: 'types'
        });

        this.types = [];
    }

    loadAll() {
        this.client.Log.d('Loading types');

        readdirSync('./src/types/').filter(f => f.endsWith('.js')).forEach(argType => {
            if (argType !== 'base.js') {
                const Type = require(`../types/${argType}`);
                const type = new Type(this.client);

                this.manager.cache.set(type.id, type);
                this.types.push(type)
            }
        });

        this.client.Log.d(`Loaded ${this.types.length} types`);
    }
}