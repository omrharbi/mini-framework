import { createStore } from '../../src/store.js';
import { createRouter } from '../../src/Router.js';
import { jsx, render, setApp } from '../../mini-framwork/framework.js';

const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);
const router = createRouter();
let pathname = router.getHashPath();

store.subscribe(() => {
    update();
});

window.addEventListener('hashchange', () => {
    pathname = router.getHashPath();
    update();
});

export function App() {
    const { todos, filter } = store.getState();
    let filteredTodos = filterTodos(todos, filter);

    if (pathname === "#/active") {
        filteredTodos = filterTodos(todos, 'active');
    } else if (pathname === "#/completed") {
        filteredTodos = filterTodos(todos, 'completed');
    } else if (pathname === "#/") {
        filteredTodos = filterTodos(todos, "all");
    }

    return jsx('div', { className: 'todo-container' },
        jsx('h1', { className: 'title' }, 'TODOS'),
        jsx('div', { className: 'todo-header' },
            jsx('input', {
                type: 'text',
                className: 'todo-input',
                placeholder: 'What needs to be done?',
                onKeyup: (e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                        store.dispatch({
                            type: 'ADD_TODO',
                            payload: {
                                id: Date.now(),
                                text: e.target.value.trim(),
                                completed: false
                            }
                        });
                        e.target.value = '';
                    }
                }
            })
        ),
        todos.length !== 0 ? createTabs() : "",
        TodoList(filteredTodos),
        todos.length !== 0 ?
            jsx('div', { className: 'bottom-todos' },
                jsx('button', {
                    className: 'trash-button',
                    onClick: () => {
                        store.dispatch({
                            type: 'DELETE_COMPLETED_TODO'
                        });
                    }
                }, 'Clear completed')
            ) : ""
    );
}

function TodoList(todos) { 
    return jsx('div', { className: 'todo-list' },
        ...todos.map(todo =>
            jsx('div', { className: `todo-item ${todo.completed ? 'completed' : ''}`, key: todo.id },
                jsx('div', {
                    className: `todo-checkbox ${todo.completed ? 'checked' : ''}`,
                    onClick: () => store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id })
                }),
                jsx('div', { className: 'todo-text', style: `${todo.completed ? 'text-decoration: line-through;' : ''}` }, todo.text),
                jsx('button', {
                    className: 'delete-button',
                    onClick: () => store.dispatch({ type: 'DELETE_TODO', payload: todo.id })
                }, '×')
            )
        )
    );
}

function createTabs() {
    return jsx('div', { className: 'tab-container' },
        jsx('a', {
            href: '#/',
            onClick: () => { store.dispatch({ type: 'SET_FILTER', payload: 'all' }) }
        },
            jsx('button', { className: `tab ${pathname === '#/' ? 'active' : ''}` }, 'All')
        ),
        jsx('a', {
            href: '#/active',
            onClick: () => { store.dispatch({ type: 'SET_FILTER', payload: 'active' }) }
        },
            jsx('button', { className: `tab ${pathname === '#/active' ? 'active' : ''}` }, 'Active')
        ),
        jsx('a', {
            href: '#/completed',
            onClick: () => { store.dispatch({ type: 'SET_FILTER', payload: 'completed' }) }
        },
            jsx('button', { className: `tab ${pathname === '#/completed' ? 'active' : ''}` }, 'Completed')
        )
    );
}

function filterTodos(todos, filter) {
    switch (filter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

function update() {
    render(App(), document.getElementById('root'));
}

update();