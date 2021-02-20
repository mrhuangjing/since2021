// new Promise((resolve, reject) => {
//     resolve(1);
// }).then(res => {
//     console.log(res);
// }).catch(e => {
//     console.error(e);
// });

// 1.注册回调
// 2.成链

function _Promise (fn) {
    if (!(this instanceof _Promise)) {
        console.warn('请用new操作符调用_Promise');
        return;
    }

    this.status = 'pending';
    
    function nextTick (cbk) {
        // 用setTimeout(xx, 0)模拟微任务
        const timer = setTimeout(() => {
            clearTimeout(timer);
            cbk && cbk();
        }, 0);
    }

    const resolve = (value) => {
        if (this.status === 'pending') {
            nextTick(() => {
                this.status = 'fulfilled';
                if (this.onFulfilled) {
                    try {
                        const result = this.onFulfilled(value);
                        if (result instanceof _Promise) {
                            result.then(this.cache.resolve, this.cache.reject);
                            return;
                        }
                        this.cache.resolve.call(this.cache._promise, result);
                    } catch(e) {
                        // this.cache.reject(e);
                        this.cache.reject.call(this.cache._promise, e);
                    }
                }
            });
        }
    }

    const reject = (reason) => {
        if (this.status === 'pending') {
            this.status = 'rejected';
            nextTick(() => {
                this.status = 'fulfilled';
                if (this.onRejected) {
                    try {
                        const result = this.onRejected(reason);
                        if (result instanceof _Promise) {
                            result.then(this.cache.resolve, this.cache.reject);
                            return;
                        }
                        this.cache.resolve.call(this.cache._promise, result);
                    } catch (e) {
                        // this.cache.reject(e);
                        this.cache.reject.call(this.cache._promise, e);
                    }
                }
            });
        }
    }

    fn(resolve, reject);
}

_Promise.prototype.then = function (onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;

    const _promise = new _Promise((resolve, reject) => {
        this.cache = {
            resolve,
            reject
        };
    });

    this.cache._promise = _promise;

    return _promise;
};

new _Promise((resolve, reject) => {
    resolve(1);
}).then(res => {
    console.log(res);
    return new _Promise((res, rej) => {
        res(2);
    });
}).then(res => {
    console.log(res);
});