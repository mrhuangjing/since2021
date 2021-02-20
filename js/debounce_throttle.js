function log () {
    console.log('log...');
}

setInterval(throttle(log, 3), 300);

function debounce (fn, waitTime) {
    let timer;

    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn();
            clearTimeout(timer);
            timer = null;
        }, waitTime * 1000);
    };
}

function throttle (fn, waitTime) {
    let flag;

    return function () {
        if (flag) return;
        flag = true;

        let timer = setTimeout(() => {
            fn();
            clearTimeout(timer);
            flag = false;
        }, waitTime * 1000);
    };
}
