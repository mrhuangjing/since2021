// const obj = {
//     a: '123',
//     b: {
//         c: '789',
//         d: {
//             e: '007'
//         }
//     }
// };

// defineReactive(obj);

const Dep = require('./dep');
const dep = new Dep();

function defineReactive (obj) {
    if (!typeCheck(obj, 'Object')) return;

    Object.keys(obj).forEach(key => {
        observe(obj, key, obj[key]);

        if (typeCheck(obj[key], 'Object')) {
            defineReactive(obj[key]);
        }
    });
}

function observe (obj, prop, value) {
    Object.defineProperty(obj, prop, {
        get () {
            // console.log('get==', value)
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return value;
        },
        set (val) {
            // console.log('set==', val)
            value = val;
            dep.notify();
        }
    });
}

function typeCheck (val, type) {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
}

module.exports = defineReactive;