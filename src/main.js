import {Didact} from './CreateElement.js'
const element =
    Didact.createElement('div', { className: 'todo-container' },
        // Didact.createElement('button', { className: 'add-button' },
        //     Didact.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 24 24" },
        //         Didact.createElement('g', { fill: "none", fillRule: "evenodd", stroke: "#fff", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", transform: "translate(2 2)" },
        //             Didact.createElement('line', { x1: "10", x2: "10", y1: "6.327", y2: "13.654" }),
        //             Didact.createElement('line', { x1: "13.667", x2: "6.333", y1: "9.99", y2: "9.99" }),
        //             Didact.createElement('path', { d: "M14.6857143,0 L5.31428571,0 C2.04761905,0 0,2.31208373 0,5.58515699 L0,14.414843 C0,17.6879163 2.03809524,20 5.31428571,20 L14.6857143,20 C17.9619048,20 20,17.6879163 20,14.414843 L20,5.58515699 C20,2.31208373 17.9619048,0 14.6857143,0 Z" })
        //         )
        //     )
        // ),
        Didact.createElement('input', { 
            type: 'text', 
            className: 'todo-input', 
            placeholder: 'Add a new task...', 
            onInput: (e) => {
                console.log(e.target.value);
            }
        }),
        Didact.createElement('div', { className: 'tab-container' },
            Didact.createElement('button', { className: 'tab' }, 'Active'),
            Didact.createElement('button', { className: 'tab' }, 'Completed'),
            Didact.createElement('button', { className: 'tab' }, 'All todos')
        ),
        Didact.createElement('div', { className: 'todo-list' },
            Didact.createElement('div', { className: 'todo-item completed' },
                Didact.createElement('div', { className: 'todo-checkbox checked' }),
                Didact.createElement('div', { className: 'todo-text', style: 'text-decoration: line-through;' }, "Don't worry"),
                Didact.createElement('button', { className: 'delete-button' }, '×')
            ),
            Didact.createElement('div', { className: 'todo-item' },
                Didact.createElement('div', { className: 'todo-checkbox' }),
                Didact.createElement('div', { className: 'todo-text' }, 'Be happy'),
                Didact.createElement('button', { className: 'delete-button' }, '×')
            )
        ),
        // Didact.createElement('button', { className: 'trash-button' },
        //     Didact.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", fill: "#fff", viewBox: "0 0 24 24" },
        //         Didact.createElement('g', null,
        //             Didact.createElement('path', { d: "M18 4h-1V3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1H6a3 3 0 0 0-3 3v2a1 1 0 0 0 1 1h.069l.8 11.214A3.012 3.012 0 0 0 7.862 24h8.276a3.012 3.012 0 0 0 2.992-2.786L19.931 10H20a1 1 0 0 0 1-1V7a3 3 0 0 0-3-3ZM9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9ZM5 7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1H5Zm12.136 14.071a1 1 0 0 1-1 .929H7.862a1 1 0 0 1-1-.929L6.074 10h11.852Z" }),
        //             Didact.createElement('path', { d: "M10 20a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1zm4 0a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1z" })
        //         )
        //     )
        // )
    );

Didact.render(element, document.body)
