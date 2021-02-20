function sum (a, b) {
    return a + b + 1;
}
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

function test (desc, fn) {
    try {
        fn();
        console.log(`${desc} -- PASS`);
    } catch (e) {
        console.error(`${desc} -- FAIL`, e);
    }
}

function expect (fn) {
    const res = typeof fn == 'function' ? fn() : fn;

    return {
        toBe (val) {
            if (val != res) {
                throw new Error(`期望值是${val}，但实际上却是${res}!`);
            }
        }
    };
}