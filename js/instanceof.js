function _instanceof (a, b) {
    let temp = a;

    while (temp.__proto__) {
        if (temp.__proto__ === b.prototype) {
            return true;
        }
        temp = temp.__proto__;
    }
    return false;
}

const a = [];
const res = _instanceof(a, Array);
console.log(res);