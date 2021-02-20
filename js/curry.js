const fun = (a, b, c) => {return [a, b, c]};

// 上述函数经过科里化后就是
const curriedFun = curry(fun);
// curriedFun的调用变为 curriedFun(a)(b)(c)
const res1 = curriedFun(1, 2, 3);
const res2 = curriedFun(1)(2, 3);
const res3 = curriedFun(1, 2)(3);
const res4 = curriedFun(1)(2)(3);
console.log(res1, res2, res3, res4);

function curry (fn) {
    const len = fn.length;

    let excuteFun = function (...args) {
        if (args.length >= len) {
            return fn(...args);
        } else {
            return (...params) => {
                return excuteFun(...args.concat(params));
            };
        }
    };

    return excuteFun;
}