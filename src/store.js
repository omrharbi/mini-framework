export function createStore(initialState) {
    let state = initialState;
    
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
        case 'EDIT_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
                )
            };
        case 'TOGGLE_ALL_TODOS':
            return {
                ...state,
                todos: state.todos.map(todo => ({
                    ...todo,
                    completed: action.payload
                }))
            };
        case 'DELETE_COMPLETED_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.completed)
            };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_EDITING_ID':
            return { ...state, editingId: action.payload };
        case 'CLEAR_EDITING_ID':
            return { ...state, editingId: null };
        default:
            return state;
    }
}