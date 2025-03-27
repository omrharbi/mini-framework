import { Didact } from '../../src/CreateElement.js';
import  { MyEvents,addCustomEventListener,handleEvent } from '../../src/eventlistenner.js';
import { createStore } from '../../src/store.js';

const initialState = {
    todos: [],
    filter: 'all'
};

const store = createStore(initialState);

function App() {
    const { todos, filter } = store.getState();
    console.log('filter', filter); // catkon 'all' fe bdya mn b3d o nbdloha
    console.log('todos', todos);
   

    const filteredTodos = filterTodos(todos, filter);    

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
                // onClick: () => {
                //     store.dispatch({
                //         type: 'DELETE_COMPLETED_TODO'
                //     })
                // }
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
    eventEnter()

    eventClickBtn()
}
function eventEnter(){
    let input = document.querySelector(".todo-input")
    addCustomEventListener(input,"keydown",(eventData)=>{
        if ( eventData.target.value.trim()!=="" && (eventData.key === "Enter" || eventData.code === "Enter")   ) {
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

    },"keydown")
   
}
function eventClickBtn(){
    let btn = document.querySelector(".trash-button")
    if (btn){
        handleEvent("click", btn, "btnclrear");
        MyEvents.on("btnclrear",(eventData)=>{
            const clickedButton = eventData.target;
            console.log(clickedButton,"const clickedButton = eventData.target;");
            
        })
    }
    document.querySelectorAll(".tab").forEach((button) => {
        handleEvent("click", button, "clickbtn");
    });
    MyEvents.on("clickbtn", (eventData) => {
            const clickedButton = eventData.target;
            document.querySelectorAll(".tab").forEach((button) => {
                button.classList.remove("active");
            });
            clickedButton.classList.add("active");
            const newB = clickedButton.textContent.replace(/\s+/g, '');  // This removes all spaces

            const newPath = `/${newB.toLowerCase()}`;
            Router.navigate(newPath);
        });
}
store.subscribe(update);

update();
