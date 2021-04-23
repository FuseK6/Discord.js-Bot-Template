const Event = require('../Event');

module.exports = class ReadyEvent extends Event {
    constructor(client, manager) {
        super(client, manager, {
            name: 'ready'
        });
    }

    run(client) {
        this.client.Log.d(`${client.user.tag} ready`)
    }
}