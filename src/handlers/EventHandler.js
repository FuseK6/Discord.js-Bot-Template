const Handler = require('./BaseHandler');
const { readdirSync } = require('fs');

module.exports = class EventHandler extends Handler {
    constructor(client, manager) {
        super(client, manager);

        this.events = [];
    }

    loadEvents() {
        this.emit('debug', 'Loading events');

        readdirSync('./src/events/').filter(f => !f.endsWith('.js')).forEach(dir => {
            readdirSync(`./src/events/${dir}/`).filter(f => f.endsWith('.js')).forEach(evnt => {
                const Event = require(`../events/${dir}/${evnt}`);
                const event = new Event(this.client, this.manager);

                this.events.push(event);
                this.manager.cache.set(event.name, event);
            });
        });

        this.emit('debug', `Loaded ${this.events.length} events`);
    }
}