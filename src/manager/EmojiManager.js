const Manager = require('./Base.js');

module.exports = class EmojiManager extends Manager {
    constructor(client) {
        super(client, {
            name: 'EmojiManager'
        });

        this.cache = require('../assets/emojis.json');
    }
}