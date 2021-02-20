const defineReactive = require('../vue/defineReactive');
const Watcher = require('../vue/watcher');
const createElement = require('./createElement_2');

const template = `<div>
    <h1 id = "title" data_show= 'true'>Title</h1>
    <div>姓名: {name}</div>
    <a href="xxx">Jump</a>
    <section>
        <p>Article</p>
    </section>
</div>`;

const state = {
    name: 'jh'
};

defineReactive(state);

const START_REG = /^<\s*([\w-_]+)\s*([^<>]*)>/;
const END_REG = /^<\s*\/([\w-_]+)[^<>]*>/;
const TEXT_REG = /^([^<>\n\r]+)/;

const ast = parse(template);
// console.log(JSON.stringify(ast, null, 4));
// console.log(astToExcuteStr(ast));
const excuteFunc = new Function('createElement', 'state', `return ${astToExcuteStr(ast)}`);
// console.log(excuteFunc.toString())
const res = excuteFunc(createElement, state);
console.log(JSON.stringify(res, null, 4));
state.name = 'David';


// function processExcuteStr (str) {
//     const arr = str.split('+');
//     let res = ``;
//     arr.forEach(el => {
//         if (state.hasOwnProperty(el)) {
//             res += `${state[el]}`;

//             new Watcher(state, 'name', (newVal) => {
//                 console.log('======>>>', newVal);
//             });
//         } else {
//             res += `${el}`;
//         }
//     });
//     return res;
// }

function astToExcuteStr (ast) {
    let excuteStr = ``;
    if (ast) {
        excuteStr += `createElement('${ast.type}', `;
        const keys = Object.keys(ast);
        if (ast.type === 'text') {
            excuteStr += `null, [])`;
        } else {
            if (keys.length > 2) {
                excuteStr += '{ ';
                let flag = false;
                keys.forEach(key => {
                    if (key != 'type' && key != 'children') {
                        excuteStr += `${flag ? ', ' : ''}${key}: '${ast[key]}'`;
                        flag = true;
                    }
                });
                excuteStr += ' }, ';
            } else {
                excuteStr += `null, `;
            }

            if (ast.children && ast.children.length) {
                excuteStr += `[ `;
                ast.children.forEach((el, index) => {
                    if (el.type === 'text') {
                        excuteStr += `${index > 0 ? ', ' : ''}`;
                        const reg = /{[^{}]+}/g;
                        const arr = el.content.match(reg);
                        if (arr) {
                            const a = el.content.split(/{([^{}]+)}/);
                            a.forEach(item => {
                                if (state.hasOwnProperty(item)) {
                                    excuteStr += `+state.${item}+`;

                                    new Watcher(state, 'name', (newVal) => {
                                        console.log('======>>>', newVal);
                                        const result = excuteFunc(createElement, state);
                                        console.log('+++++++++++++++',JSON.stringify(result, null, 4));
                                    });
                                } else {
                                    excuteStr += `'${item}'`;
                                }
                            });
                            // arr.forEach(item => {
                            //     const a = item.match(/{([^{}]+)}/);
                            //     el.content = el.content.replace(item, `+${a[1]}+`);
                            // });
                            // excuteStr += `${index > 0 ? ', ' : ''}'${el.content}'`;
                        } else {
                            excuteStr += `${index > 0 ? ', ' : ''}'${el.content}'`;
                        }
                    } else {
                        excuteStr += `${index > 0 ? ', ' : ''}${astToExcuteStr(el)}`;
                    }
                });
                excuteStr += ` ]`;
            }
            excuteStr += ` )`;
        }
    }
    // console.log('----', excuteStr)
    return excuteStr;
}

function parse (template) {
    // 解析结果
    let res = null;
    // 指针
    let cur = null;

    // 存储栈
    const stack = [];

    while (template) {
        // 解析开始标签
        const start = parseStartTag(template);
        if (start) {
            if (!res) res = start;
            if (cur && cur.children) {
                cur.children.push(start);
            }
            stack.unshift(start);
            cur = start;
            cur.children = [];
            template = template.replace(START_REG, '');
        }

        // 替换换行符
        template = template.replace(/^[\n\r\s]+/, '');

        // 解析文本
        const text = parseText(template);
        if (text) {
            cur.children.push(text);
            template = template.replace(TEXT_REG, '');
        }

        // 解析结束标签
        const end = parseEndTag(template);
        if (end) {
            if (stack.length) {
                let type = stack[0].type;
                if (type === end.type) {
                    stack.shift();
                    cur = stack[0];
                    template = template.replace(END_REG, '');
                } else {
                    throw new Error(`结束标签${end.type}和开始标签${type}不匹配`);
                }
            } else {
                throw new Error(`结束标签${end.type}没有对应的开始标签`);
            }
        }
    }

    return res;
}

function parseStartTag (str) {
    const arr = str.match(START_REG);
    if (arr) {
        const res = {};
        res.type = arr[1];
        if (arr[2]) {
            Object.assign(res, parseProps(arr[2]));
        }
        return res;
    }
    return null;
}

function parseText (str) {
    const arr = str.match(TEXT_REG);
    if (arr) {
        const res = {};
        res.type = 'text';
        res.content = arr[1];
        return res;
    }
    return null;
}

function parseEndTag (str) {
    const arr = str.match(END_REG);
    if (arr) {
        const res = {};
        res.type = arr[1];
        return res;
    }
    return null;
}

function parseProps (str) {
    const splitReg = /([\w-_]+\s*=\s*['"].*?['"])/;
    const propsArr = str.split(splitReg).filter(el => {
        if (el) {
            return true;
        }
        return false;
    });
    if (propsArr.length) {
        const res = {};
        propsArr.forEach(el => {
            const reg = /([\w-_]+)\s*=\s*['"](.*)['"]/;
            const arr = el.match(reg);
            if (arr) {
                res[arr[1]] = arr[2];
            }
        });
        return res;
    }
    return null;
}

// module.exports = excuteFunc;