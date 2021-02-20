// const createElement = require('./createElement');

// const vDom = createElement('<h1  id="title"  class="title" >Title<p>123<span></span></p></h1>');

function render (vDom, container) {
    let dom;

    if (!vDom.type) {
        dom = document.createTextNode(vDom);
    } else {
        dom = document.createElement(vDom.type);
    }

    if (vDom.props) {
        Object.keys(vDom.props).filter(key => {
            if (key != 'children') {
                return true;
            }
            return false;
        }).forEach(key => {
            dom[key] = vDom.props[key];
        });

        vDom.props.children.forEach(el => {
            render(el, dom);
        });
    }
    
    container.appendChild(dom);
}