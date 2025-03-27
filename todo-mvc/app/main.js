import { Didact } from '../../src/CreateElement.js';
import { createStore } from '../../src/store.js';

const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);

function App() {
    const { todos, filter } = store.getState();
    console.log(filter); // catkon 'all' fe bdya mn b3d o nbdloha

    const filteredTodos = filterTodos(todos, filter);

    return Didact.createElement('div', { className: 'todo-container' },
        Didact.createElement('h1', { className: 'title' }, 'TODOS'),
        Didact.createElement('div', { className: 'todo-header' },
            Didact.createElement('input', {
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
                        store.subscribe(update);
                        e.target.value = '';
                    }
                }
            })
        ),
        createTabs(),
        TodoList(filteredTodos),
        Didact.createElement('div', { className: 'bottom-todos' },
            Didact.createElement('button', {
                className: 'trash-button',
                onClick: () => {
                    store.dispatch({
                        type: 'DELETE_COMPLETED_TODO'
                    })
                }
            },
                'Clear completed'
            )
        )

    );
}

function TodoList(todos) {
    return Didact.createElement('div', { className: 'todo-list' },
        ...todos.map(todo =>
            Didact.createElement('div', { className: `todo-item ${todo.completed ? 'completed' : ''}` },
                Didact.createElement('div', {
                    className: `todo-checkbox ${todo.completed ? 'checked' : ''}`,
                    onClick: () => store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id })
                }),
                Didact.createElement('div', { className: 'todo-text', style: `${todo.completed ? 'text-decoration: line-through;' : ''}` }, todo.text),
                Didact.createElement('button', {
                    className: 'delete-button',
                    onClick: () => store.dispatch({ type: 'DELETE_TODO', payload: todo.id })
                }, '×')
            )
        )
    );
}

function createTabs() {
    return Didact.createElement('div', { className: 'tab-container' },
        Didact.createElement('button', { className: 'tab' }, 'Active'),
        Didact.createElement('button', { className: 'tab' }, 'Completed'),
        Didact.createElement('button', { className: 'tab' }, 'All todos')
    );
}

function filterTodos(todos, filter) {
    switch (filter) {
        case 'active': return todos.filter(t => !t.completed);
        case 'completed': return todos.filter(t => t.completed);
        default: return todos;
    }
}

function update() {
    Didact.render(App(), document.getElementById('root'));
}

store.subscribe(update);

update();
