export function createStore(initialState) {
    let state = initialState;
    let listeners = [];

    return {
        getState() {
            return state;
        },
        dispatch(action) {
            state = reducer(state, action);
        },
    };
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                )
            };
        case 'TOGGLE_ALL_TODOS':
            console.log('action.payload:', action.payload);
            return {
                ...state,
                todos: state.todos.map(todo => ({
                    ...todo,
                    completed: action.payload
                }))
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            };
        case 'DELETE_COMPLETED_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.completed)
            };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        default:
            return state;
    }
}