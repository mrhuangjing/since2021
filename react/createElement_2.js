// const excuteFunc = require('./JSXParser');
const res = excuteFunc(createElement);

// const res = createElement('div',
//         null, [
//         createElement('h1', {
//             id: 'title'
//         }, [
//             'Title'
//         ]),
//         createElement(
//             'a', {
//                 href: 'xxx',
//             }, [
//                 'Jump'
//             ]
//         ),
//         createElement('section',
//             null,
//             [
//                 createElement('p', 
//                     null, [
//                         'Article'
//                     ]
//                 )
//             ]
//         )
//     ]);

console.log(JSON.stringify(res, null, 4));


function createElement (type, config, children) {
    const res = {};
    res.type = type;
    const hasChildren = children && children.length;
    if (config || hasChildren) {
        res.props = {};
    }

    if (config) {
        Object.keys(config).forEach(key => {
            res.props[key] = config[key];
        });
    }
    
    if (hasChildren) {
        res.props.children = children;
    }

    return res;
}