import { createStore } from '../../src/store.js';
import { Router, getHashPath } from '../../src/Router.js';
import { jsx, render } from '../../src/framework.js';
 
const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);

// Define route handlers that will update the app with the correct filter
const router = new Router({
    '#/': () => {
        store.dispatch({ type: 'SET_FILTER', payload: 'all' });
        update();
    },
    '#/active': () => {
        store.dispatch({ type: 'SET_FILTER', payload: 'active' });
        update();
    },
    '#/completed': () => {
        store.dispatch({ type: 'SET_FILTER', payload: 'completed' });
        update();
    }  
});

function areAllTodosCompleted(todos) {
    return todos.length > 0 && todos.every(todo => todo.completed);
}

function getActiveTodosCount(todos) {
    return todos.filter(todo => !todo.completed).length;
}

export function App() {
    const { todos, filter } = store.getState();
    let filteredTodos = filterTodos(todos, filter);
    const activeTodoCount = getActiveTodosCount(todos);
    const completedCount = todos.length - activeTodoCount;
    const allCompleted = areAllTodosCompleted(todos);
    
    return jsx('section', { className: 'section' },
    jsx('div', { className: 'todoapp' },
        jsx('header', { className: 'header' },
            jsx('h1', null, 'todos'),
            jsx('input', {
                className: 'new-todo',
                placeholder: 'What needs to be done?',
                autoFocus: true,
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
                        update();
                        e.target.value = '';
                    }
                }
            })
        ),
        todos.length ? 
            jsx('section', { className: 'main' },
                jsx('input', {
                    id: 'toggle-all',
                    className: 'toggle-all',
                    type: 'checkbox',
                    checked: allCompleted,
                    onClick: () => {
                        store.dispatch({
                            type: 'TOGGLE_ALL_TODOS',
                            payload: !allCompleted
                        });
                        update();
                    }
                }),
                jsx('label', { htmlFor: 'toggle-all' }, 'Mark all as complete'),
                jsx('ul', { className: 'todo-list' },
                    ...filteredTodos.map(todo =>
                        jsx('li', { 
                            className: todo.completed ? 'completed' : '',
                            key: todo.id 
                        },
                            jsx('div', { className: 'view' },
                                jsx('input', {
                                    className: 'toggle',
                                    type: 'checkbox',
                                    checked: todo.completed,
                                    onClick: () => {
                                        store.dispatch({
                                            type: 'TOGGLE_TODO', 
                                            payload: todo.id,
                                        });
                                        update();
                                    }
                                }),
                                jsx('label', null, todo.text),
                                jsx('button', {
                                    className: 'destroy',
                                    onClick: () => {
                                        store.dispatch({ 
                                            type: 'DELETE_TODO', 
                                            payload: todo.id
                                        });
                                        update();
                                    }
                                })
                            )
                        )
                    )
                )
            ) : "",
        todos.length ?
            jsx('footer', { className: 'footer' },
                jsx('span', { className: 'todo-count' },
                    jsx('strong', null, activeTodoCount),
                    ' ' + (activeTodoCount === 1 ? 'item' : 'items') + ' left'
                ),
                jsx('ul', { className: 'filters' },
                    jsx('li', null,
                        jsx('a', { 
                            className: filter === 'all' ? 'selected' : '',
                            href: '#/'
                        }, 'All')
                    ),
                    jsx('li', null,
                        jsx('a', { 
                            className: filter === 'active' ? 'selected' : '',
                            href: '#/active'
                        }, 'Active')
                    ),
                    jsx('li', null,
                        jsx('a', { 
                            className: filter === 'completed' ? 'selected' : '',
                            href: '#/completed'
                        }, 'Completed')
                    )
                ),
                    jsx('button', {
                        className: 'clear-completed',
                        onClick: () => {
                            store.dispatch({
                                type: 'DELETE_COMPLETED_TODO'
                            });
                            update();
                        }
                    }, 'Clear completed')
                
            ) : "",

    ),
    jsx('footer', { className: 'info' },
        jsx('p', null, 'Double-click to edit a todo'),
        jsx('p', null, 'Created with our own mini framework'),
        jsx('p', null, 'Part of ', jsx('a', { href: 'http://todomvc.com' }, 'TodoMVC'))
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

export function update() {
    render(App(), document.getElementById('root'));
}

// Initialize router and render the app
router.init();
update();