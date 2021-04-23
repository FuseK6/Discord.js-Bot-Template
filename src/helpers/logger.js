const { gray, green, yellow, red } = require('chalk');

module.exports = class Log {
    constructor(client) {
        this.client = client;
    }

    i(content) {
        const date = this.getDate();

        return console.log(gray(`[IGNORE] ${date} ${content}`));
    }

    l(content) {
        const date = this.getDate();

        return console.log(green('[LOG]') + yellow(date) + content);
    }

    d(content) {
        const date = this.getDate();

        return console.log(yellow(`[DEBUG] ${date}`) + content);
    }

    e(name, message) {
        const date = this.getDate();

        return console.log(red('[ERROR]') + yellow(date) + `${name}: ${message}`);
    }

    w(content) {
        const date = this.getDate();

        return console.log(yellow(`[WARN] ${date}`) + content);
    }

    getDate() {
        return `[${this.format(new Date(Date.now()))}]: `;
    }
    
    format(tDate){
        return (tDate.getFullYear() + "-" +
        this.dateTimePad((tDate.getMonth() + 1), 2) + "-" +
        this.dateTimePad(tDate.getDate(), 2) + " " +
        this.dateTimePad(tDate.getHours(), 2) + ":" +
        this.dateTimePad(tDate.getMinutes(), 2) + ":" +
        this.dateTimePad(tDate.getSeconds(), 2) + "." +
        this.dateTimePad(tDate.getMilliseconds(), 3));
    }

    dateTimePad(value, digits){
        let number = value;
        while (number.toString().length < digits) {
            number = "0" + number;
        }
        return number;
    }
}