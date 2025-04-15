/**
 * @file vdom-framework.js
 * @description
 * A lightweight Virtual DOM framework for rendering and diffing DOM elements, 
 * managing global state, handling routing, and managing event listeners.
 * 
 * Main Features:
 * - createVDOM: Create a virtual DOM node.
 * - render: Convert virtual DOM to real DOM.
 * - diffing: Efficiently update the DOM using diffing.
 * - StateManagement: Global state storage with listener support and localStorage persistence.
 * - renderComponent: Handle rendering and re-rendering of VDOM-based components.
 * - Routing: Client-side route management via history API.
 * - myEventSystem: Delegated event listener system with automatic cleanup.
 * 
 * Exports:
 * - createVDOM
 * - route
 * - handleLocation
 * - setRoutes
 * - setRoot
 * - StateManagement
 * - myEventSystem
 * - renderComponent
 */

// ------------------ Virtual DOM ------------------

/**
 * Creates a virtual DOM node.
 * @param {string} tag - HTML tag name (e.g., "div").
 * @param {Object} attrs - Attributes like id, class, onClick, etc.
 * @param {Array} children - Nested virtual DOM nodes or strings.
 * @returns {Object} A VDOM node.
 */
function createVDOM(tag, attrs = {}, children = []) {
    return { tag, attrs, children };
}

/**
 * Converts a virtual DOM node to an actual DOM element.
 * @param {Object|string} vDOM - Virtual DOM or string.
 * @returns {Node} A DOM Node (HTMLElement or TextNode).
 */
function render(vDOM) {
    if (!vDOM) return document.createComment("Empty node");
    if (typeof vDOM === "string") return document.createTextNode(vDOM);
    if (!vDOM.tag) return document.createComment("Invalid VDOM node");

    const element = document.createElement(vDOM.tag);

    for (const key in vDOM.attrs) {
        if (key.startsWith("on")) {
            const event = key.toLowerCase().slice(2);
            myEventSystem.addEvent(element, event, vDOM.attrs[key]);
        } else if (key === "checked") {
            element.checked = vDOM.attrs[key];
        } else {
            element.setAttribute(key, vDOM.attrs[key]);
        }
    }

    vDOM.children.forEach(child => {
        element.appendChild(render(child));
    });

    return element;
}

let rootElement = null;

/**
 * Sets the root element where components will render.
 * @param {string} elementId - ID of the root DOM element.
 */
function setRoot(elementId) {
    rootElement = document.getElementById(elementId);
}

let currentComponent = null;

/**
 * Diffs two virtual DOM trees and updates the real DOM.
 * @param {HTMLElement} root - Root DOM node.
 * @param {Object|string} oldVDOM - Previous virtual DOM.
 * @param {Object|string} newVDOM - New virtual DOM.
 * @param {number} index - Child index in the parent node.
 */
function diffing(root, oldVDOM, newVDOM, index = 0) {
    const currentChild = root.childNodes[index];
    if (!newVDOM && !oldVDOM) return;
    if (!newVDOM) {
        if (currentChild) root.removeChild(currentChild);
        return;
    }
    if (!oldVDOM) {
        root.appendChild(render(newVDOM));
        return;
    }

    if (typeof newVDOM === "string" || typeof oldVDOM === "string") {
        if (typeof newVDOM === "string" && typeof oldVDOM === "string") {
            if (newVDOM !== oldVDOM && currentChild) currentChild.textContent = newVDOM;
        } else if (currentChild) {
            root.replaceChild(render(newVDOM), currentChild);
        } else {
            root.appendChild(render(newVDOM));
        }
        return;
    }

    if (newVDOM.tag !== oldVDOM.tag) {
        if (currentChild) root.replaceChild(render(newVDOM), currentChild);
        else root.appendChild(render(newVDOM));
        return;
    }

    if (currentChild) {
        for (const attr in newVDOM.attrs) {
            if (attr === "checked") {
                if (currentChild.checked !== newVDOM.attrs[attr]) {
                    currentChild.checked = newVDOM.attrs[attr];
                }
            } else if (newVDOM.attrs[attr] !== oldVDOM.attrs[attr]) {
                if (attr.startsWith("on")) {
                    const event = attr.toLowerCase().slice(2);
                    myEventSystem.removeEvent(currentChild, event, oldVDOM.attrs[attr]);
                    myEventSystem.addEvent(currentChild, event, newVDOM.attrs[attr]);
                } else {
                    currentChild.setAttribute(attr, newVDOM.attrs[attr]);
                }
            }
        }

        for (const attr in oldVDOM.attrs) {
            if (!newVDOM.attrs[attr]) currentChild.removeAttribute(attr);
        }
    }

    const oldChildren = oldVDOM.children || [];
    const newChildren = newVDOM.children || [];
    const maxLen = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLen; i++) {
        diffing(currentChild, oldChildren[i], newChildren[i], i);
    }

    if (oldChildren.length > newChildren.length && currentChild) {
        for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
            if (i < currentChild.childNodes.length) {
                currentChild.removeChild(currentChild.childNodes[i]);
            }
        }
    }
}

