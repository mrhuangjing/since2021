const o = {
    name: 'jh',
    age: 29,
    hobbies: {
        a: 'basketball',
        b: 'swimming'
    }
};

const n = deepCopy_2_upgrade(o);
n.hobbies.b = 'hiking';
console.log(o, n);

function deepCopy_1 (o) {
    return JSON.parse(JSON.stringify(o));
}

function deepCopy_2 (obj, fn) {
    if (fn(obj, 'Object')) {
        const newObj = {};
        for (let key in obj) {
            newObj[key] = deepCopy_2(obj[key], fn);
        }
        return newObj;
    } else if (fn(obj, 'Array')) {
        const newArr = [];
        for (let i = 0; i < obj.length; i++) {
            newArr.push(deepCopy_2(obj[i]), fn);
        }
        return newArr;
    }

    return obj;
}

function deepCopy_2_upgrade (obj) {
    if (typeof obj === 'object') {
        const res = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            res[key] = deepCopy_2_upgrade(obj[key]);
        }
        return res;
    }
    return obj;
}

function typeCheck (obj, type) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
}

// 深拷贝应用：pick函数
const obj = {
    name: 'happy',
    age: 30,
    hobbies: {
        a: 'basketball',
        b: 'swimming'
    }
};

function pick (obj, ...props) {
    const res = {};
    for (let i = 0; i < props.length; i++) {
        for (let key in obj) {
            if (key == props[i]) {
                res[key] = deepCopy_2_upgrade(obj[key]);
            }
        }
    }
    return res;
}

const p = pick(obj, 'age', 'hobbies');
p.hobbies.a = 'football';
p.age = 29;
console.log(obj, p);