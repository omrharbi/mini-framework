import { createStore } from '../../src/store.js';
import { Router, getHashPath } from '../../src/Router.js';
import { jsx, render, useState } from '../../src/framework.js';

const initialState = {
    todos: [],
    filter: 'all',
    editingId: null
};

const store = createStore(initialState);

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

function TodoItem({ todo }) {
    const { editingId } = store.getState();
    const isEditing = editingId === todo.id;
    const [editText, setEditText] = useState(todo.text);

    const handleSubmit = (text) => { 
        const trimmedText = text.trim();
        if (trimmedText) {
            store.dispatch({
                type: 'EDIT_TODO',
                payload: {
                    id: todo.id,
                    text: trimmedText
                }
            });
        }
        store.dispatch({ type: 'CLEAR_EDITING_ID' });
        update();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() != "") {
            const currentValue = e.target.value;
            setEditText(currentValue);
            handleSubmit(currentValue); 
        }
    };

    const handleBlur = () => {
        store.dispatch({ type: 'CLEAR_EDITING_ID' });
        update()
    };

    if (isEditing) {
        return jsx('li', { className: 'editing' },
            jsx('div', { className: 'view' },
                jsx('label', {}, todo.text) 
            ),
            jsx('input', {
                className: 'edit',
                value: editText,
                onkeydown: handleKeyDown,
                onblur: handleBlur
            })
        );
    }

    return jsx('li', {
        className: todo.completed ? 'completed' : '',
    },
        jsx('div', { className: 'view' },
            jsx('input', {
                className: 'toggle',
                type: 'checkbox',
                onclick: () => {
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        payload: todo.id,
                    });
                    update();
                }
            }),
            jsx('label', {
                ondblclick: () => {
                    store.dispatch({
                        type: 'SET_EDITING_ID',
                        payload: todo.id
                    });
                    setEditText(todo.text);
                    update();
                }
            }, todo.text),
            jsx('button', {
                className: 'destroy',
                onclick: () => {
                    store.dispatch({
                        type: 'DELETE_TODO',
                        payload: todo.id
                    });
                    update();
                }
            })
        )
    );
}

export function App() {
    const { todos, filter } = store.getState();
    let filteredTodos = filterTodos(todos, filter);
    const activeTodoCount = getActiveTodosCount(todos);
    const allCompleted = areAllTodosCompleted(todos);

    return jsx('section', { className: 'section' },
        jsx('div', { className: 'todoapp' },
            jsx('header', { className: 'header' },
                jsx('h1', null, 'todos'),
                jsx('input', {
                    className: 'new-todo',
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
                            update();
                            e.target.value = '';
                        }
                    }
                })
            ),
            todos.length ? (
                filteredTodos.length > 0 ? (
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
                        jsx('label', { for: 'toggle-all' }, 'Mark all as complete'),
                        jsx('ul', { className: 'todo-list' },
                            ...filteredTodos.map(todo =>
                                jsx(TodoItem, { todo, key: todo.id })
                            )
                        )
                    )
                ) : (
                    jsx('section', { className: 'main' },
                        jsx('input', {
                            id: 'toggle-all',
                            className: 'toggle-all',
                            type: 'checkbox',
                            checked: allCompleted,
                        }),
                        jsx('ul', { className: 'todo-list' }) 
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
    console.log("update");

    render(App(), document.getElementById('root'));
}



router.init();
update();