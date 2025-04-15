import {
    createVDOM,
    route,
    handleLocation,
    setRoutes,
    setRoot,
    StateManagement,
    renderComponent,
    myEventSystem
} from './miniframework.js';

// Form Component
let editingKey = null;

function validateTodoItems(data) {
    return Object.values(data).every(item =>
        item &&
        typeof item === 'object' &&
        typeof item.text === 'string' &&
        typeof item.completed === 'boolean' &&
        Object.keys(item).length === 2
    );
}

function TodoComponent(type = "") {
    if(!validateTodoItems(StateManagement.getState())){
        StateManagement.resetState()
    }

    let lastState = StateManagement.getState()

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.todo.length > 0) {
            StateManagement.setState(
                { [Date.now()]: { text: data.todo, completed: false }, });
        }

        e.target.reset()
    }

    function deleteTodo(key) {
        StateManagement.deleteState(key)
    }

    function toggleTodo(key) {
        let updatedState = { ...lastState };
        updatedState[key].completed = !updatedState[key].completed;
        StateManagement.setState(updatedState);
    }

    function completAll() {
        let allCompleted = Object.values(lastState).every(todo => todo.completed);
        let updatedState = Object.fromEntries(
            Object.entries(lastState).map(([key, todo]) => [key, { ...todo, completed: !allCompleted }])
        );
        StateManagement.setState(updatedState);
    }

    function editTodo(key, todo) {
        editingKey = key;
        renderComponent(TodoComponent(type));
    }

    function handleEditSubmit(e, key) {
        if (e.key === 'Enter') {
            const newText = e.target.value.trim();
            if (newText.length > 0) {
                let updatedState = { ...lastState };
                updatedState[key].text = newText;
                StateManagement.setState(updatedState);
            } else {
                deleteTodo(key);
            }
            editingKey = null;
            renderComponent(TodoComponent(type));
        } else if (e.key === 'Escape') {
            editingKey = null;
            renderComponent(TodoComponent(type));
        }
    }

    let count = Object.values(lastState).filter(todo => !todo.completed).length;

    let aggr = [createVDOM('h1', {}, ['zone01todos']), createVDOM('form', { onsubmit: handleSubmit, method: "POST" }, [
        createVDOM('input', {
            class: 'new-todo',
            type: 'text',
            placeholder: 'What needs to be done?',
            name: 'todo',
            required: 'true',
            minlength: "3"
        })
    ])]

    let todos = Object.entries(lastState).filter(([_, todo]) => {
        if (type === "/active") return !todo.completed;
        if (type === "/completed") return todo.completed;
        return true;
    }).map(([key, todo]) =>
        createVDOM('li', { class: `${todo.completed ? 'completed' : ''} ${editingKey === key ? 'editing' : ''}` }, [
            createVDOM('div', { class: 'view' }, [
                createVDOM('input', {
                    class: 'toggle',
                    type: 'checkbox',
                    checked: todo.completed,
                    onclick: () => toggleTodo(key)
                }),
                createVDOM('label', { ondblclick: () => editTodo(key, todo) }, [todo.text]),
                createVDOM('button', {
                    class: 'destroy',
                    onclick: () => deleteTodo(key)
                })
            ]),
            // Edit input field (only shown when editing)
            ...(editingKey === key ? [createVDOM('input', {
                class: 'edit',
                type: 'text',
                value: todo.text,
                onkeydown: (e) => handleEditSubmit(e, key)
            })] : [])
        ])
    );

    if (Object.keys(lastState).length > 0) {

        aggr.push(createVDOM('main', { class: 'main' }, [
            createVDOM('div', { class: 'toggle-all-container' }, [
                createVDOM('input', {
                    class: 'toggle-all',
                    type: 'checkbox',
                    id: 'toggle-all',
                    onclick: completAll
                }),
                createVDOM('label', { class: 'toggle-all-label', for: 'toggle-all' }, ['Toggle All Input'])
            ]),
            createVDOM('ul', { class: 'todo-list' }, todos)
        ]))

        aggr.push(createVDOM('footer', { class: 'footer' }, [
            createVDOM('span', { class: 'todo-count' }, [`${count === 1 ? '1 item left!' : count + ' items left!'}`]),
            createVDOM('ul', { class: 'filters' }, [
                createVDOM('li', {}, [
                    createVDOM('a', { class: `${type === "/" ? 'selected' : ""}`, href: '/', onclick: route }, ['All'])
                ]),
                createVDOM('li', {}, [
                    createVDOM('a', { class: `${type === "/active" ? 'selected' : ""}`, href: '/active', onclick: route }, ['Active'])
                ]),
                createVDOM('li', {}, [
                    createVDOM('a', { class: `${type === "/completed" ? 'selected' : ""}`, href: '/completed', onclick: route }, ['Completed'])
                ])
            ]),
            createVDOM('button', {
                class: 'clear-completed',
                onclick: () => {
                    Object.entries(lastState).map(([key, todo]) => {
                        if (todo.completed) deleteTodo(key)
                    })
                }
            }, ['Clear completed'])
        ]))
    }

    let result = () => createVDOM('div', { class: "todoapp" }, aggr)

    return result;
}

function NotFound() {
    return createVDOM('div', {}, [
        createVDOM('h1', {}, ['404 - Page Not Found']),
        createVDOM('a', { href: '/' }, ['Go to Home'])
    ]);
}


setRoutes({
    '/': TodoComponent("/"),
    '/active': TodoComponent("/active"),
    '/completed': TodoComponent("/completed"),
    404: NotFound
});

setRoot('app');

StateManagement.subscribe(() => {
    const path = window.location.pathname    
    if (path === "/" || path === "/active" || path === "/completed") {
        editingKey = null
        renderComponent(TodoComponent(path));
    }
});

myEventSystem.addEvent(window, 'popstate', handleLocation, true);

handleLocation();

myEventSystem.addEvent(document.body, 'click', (e) => {
    if (e.target.tagName === 'A') {
        route(e);
    }
}, true);

