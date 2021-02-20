// constructor  prototype  __proto__

/**start**/
Object.prototype._create = function (obj) {
    const res = {};
    res.__proto__ = obj;
    return res;
};
/**end**/

/**start**/
Array.prototype._reduce = function (fn) {
    const arr = this;
    if (!arr.length) {
        throw new Error('Reduce of empty array with no initial value');
    }

    let res = arr[0];

    arr.forEach((el, index) => {
        if (index) {
            res = fn(res, el, index, arr);
        }
    });

    return res;
};

const result = [1, 2, 3].reduce((total, cur) => {
    return total + cur;
});
console.log(result);
/**end**/

/**start**/
function Person (name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.constructor = function PersonElse (name, age) {
    this.name = name;
    this.age = age + 1;
};

const p = new Person('jh', 29);
console.log(p.age, p.constructor, p.hasOwnProperty('constructor'));

for (let key in p) { // for in 循环会遍历原型链上的自定义属性
    console.log(key);
}
/**end**/

/**start**/
    function myNew (fn, ...args) {
        const obj = {};
        const res = fn.apply(obj, args);
        obj.__proto__ = fn.prototype;

        const isObject = typeof res === 'object' && res != null;
        const isFunction = typeof res === 'function';

        if (isObject || isFunction) {
            return res;
        }

        return obj;
    }
/**end**/