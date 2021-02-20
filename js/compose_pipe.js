function compose_1 (...params) {
    return (val) => {
        let temp = val;
        for (let i = params.length - 1; i >= 0; i--) {
            temp = params[i](temp);
        }

        return temp;
    };
}

function compose_2 (...params) {
    return (val) => {
        params.reverse();
        return params.reduce((res, cur) => {
            return cur(res);
        }, val);
    };
}

function pipe () {
    const params = [].slice.call(arguments);
    return (val) => {
        return params.reduce((res, cur) => {
            return cur(res);
        }, val);
    };
}

const add = x => x + 10;
const multiply = x => x * 10;
let res = compose_2(multiply, add)(10);
let res2 = pipe(add, multiply)(10);
console.log(res, res2);