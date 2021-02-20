const arr = [[1, 2], [3, 4], [5, 6, [7, [8]]]];

const res = flat_2(arr);
console.log(res);

function flat_1 (arr) {
    let res = [];

    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flat(arr[i]));
        } else {
            res = res.concat(arr[i]);
        }
    }

    return res;
}

function flat_2 (arr) {
    return arr.reduce((res, cur) => {
        if (Array.isArray(cur)) {
            return res.concat(flat_2(cur));
        } else {
            return res.concat(cur);
        }
    }, []);
}
