const Dep = require('./dep');

class Watcher {
    constructor (obj, key, cbk) {
        Dep.target = this;
        this.obj = obj;
        this.key = key;
        this.cbk = cbk;
        this.value = obj[key];
        Dep.target = null;
    }

    update () {
        this.value = this.obj[this.key];
        this.cbk(this.value);
    }
}

module.exports = Watcher;