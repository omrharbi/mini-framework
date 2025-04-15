# Virtual DOM Framework Documentation

## Introduction
This framework provides a lightweight virtual DOM implementation, event system, state management, and simple routing. It enables efficient UI updates by performing a diffing algorithm, supports declarative event handling, and allows for seamless state updates and navigation.

## Installation & Setup
To test and run the framework, you can use `live-server`. Install it globally if you haven't already:

```sh
npm install -g live-server
```

Run the following command to start the server:

```sh
npx live-server --port=5500 --entry-file=index.html
```

Ensure you have an `index.html` file in the root directory where you include and use this framework.

## Features
- 🚀 **Blazing Fast Rendering**: Optimized diffing algorithm

- 🧩 **Component-Based**: Reusable UI components

- 🔄 **Reactive State**: Automatic UI updates

- 🎛 **Event Delegation**: Efficient event handling

- 🗺 **SPA Routing**: Seamless navigation
---

## Getting Started
### 1. Creating an Element
To create a virtual DOM element, use `createVDOM`:
```javascript
import { createVDOM } from "./miniframework.js";

const vNode = createVDOM("div", { id: "app" }, ["Hello World"]);
console.log(vNode);
```
**Output:**
```json
{
  "tag": "div",
  "attrs": { "id": "app" },
  "children": ["Hello World"]
}
```

### 2. Rendering an Element
Use `renderComponent` to render a virtual component inside a root element:
```javascript
import { renderComponent, setRoot } from "./miniframework.js";

setRoot("app");

function App() {
    return createVDOM("h1", {}, ["Welcome to My Framework"]);
}

renderComponent(App);
```

---

## Event Handling
### Adding an Event to an Element
Use event attributes like `onClick` inside the virtual DOM:
```javascript
import { createVDOM, renderComponent, setRoot } from "./miniframework.js";

setRoot("app");

function handleClick() {
    alert("Button Clicked!");
}

function App() {
    return createVDOM("button", { onClick: handleClick }, ["Click Me"]);
}

renderComponent(App);
```

### Removing an Event
To remove an event, use `myEventSystem.removeEvent`:
```javascript
import { myEventSystem } from "./miniframework.js";

const button = document.getElementById("myButton");
myEventSystem.removeEvent(button, "click", handleClick);
```

---

## Nesting Elements
You can nest elements inside each other using the `children` array:
```javascript
function App() {
    return createVDOM("div", {}, [
        createVDOM("h1", {}, ["Title"]),
        createVDOM("p", {}, ["This is a paragraph"])
    ]);
}
```

---

## Adding Attributes
You can add attributes using the `attrs` object:
```javascript
function App() {
    return createVDOM("input", { type: "text", placeholder: "Enter text" }, []);
}
```

---

## Routing

### Defining Routes
Use `setRoutes` to define routes and `handleLocation` to navigate:
```javascript
import { setRoutes, handleLocation, route } from "./miniframework.js";

function Home() {
    return createVDOM("h1", {}, ["Home Page"]);
}

function About() {
    return createVDOM("h1", {}, ["About Page"]);
}

setRoutes({
    "/": Home,
    "/about": About,
    404: () => createVDOM("h1", {}, ["Page Not Found"]),
});
```

### Navigating Between Routes
There are two primary ways to navigate:

#### 1. Using Anchor Tags
```html
<a href="/about" onclick="route(event)">Go to About</a>
```

#### 2. Programmatic Navigation
You can redirect programmatically using `route()` by passing an object with a `target.href`:
```javascript
// Inside a component or event handler
route({ target: { href: '/results' } });

// Example in a form submission
function handleSubmit(e) {
    e.preventDefault();
    // Perform some actions
    route({ target: { href: '/results' } });
}

// Example in a button click handler
function handleButtonClick() {
    route({ target: { href: '/dashboard' } });
}
```

This method allows you to:
- Redirect from event handlers
- Perform navigation after async operations
- Create custom navigation logic

The `route()` function will:
- Prevent default event behavior (if applicable)
- Update the browser's history state
- Render the corresponding component

### Handling Browser History
The framework automatically handles browser back and forward navigation:
```javascript
// This is typically set up in your main app file
myEventSystem.addEvent(window, 'popstate', handleLocation);
```

This ensures smooth navigation experience in single-page applications.

## State Management
### Setting and Getting State
Use `StateManagement` to manage application state:
```javascript
import { StateManagement } from "./miniframework.js";

StateManagement.setState({ username: "JohnDoe" });
console.log(StateManagement.getState());
```

### Subscribing to State Changes
```javascript
StateManagement.subscribe((newState) => {
    console.log("State updated:", newState);
});
```

---

## How It Works
1. **Virtual DOM**: A lightweight representation of the real DOM.
2. **Diffing Algorithm**: Compares the old and new virtual DOMs and updates only changed elements.
3. **Event System**: Uses delegation for efficient event handling.
4. **State Management**: Stores state in localStorage and updates subscribed components.
5. **Routing**: Uses `window.history.pushState` to change URLs without reloading.

## 🔍 Learn from app.js

The provided `app.js` demonstrates:
- Component composition
- State management
- Event handling
- Routing integration
- Proper initialization

For a complete working example, refer to the `app.js` implementation in your project.

---
## Conclusion
This framework provides a minimal and efficient way to create dynamic web applications using a virtual DOM. By leveraging diffing, event delegation, and state management, it allows for fast UI updates and seamless navigation.

Happy Coding! 🚀