let haveNewState = false;

/**
 * Renders a component and handles diffing if already rendered.
 * @param {Function} component - A function returning a virtual DOM.
 */
function renderComponent(component) {
    if (haveNewState) {
        myEventSystem.cleanAllEvents();
        haveNewState = false;
    }

    if (!rootElement) {
        console.error("Root element is not set. Call setRoot(elementId).");
        return;
    }

    const newVDOM = component();

    if (currentComponent === null) {
        currentComponent = newVDOM;
        rootElement.innerHTML = "";
        rootElement.appendChild(render(newVDOM));
    } else {
        diffing(rootElement, currentComponent, newVDOM);
        currentComponent = newVDOM;
    }
}

// ------------------ Routing ------------------

let globalRoutes = {};

/**
 * Navigates to a route by intercepting anchor clicks.
 * @param {Event} event - Link click event.
 */
function route(event) {
    if (event.preventDefault) event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    myEventSystem.cleanAllEvents();
    handleLocation();
}

/**
 * Handles rendering the component for the current path.
 */
function handleLocation() {
    const path = window.location.pathname;
    if (!globalRoutes[path] && !globalRoutes[404]) {
        console.error("No route found, and no 404 handler is set.");
        return;
    }
    const component = globalRoutes[path] || globalRoutes[404];
    renderComponent(component);
    StateManagement.setState(StateManagement.getState());
}

/**
 * Sets available routes.
 * @param {Object} routes - Object of path -> component mappings.
 */
function setRoutes(routes) {
    globalRoutes = routes;
}

// ------------------ Global State Management ------------------

const StateManagement = {
    state: JSON.parse(localStorage.getItem("myState")) || {},
    listeners: [],
    haveNewState: false,

    notify() {
        localStorage.setItem("myState", JSON.stringify(this.state));
        this.listeners.forEach(listener => listener(this.state));
    },

    getState() {
        return this.state;
    },

    setState(newState) {
        if (newState !== this.state) this.haveNewState = true;
        this.state = { ...this.state, ...newState };
        this.notify();
    },

    deleteState(key) {
        if (this.state.hasOwnProperty(key)) {
            delete this.state[key];
            this.notify();
        }
    },

    resetState() {
        localStorage.removeItem("myState");
        this.state = {};
        this.notify();
    },

    /**
     * Subscribes a listener to state changes.
     * @param {Function} listener - Function to call on state change.
     * @returns {Function} Unsubscribe function.
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
};

// ------------------ Event System ------------------

const myEventSystem = {
    events: {},
    eventListeners: {},

    addEvent(element, eventType, handler, protect = false) {
        if (element === window || element === document) {
            if (!this.events[eventType]) {
                this.events[eventType] = [];
                element.addEventListener(eventType, handler);
            }
            this.events[eventType].push({ element, handler, protect });
            return;
        }

        if (!this.events[eventType]) {
            this.events[eventType] = [];
            this.eventListeners[eventType] = (e) => this.handleEvent(eventType, e);
            document.body.addEventListener(eventType, this.eventListeners[eventType], true);
        }

        this.events[eventType].push({ element, handler, protect });
    },

    removeEvent(element, eventType, handler) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(
                evtObj => !(evtObj.element === element && evtObj.handler === handler)
            );
            if (this.events[eventType].length === 0) {
                document.body.removeEventListener(eventType, this.eventListeners[eventType]);
                delete this.events[eventType];
                delete this.eventListeners[eventType];
            }
        }
    },

    cleanAllEvents() {
        for (const eventType in this.events) {
            const protectedEvents = this.events[eventType].filter(event => event.protect);
            if (protectedEvents.length === 0) {
                document.body.removeEventListener(eventType, this.eventListeners[eventType]);
                delete this.events[eventType];
                delete this.eventListeners[eventType];
            } else {
                this.events[eventType] = protectedEvents;
            }
        }
    },

    handleEvent(eventType, event) {
        if (!this.events[eventType]) return;
        this.events[eventType].forEach(({ element, handler }) => {
            if (element === event.target || element.contains(event.target)) {
                handler(event);
            }
        });
    }
};

export {
    createVDOM,
    route,
    handleLocation,
    setRoutes,
    setRoot,
    StateManagement,
    myEventSystem,
    renderComponent
};
