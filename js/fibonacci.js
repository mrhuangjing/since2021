const map = {};
function fn (n, map) {
    if (n == 1 || n == 2) {
        return n;
    }
    if (map[n]) return map[n];

    map[n] = fn(n - 1, map) + fn(n - 2, map);
    
    return map[n];
}

function fn_2 (n) {
    if (n == 1 || n == 2) {
        return n;
    }
    let m_2 = 1;
    let m_1 = 2;
    let m;

    for (let i = 0; i < n - 2; i++) {
        m = m_2 + m_1;
        m_2 = m_1;
        m_1 = m;
    }

    return m;
}

console.time();
console.log(fn(40, map));
console.timeEnd();

console.time();
console.log(fn_2(40));
console.timeEnd();

// 题目描述
// 一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
function foo (n) {
    if (n == 0 || n == 1) {
        return 1;
    } else if (n == 2) {
        return 2;
    }
    let res = 0;
    for (let i = 0; i < n; i++) {
        res += foo(i);
    }
    return res;
}

// 数学分析找规律
function foo_2 (n) {
    if (n == 0 || n == 1) {
        return 1;
    } else if (n == 2) {
        return 2;
    } else if (n == 3) {
        return 4;
    }

    return 8 * Math.pow(2, (n - 4));
}

console.time();
console.log(foo(20));
console.timeEnd();

console.time();
console.log(foo_2(20));
console.timeEnd();