Function.prototype._call = function (obj, ...args) {
    const fn = this;
    let prop = Symbol();
    obj[prop] = fn;
    const res = obj[prop](...args);
    delete obj[prop];
    return res;
};

Function.prototype._apply = function (obj, args) {
    const fn = this;
    let prop = Symbol();
    obj[prop] = fn;
    const res = obj[prop](...args);
    delete obj[prop];
    return res;
}

Function.prototype._bind = function (obj, ...args) {
    const fn = this;

    return (...params) => {
        const rest = args.concat(params);
        return fn._apply(obj, rest);
    };
};

const obj = {
    name: 'jh',
    age: 29
};

function fn (gender, height) {
    console.log(this.name, this.age, gender, height);
}

const foo = fn._bind(obj, 'male');
const res = foo(185);
console.log(res);