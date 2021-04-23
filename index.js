const Client = require('./src/Client.js');
const Bot = new Client({}, require('./src/Config.js'));

Bot.start();