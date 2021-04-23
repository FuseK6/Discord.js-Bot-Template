module.exports = class Event {
    constructor(client, manager, options) {
        // Name of the event
        this.name = options.name || null;
        this.manager = manager;
        this.client = client;
    }
    
    run(client, ...args) {
        throw new Error(`The ${this.name} event has no run() method`);
    }
}