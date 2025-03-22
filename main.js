const app = createElement('div', {id: 'app'}, [
    createElement('input', {type: 'text', placeholder: 'What needs to be done?'}, []),
    createElement('ul', {}, [])
]);

function createElement(tag='', attributes={}, children=[]) {
    const element = document.createElement(tag)

    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }

    children.forEach(child => {
        if (typeof child === 'string') {
            element.textContent = child
        } else {
            element.appendChild(child);
        }
    })

    return element
}
