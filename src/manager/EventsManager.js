const Manager = require('./Base.js');
const EventsHandler = require('../handlers/EventHandler');

module.exports = class EventsManager extends Manager {
    constructor(client) {
        super(client, {
            name: 'EventsManager'
        });

        // Handlers
        this.handler = new EventsHandler(this.client, this);
    }

    start() {
        this.handler.loadEvents();

        this.cache.forEach(event => {
            this.client.on(event.name, (...args) => event.run(this.client, ...args));
        });
    }
}