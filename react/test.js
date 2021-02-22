const defineReactive = require('../vue/defineReactive');
const parser = require('./JSXParser');

// 用户行为
const template = `<div>
    <h1 id = "title" data_show= 'true'>Title</h1>
    <div>姓名: {name}</div>
    <a href="xxx">Jump</a>
    <section>
        <p>Article</p>
    </section>
</div>`;
// 用户行为
const state = {
    name: 'jh'
};

defineReactive(state);
const renderFunc = parser(template, state);
const vDom = renderFunc();
console.log('生成vDom: ', JSON.stringify(vDom, null, 4));
// 渲染vDom成真实Dom

// 用户行为
state.name = 'willian';