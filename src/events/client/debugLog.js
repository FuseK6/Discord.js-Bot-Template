const Event = require('../Event');

module.exports = class Debug extends Event {
    constructor(client, manager) {
        super(client, manager, {
            name: 'debug'
        });
    }

    run(client, log) {
        client.Log.d(log);
    }
}