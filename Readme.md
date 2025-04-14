# Mini Frontend Framework Documentation

This documentation provides a comprehensive guide to our lightweight frontend framework, designed for creating simple, reactive web applications with a component-based approach.

## Framework Overview

Our framework offers a minimalist yet powerful approach to building web applications with the following features:

- **JSX-like Syntax**: Create UI elements using a familiar syntax similar to React
- **Component-Based Architecture**: Build UIs by composing reusable components
- **State Management**: Simple Redux-like store for application state
- **Event Handling**: Custom event system for DOM interactions
- **Routing**: Basic hash-based routing for navigation between views

## Core Concepts

### Creating Elements

The framework uses a JSX-like syntax to create DOM elements. You can create elements using the `jsx` function.

```javascript
// Basic element creation
const element = jsx('div', { className: 'container' }, 'Hello World');

// Creating with attributes
const button = jsx('button', { 
  className: 'btn',
  id: 'submit-btn'
}, 'Click Me');

// Nesting elements
const card = jsx('div', { className: 'card' },
  jsx('h2', { className: 'card-title' }, 'Card Title'),
  jsx('p', { className: 'card-content' }, 'This is card content')
);
```

### Event Handling

The framework provides a custom event system for handling DOM events:

```javascript
// Adding a click event
const button = jsx('button', { 
  onClick: (event) => {
    console.log('Button clicked!', event);
  }
}, 'Click Me');

// Adding other events
const input = jsx('input', {
  type: 'text',
  onKeyup: (event) => {
    if (event.key === 'Enter') {
      console.log('Enter pressed!', event.target.value);
    }
  }
});
```

The framework automatically converts attributes like `onClick` to proper DOM event listeners. All standard DOM events are supported - just prefix them with `on` followed by the event name in camelCase (e.g., `onClick`, `onSubmit`, `onKeyup`).

### Nesting Elements

Elements can be nested to create complex UI structures:

```javascript
// Complex nested structure
const userProfile = jsx('div', { className: 'profile' },
  jsx('div', { className: 'profile-header' },
    jsx('img', { src: 'avatar.png', className: 'avatar' }),
    jsx('h2', { className: 'username' }, 'John Doe')
  ),
  jsx('div', { className: 'profile-body' },
    jsx('p', { className: 'bio' }, 'Frontend Developer'),
    jsx('div', { className: 'stats' },
      jsx('span', {}, 'Posts: 42'),
      jsx('span', {}, 'Followers: 1024')
    )
  )
);
```

You can also use the spread operator with arrays of children:

```javascript
const items = ['Apple', 'Banana', 'Cherry'];
const list = jsx('ul', { className: 'fruit-list' },
  ...items.map(item => jsx('li', {}, item))
);
```

### Components

Components are functions that return JSX elements. They let you create reusable pieces of UI:

```javascript
function Button({ text, onClick }) {
  return jsx('button', { 
    className: 'custom-button',
    onClick
  }, text);
}

// Using the component
const myButton = jsx(Button, { 
  text: 'Submit',
  onClick: () => console.log('Button clicked')
});
```

### Adding Attributes

You can add various HTML attributes to elements:

```javascript
// Standard attributes
const image = jsx('img', {
  src: 'image.jpg',
  alt: 'Description',
  width: '100',
  height: '100'
});

// Using className for CSS classes
const styledDiv = jsx('div', {
  className: 'container primary large',
  id: 'main-container'
});

// Inline styles (as string)
const styledElement = jsx('p', {
  style: 'color: blue; font-size: 16px;'
}, 'Styled text');
```

## State Management

The framework includes a simple Redux-like store for state management:

```javascript
// Create a store with initial state
const initialState = {
  counter: 0,
  user: null
};

const store = createStore(initialState);

// Get current state
const state = store.getState();

// Update state with actions
store.dispatch({
  type: 'INCREMENT_COUNTER'
});

store.dispatch({
  type: 'SET_USER',
  payload: { id: 1, name: 'John' }
});
```

Your application should call an update function after state changes to re-render the UI:

```javascript
function update() {
  render(App(), document.getElementById('root'));
}

// Call update after dispatching actions
store.dispatch({ type: 'INCREMENT_COUNTER' });
update();
```

## Routing

The framework provides basic hash-based routing:

```javascript
// Create router
const router = createRouter();

// Get current hash path
const currentPath = router.getHashPath();

// Listen for hash changes
MyEventSystem.addEventListener(window, "hashchange", () => {
  const newPath = router.getHashPath();
  console.log('Route changed to:', newPath);
  update(); // Re-render the application
});
```

## Example Application

Here's a complete example of a simple counter application:

```javascript
import { jsx, render } from './framework.js';
import { createStore } from './store.js';
import { MyEventSystem } from './event.js';

// Initialize store
const initialState = { count: 0 };
const store = createStore(initialState);

// Define reducer for handling actions
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Counter component
function Counter() {
  const { count } = store.getState();
  
  return jsx('div', { className: 'counter' },
    jsx('h1', {}, 'Counter App'),
    jsx('div', { className: 'counter-display' }, count),
    jsx('div', { className: 'counter-controls' },
      jsx('button', { 
        className: 'btn decrement',
        onClick: () => {
          store.dispatch({ type: 'DECREMENT' });
          update();
        }
      }, '-'),
      jsx('button', { 
        className: 'btn increment',
        onClick: () => {
          store.dispatch({ type: 'INCREMENT' });
          update();
        }
      }, '+')
    )
  );
}

// Render application
function update() {
  render(Counter(), document.getElementById('root'));
}

update();
```

## Implementation Details

### How the JSX Function Works

The `jsx` function creates virtual DOM nodes:

```javascript
function jsx(tag, attrs, ...children) {
  if (typeof tag === "function") {
    return tag({ ...attrs, children });
  }

  return { tag, attrs: attrs || {}, children };
}
```

If `tag` is a function, it's treated as a component and called with props. Otherwise, it creates a virtual node object with the tag name, attributes, and children.

### How Element Creation Works

The framework transforms virtual DOM nodes into real DOM elements:

```javascript
function createElement(node) {
  if (["string", "number"].includes(typeof node)) {
    return document.createTextNode(node.toString());
  }

  const element = document.createElement(node.tag);
  
  // Add attributes and event listeners
  for (const [key, value] of Object.entries(node.attrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      MyEventSystem.addEventListener(element, key.slice(2).toLowerCase(), value);
    } else {
      if (key === 'className') {
        element.setAttribute('class', value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  // Create and append children
  for (const child of node.children.flat()) {
    element.appendChild(createElement(child));
  }

  return element;
}
```

This function:
1. Creates text nodes for string/number values
2. Creates DOM elements for tags
3. Sets attributes and registers event listeners
4. Recursively processes and appends children

### Event System

The custom event system abstracts DOM event handling:

```javascript
// Register event listener
MyEventSystem.addEventListener(domElement, eventType, callback);

// Event is automatically dispatched when it occurs
// The system manages the conversion between our framework events and native DOM events
```

## Best Practices

1. **Component Organization**: Create small, focused components for better reusability
2. **State Management**: Keep application state centralized in the store
3. **Event Handling**: Use the framework's event system for all DOM interactions
4. **Re-rendering**: Call the update function after state changes to refresh the UI
5. **Routing**: Use hash-based routing for navigation between views

## Conclusion

This mini framework provides a simple yet effective way to build web applications with a component-based approach. While it lacks some features of larger frameworks, it offers enough functionality for small to medium-sized applications while maintaining a small footprint.