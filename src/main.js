import { Didact } from './CreateElement.js'
import { createStore } from './store.js';

const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);

function App() {

    const { todos, filter } = store.getState();
    console.log(filter); // catkon 'all' fe bdya mn b3d o nbdloha

    const filteredTodos = filterTodos(todos, filter)

    return Didact.createElement('div', { className: 'todo-container' },
        Didact.createElement('h1', { className: 'title' }, 'TODOS'),
        Didact.createElement('div', {className:'todo-header'},
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
        }),
    ),
    createTabs(),
    TodoList(filteredTodos),
    // Didact.createElement('button', { className: 'trash-button' },
    //     Didact.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", fill: "#fff", viewBox: "0 0 24 24" },
    //         Didact.createElement('g', null,
    //             Didact.createElement('path', { d: "M18 4h-1V3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1H6a3 3 0 0 0-3 3v2a1 1 0 0 0 1 1h.069l.8 11.214A3.012 3.012 0 0 0 7.862 24h8.276a3.012 3.012 0 0 0 2.992-2.786L19.931 10H20a1 1 0 0 0 1-1V7a3 3 0 0 0-3-3ZM9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9ZM5 7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1H5Zm12.136 14.071a1 1 0 0 1-1 .929H7.862a1 1 0 0 1-1-.929L6.074 10h11.852Z" }),
    //             Didact.createElement('path', { d: "M10 20a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1zm4 0a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1z" })
    //         )
    //     )
    // )
)


        
}

function TodoList(todos) {
return Didact.createElement('div', { className: 'todo-list' },
    ...todos.map(todo => 
        Didact.createElement('div', { className: `todo-item ${todo.completed ? 'completed' : ''}` },
        Didact.createElement('div', { 
            className: `todo-checkbox ${todo.completed ? 'checked' : ''}`, 
            onClick: () => store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id})
         }),
        Didact.createElement('div', { className: 'todo-text', style: `${todo.completed ? 'text-decoration: line-through;' : '' }` }, todo.text),
        Didact.createElement('button', { 
            className: 'delete-button'
            , onClick: () => store.dispatch({ type: 'DELETE_TODO', payload: todo.id })
        }, '×')
    )
),
)
}

function createTabs() {
    return Didact.createElement('div', { className: 'tab-container' },
        Didact.createElement('button', { className: 'tab' }, 'Active'),
        Didact.createElement('button', { className: 'tab' }, 'Completed'),
        Didact.createElement('button', { className: 'tab' }, 'All todos')
    )
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
