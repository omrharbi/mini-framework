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