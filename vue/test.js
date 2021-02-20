const defineReactive = require('./defineReactive');
const Watcher = require('./watcher');

const data = {
    a: '123',
    b: {
        c: '789',
        d: {
            e: '007'
        }
    }
};

defineReactive(data);

with (data) {
    new Watcher(b, 'c', (newVal) => {
        console.log('属性c新值 -> ', newVal);
    });
    
    new Watcher(b.d, 'e', (newVal) => {
        console.log('属性e新值 -> ', newVal);
    });

    b.c = 'boom';
    b.d.e = 'baya';
}
