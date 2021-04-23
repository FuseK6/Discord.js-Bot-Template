function reduceString(str, len) {
    if (!str || typeof(str) !== 'string' || !len || typeof(len) !== 'number' || len <= 3 || len > str.length) return str;

    const length = Math.floor(len - 3);
    const reduced = str.slice(0, length) + '...';

    return reduced;
}

module.exports = {
    reduceString
}  