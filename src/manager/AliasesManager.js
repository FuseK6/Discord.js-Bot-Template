const Manager = require('./Base.js');
const AliasesHandler = require('../handlers/AliasesHandler.js');

module.exports = class AliasesManager extends Manager {
    constructor(client) {
        super(client, {
            name: 'AliasesManager'
        });

        this.handler = new AliasesHandler(client, this);
    }

    start() {
        this.handler.loadAll();
    }
}