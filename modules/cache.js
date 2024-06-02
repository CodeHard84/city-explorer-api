class Cache {
    constructor(maxAge = 560000) {
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
        this.cache[key] = value;
    }

    has(key) {
        return this.cache.hasOwnProperty(key);
    }

    delete(key) {
        delete this.cache[key];
    }
}

module.exports = Cache;