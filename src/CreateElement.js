// function createElement(type, props, ...children) {
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child =>
//                 typeof child === "object"
//                     ? child
//                     : createTextElement(child)
//             ),
//         },
//     }
// }

// function createTextElement(text) {
//     return {
//         type: "TEXT_ELEMENT",
//         props: {
//             nodeValue: text,
//             children: [],
//         },
//     }
// }

// function render(element, container) {
//     const dom =
//         element.type == "TEXT_ELEMENT"
//             ? document.createTextNode("")
//             : document.createElement(element.type)

//     const isProperty = key => key !== "children"
//     Object.keys(element.props)
//         .filter(isProperty)
//         .forEach(name => {
//             if (name.startsWith('on') && typeof element.props[name] === 'function') {
//                 const event = name.slice(2).toLowerCase();
//                 dom.addEventListener(event, element.props[name]);
//             } else {
//                 dom[name] = element.props[name];
//             }
//         })

//     element.props.children.forEach(child =>
//         render(child, dom)
//     )

//     container.appendChild(dom)
// }

// export const Didact = {
//     createElement,
//     render,
// }




export function createElement(tag, attrs = {}, ...children) {
    return {
        tag,
        attrs,
        children: children.flat()
    };
}

function render(vnode, parent) {
    const mount = parent ? (el) => { parent.innerHTML = ''; parent.appendChild(el) } : (el) => el;
    
    if (typeof vnode === 'string') {
        return mount(document.createTextNode(vnode));
    }

    const el = document.createElement(vnode.tag);

    for (const [key, value] of Object.entries(vnode.attrs || {})) {
        if (key.startsWith('on') && typeof value === 'function') {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, value);
        } else {
            if (key === 'className') {
                el.setAttribute('class', value);
            } else {
                el.setAttribute(key, value);
            }
        }
    }

    for (const child of vnode.children) {
        el.appendChild(render(child));
    }

    return mount(el);
}

export const Didact = {
    createElement,
    render,
}