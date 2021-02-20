// <h1 id="title">Title</h1>
// {
//     type: 'h1',
//     props: {
//       id: 'title',
//       children: 'Title'
//     }
// }

// const res = createElement('<h1  id="title"  class="title" >Title<p>123<span></span></p></h1>');
const res = createElement('<div><h1 id="title">Title</h1>111<a href="xxx">Jump</a><section><p>Article</p></section></div>');
console.log(JSON.stringify(res, null, 4));

// hasRootTag('<h1  id="title"  class="title" ><a>Ti</a>tle<p></p></h1><h1></h1>');


function createElement (tag) {
    console.log(tag)
    try {
        if (hasRootTag(tag)) {
            const res = parseTag(tag);

            return res;
        } else {
            throw new Error('请保证只有一个根标签');
        }
    } catch (e) {
        console.log(e);
    }
}

function parseTag (str) {
    const reg = /^<([\w-_]+)([^<>]*)>(.*)<\/([\w-_]+)>$/;
    // const reg = /<([\w-_]+)([^<>]*)>(.*)<\/([\w-_]+)>/;
    // const reg = /<([\w-_]+).*?>(.*)<\/([\w-_]+)>/;
    const arr = str.match(reg);
    const res = {};

    if (!arr) {
        return {
            type: 'text',
            content: str
        };
    }

    // 标签不匹配
    if (arr[1] != arr[4]) {
        throw new Error('请检查输入标签是否正确闭合');
    }
    res.type = arr[1];

    // 提取标签属性
    const props = parseProps(arr[2]);
    Object.assign(res, {
        props
    });

    // 提取标签子元素
    const children = parseChildren(arr[3]);
    res.props.children = children;

    return res;
}

function parseChildren (str) {
    const reg = /(<[\w-_]+[^<>]*>.*<\/[\w-_]+>)/;
    const arr = str.split(reg);
    console.log('>>>>>', arr)
    const parsedArr = arr.filter(el => {
        if (el) {
            return true;
        }
        return false;
    }).map(el => {
        return createElement(el);
    });
    return parsedArr;
}

function parseProps (str) {
    const res = {};
    const propsArr = str.split(' ').filter(el => {
        if (el) {
            return true;
        }
        return false;
    });
    propsArr.forEach(el => {
        const reg = /^([\w-_]+)=['"](.*)['"]$/;
        const arr = el.match(reg);
        res[arr[1]] = arr[2];
    });
    return res;
}

function hasRootTag (str) {
    const stack = [];
    const reg = /<\s*(\/*)([\w-_]+)[^<>]*>/;
    if (!str.match(reg)) return true;

    let flag = true;
    let temp = str;
    while (temp) {
        const arr = temp.match(reg);
        if (arr) {
            if (arr[1] === '/') { // 结束标签
                if (stack.length) {
                    if (arr[2] === stack[0]) {
                        stack.shift();
                    } else {
                        throw new Error('标签不匹配');
                    }
                } else {
                    return false;
                }
            } else { // 开始标签
                if (stack.length) {
                    stack.unshift(arr[2]);
                } else {
                    if (flag) {
                        stack.unshift(arr[2]);
                        flag = false;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            if (stack.length) {
                return false;
            }
            return true;
        }
        temp = temp.replace(reg, '');
    }

    if (stack.length) {
        return false;
    }
    return true;
}

// module.exports = createElement;