const Watcher = require('../vue/watcher');
const createElement = require('./createElement_2');

const START_REG = /^<\s*([\w-_]+)\s*([^<>]*)>/;
const END_REG = /^<\s*\/([\w-_]+)[^<>]*>/;
const TEXT_REG = /^([^<>\n\r]+)/;

let excuteFunc;
let vDom, newVDom;

function main (template, state) {
    const ast = parse(template);
    const excuteStr = astToExcuteStr(ast, state);
    excuteFunc = new Function('createElement', 'state', `return ${excuteStr}`);
    return () => {
        vDom = excuteFunc(createElement, state);
        return vDom;
    };
}

function render (state) {
    // 根据变化的state生成新的vDom
    newVDom = excuteFunc(createElement, state);
    diff(vDom, newVDom);
    vDom = newVDom; // 新的vDom成为当前vDom
}

function diff (vNode, newVNode) {
    // 通过比较vDom和newVDom，将区别逐个同步到真实DOM
    if (!vNode || !newVNode) return;

    let vNodeCh, newVNodeCh;
    if (vNode.props) vNodeCh = vNode.props.children;
    if (newVNode.props) newVNodeCh = newVNode.props.children;

    if (vNode === newVNode) return;

    if (vNode.type != newVNode.type) {
        // 用新的节点替换旧的节点
        return;
    }

    if (newVNode.props && vNode.props) {
        const propsArr = [];
        Object.keys(newVNode.props).forEach(key => {
            if (key != 'children') {
                propsArr.push(key);
                if (vNode.props.hasOwnProperty(key)) {
                    if (vNode.props[key] != newVNode.props[key]) {
                        // 更新属性
                    }
                } else {
                    // 新增属性
                }
            }
        });

        Object.keys(vNode.props).forEach(key => {
            if (propsArr.indexOf(key) === -1) {
                // 删除属性
            }
        });
    } else if (vNode.props) {
        // 删除属性
    } else if (newVNode.props) {
        // 新增属性
    }
    

    if (vNodeCh && newVNodeCh) {
        vNodeCh.forEach((el, index) => {
            diff(el, newVNodeCh[index]);
        });
    } else if (vNodeCh) {
        // 删除子节点
    } else if (newVNodeCh) {
        // 新增子节点
    }
    
}

function astToExcuteStr (ast, state) {
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

                                    new Watcher(state, item, (newVal) => {
                                        console.log(`state的${item}属性更新值`, newVal);
                                        render(state);
                                        console.log('重新生成vDom: ', JSON.stringify(vDom, null, 4))
                                    });
                                } else {
                                    excuteStr += `'${item}'`;
                                }
                            });
                        } else {
                            excuteStr += `${index > 0 ? ', ' : ''}'${el.content}'`;
                        }
                    } else {
                        excuteStr += `${index > 0 ? ', ' : ''}${astToExcuteStr(el, state)}`;
                    }
                });
                excuteStr += ` ]`;
            }
            excuteStr += ` )`;
        }
    }
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

module.exports = main;