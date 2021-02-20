// 浏览器中的进程：browser进程、插件进程、GPU进程、网络进程、渲染进程
// 浏览器中的线程：JS引擎线程、GUI线程、事件线程、异步网络请求线程、定时器线程
// css不会阻塞DOM的解析，但会阻塞DOM的渲染；JS既会阻塞DOM的解析也会阻塞DOM的渲染
/* 使用异步的好处是你只需要设置好异步的触发条件就可以去干别的事情了，所以异步不会阻塞主干上事件的执行。
 特别是对于JS这种只有一个线程的语言，如果都像我们第一个例子那样去while(true)，
 那浏览器就只有一直卡死了，只有等这个循环运行完才会有响应。
*/
/*
需要注意的是，这个线程跟GUI线程是互斥的。
互斥的原因是JS也可以操作DOM，如果JS线程和GUI线程同时操作DOM，结果就混乱了，不知道到底渲染哪个结果。
这带来的后果就是如果JS长时间运行，GUI线程就不能执行，整个页面就感觉卡死了。
所以我们最开始例子的while(true)这样长时间的同步代码在真正开发时是绝对不允许的。
*/

/**
 * 所以JS异步的实现靠的就是浏览器的多线程，当他遇到异步API时，
 * 就将这个任务交给对应的线程，当这个异步API满足回调条件时，
 * 对应的线程又通过事件触发线程将这个事件放入任务队列，然后主线程从任务队列取出事件继续执行。
 */

 /**
 * 所以再次强调，写代码时一定不要长时间占用主线程。
 */

/**
 * 
 */

console.log('1');
setTimeout(() => {
    console.log('2');
}, 0);
Promise.resolve().then(() => {
    console.log('5');
})
new Promise((resolve) => {
    console.log('3');
    resolve();
}).then(() => {
    console.log('4');
})

console.log('outer');

setTimeout(() => {
    setTimeout(() => {
        console.log('setTimeout');
    }, 0);
    setImmediate(() => {
        console.log('setImmediate');
    });
}, 0);


process.nextTick(()=>{
    console.log('nextTick')
})
console.log('XXXXXX')