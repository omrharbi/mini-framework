import { Didact } from '../../src/CreateElement.js';
import { addCustomEventListener } from '../../src/eventlistenner.js';
import { createStore } from '../../src/store.js';
import { createRouter } from '../../src/Router.js';

const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);
const router = createRouter()
let pathname = router.getHashPath()

window.addEventListener('hashchange', () => {
    pathname = router.getHashPath();
    update();
});

function App() {
    const { todos, filter } = store.getState();
    let filteredTodos = filterTodos(todos, filter);
    if (pathname === "#/active") {
        filteredTodos = filterTodos(todos, 'active');
    } else if (pathname === "#/completed") {
        filteredTodos = filterTodos(todos, 'completed');
    } else if (pathname === "#/") {
        filteredTodos = filterTodos(todos, "alltodos");
    }
    
    return Didact.createElement('div', { className: 'todo-container' },
        Didact.createElement('h1', { className: 'title' }, 'TODOS'),
        Didact.createElement('div', { className: 'todo-header' },
            Didact.createElement('input', {
                type: 'text',
                className: 'todo-input',
                placeholder: 'What needs to be done?',
                // onKeyup: (e) => {
                //     if (e.key === 'Enter' && e.target.value.trim()) {
                //         store.dispatch({
                //             type: 'ADD_TODO',
                //             payload: {
                //                 id: Date.now(),
                //                 text: e.target.value.trim(),
                //                 completed: false
                //             }
                //         });
                //         store.subscribe(update);
                //         e.target.value = '';
                //     }
                // }
            })
        ),
        todos.length != 0 ? createTabs() : "",
        TodoList(filteredTodos),
        todos.length != 0 ?
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
            ) : "",
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
    return Didact.createElement('div', { className: 'tab-container '},
        Didact.createElement('a', { href: '#/',
            onClick: () => store.dispatch({ type: 'SET_FILTER', payload: 'all'})
         },
            Didact.createElement('button', { className: `tab ${pathname === '#/' ? 'active' : ''}` }, 'All todos')
        ),
        Didact.createElement('a', { href: '#/active',
            onClick: () => store.dispatch({ type: 'SET_FILTER', payload: 'active'})
         },
            Didact.createElement('button', { className: `tab ${pathname === '#/active' ? 'active' : ''}` }, 'Active')
        ),
        Didact.createElement('a', { href: '#/completed',
            onClick: () => store.dispatch({ type: 'SET_FILTER', payload: 'completed'})
         },
            Didact.createElement('button', { className: `tab ${pathname === '#/completed' ? 'active' : ''}`}, 'Completed')
        )
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
    eventEnter()
}

function eventEnter() {
    let input = document.querySelector(".todo-input")
    addCustomEventListener(input, "keydown", (eventData) => {
        if (eventData.target.value.trim() !== "" && (eventData.key === "Enter" || eventData.code === "Enter")) {
            store.dispatch({
                type: 'ADD_TODO',
                payload: {
                    id: Date.now(),
                    text: eventData.target.value.trim(),
                    completed: false
                }
            });
            store.subscribe(update);
            eventData.target.value = '';
        }

    }, "keydown")
}

store.subscribe(update);

update();
