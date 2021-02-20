const template = `<div>
    <h1 id="title">Title</h1>
    <a href="xxx">Jump</a>
    <section>
        <p>Article</p>
    </section>
</div>`;

const START_REG = /^<\s*([\w-_]+)\s*([^<>]*)>/;
const END_REG = /^<\s*\/([\w-_]+)[^<>]*>/;
const TEXT_REG = /^([^<>\n\r]+)/;

const ast = parse(template);
// console.log(JSON.stringify(ast, null, 4));
// console.log(astToExcuteStr(ast));

const excuteFunc = new Function('createElement', `return ${astToExcuteStr(ast)}`);

// const res = excuteFunc(createElement);
// console.log(JSON.stringify(res, null, 4));

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
                keys.forEach(key => {
                    if (key != 'type' && key != 'children') {
                        excuteStr += `${key}: '${ast[key]}'`;
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
                        excuteStr += `${index > 0 ? ', ' : ''}'${el.content}'`;
                    } else {
                        excuteStr += `${index > 0 ? ', ' : ''}${astToExcuteStr(el)}`;
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
    const propsArr = str.split(' ').filter(el => {
        if (el) {
            return true;
        }
        return false;
    });
    if (propsArr.length) {
        const res = {};
        propsArr.forEach(el => {
            const reg = /^([\w-_]+)=['"](.*)['"]$/;
            const arr = el.match(reg);
            res[arr[1]] = arr[2];
        });
        return res;
    }
    return null;
}

// module.exports = excuteFunc;