// 使用new调用时，this指向new出来的对象
// 没有明确调用者时，this指向window
// 有明确调用者时，this指向调用者
// 箭头函数并不会绑定this
// DOM事件回调里面，this指向绑定事件的对象   currentTarget指的是绑定事件的DOM对象，target指的是触发事件的对象
// 严格模式下this是undefined

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

function fn () {
    function fn2 () {
        this.name = 'jh';
        console.log(this);
    }

    const fn3 = () => {
        this.name = 'lym';
        console.log(this);
    }

    fn2();
    fn3();
}

myNew(fn);