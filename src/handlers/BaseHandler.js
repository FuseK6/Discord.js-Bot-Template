const EventEmmiter = require('events');

module.exports = class Handler extends EventEmmiter {
    constructor(client, manager) {
        super();
        this.client = client;
        this.manager = manager;

        this.on('debug', async (content) => {
            client.Log.d(content);
        });

        this.on('err', async (errorName, message) => {
            client.Log.e(errorName, message);
        });
    }
}