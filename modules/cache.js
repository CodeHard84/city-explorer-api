class Cache {
    constructor(maxAge = 60000) {
        this.cache = {};
        this.maxAge = maxAge;
        this.timer = null;
        this.startTimer();
    }

    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => this.clear(), this.maxAge);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    clear() {
        this.cache = {};
    }

    get(key) {
        return this.cache[key];
    }

    set(key, value) {
        console.log('Cache set:', key);
        this.cache[key] = value;
    }

    has(key) {
        console.log('Cache has:', key);
        return this.cache.hasOwnProperty(key);
    }

    delete(key) {
        delete this.cache[key];
    }
}

module.exports = Cache;