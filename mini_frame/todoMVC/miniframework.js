function createVDOM(tag, attrs = {}, children = []) {
    return { tag, attrs, children };
}

function render(vDOM) {

    if (!vDOM) { // for IE
        console.warn("Skipping undefined VDOM node:", vDOM);
        return document.createComment("Empty node");
    }

    if (typeof vDOM === "string") {
        return document.createTextNode(vDOM);
    }

    if (!vDOM.tag) { // for IE
        console.warn("VDOM node missing 'tag' property:", vDOM);
        return document.createComment("Invalid VDOM node");
    }

    const element = document.createElement(vDOM.tag);

    for (const key in vDOM.attrs) {
        if (key.startsWith("on")) {
            const event = key.toLowerCase().slice(2);
            myEventSystem.addEvent(element, event, vDOM.attrs[key]);
        } else if (key === "checked") {
            // Special handling for checked property
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

function setRoot(elementId) {
    rootElement = document.getElementById(elementId);
}

let currentComponent = null

function diffing(root, oldVDOM, newVDOM, index = 0) {
    const currentChild = root.childNodes[index];

    // Handle null/undefined cases
    if (!newVDOM && !oldVDOM) return;
    if (!newVDOM) {
        if (currentChild) {
            root.removeChild(currentChild);
        }
        return;
    }
    if (!oldVDOM) {
        root.appendChild(render(newVDOM));
        return;
    }

    // Handle text nodes
    if (typeof newVDOM === "string" || typeof oldVDOM === "string") {
        if (typeof newVDOM === "string" && typeof oldVDOM === "string") {
            if (newVDOM !== oldVDOM && currentChild) {
                currentChild.textContent = newVDOM;
            }
        } else if (currentChild) {
            root.replaceChild(render(newVDOM), currentChild);
        } else {
            root.appendChild(render(newVDOM));
        }
        return;
    }

    // Handle tag changes
    if (newVDOM.tag !== oldVDOM.tag) {
        if (currentChild) {
            root.replaceChild(render(newVDOM), currentChild);
        } else {
            root.appendChild(render(newVDOM));
        }
        return;
    }

    if (currentChild) {
        // Set new attributes
        for (const attr in newVDOM.attrs) {
            if (attr === "checked") {
                // Special handling for checkbox state
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

        // Remove attributes that don't exist in newVDOM
        for (const attr in oldVDOM.attrs) {
            if (!newVDOM.attrs[attr]) {
                currentChild.removeAttribute(attr)
            }
        }
    }

    // Diff children (recursion)
    const oldChildren = oldVDOM.children || [];
    const newChildren = newVDOM.children || [];
    const maxLen = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLen; i++) {
        diffing(currentChild, oldChildren[i], newChildren[i], i);
    }

    // Remove excess old children
    if (oldChildren.length > newChildren.length && currentChild) {
        for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
            if (i < currentChild.childNodes.length) {
                currentChild.removeChild(currentChild.childNodes[i]);
            }
        }
    }
}

let haveNewState = false

function renderComponent(component) {
    if (haveNewState) {
        myEventSystem.cleanAllEvents()
        haveNewState = false
    }

    if (!rootElement) {
        console.error("Root element is not set. Call setRoot(elementId) before rendering components.");
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

let globalRoutes = {};

function route(event) {
    if (event.preventDefault) event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    myEventSystem.cleanAllEvents()
    handleLocation();
}

function handleLocation() {
    const path = window.location.pathname;
    if (!globalRoutes[path] && !globalRoutes[404]) {
        console.error("No route found, and no 404 handler is set.");
        return;
    }
    const component = globalRoutes[path] || globalRoutes[404];
    renderComponent(component);
    StateManagement.setState(StateManagement.getState())
}

function setRoutes(routes) {
    globalRoutes = routes;
}

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
        if (newState !== this.state) {
            this.haveNewState = true;
        }
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

    subscribe(listener) {
        this.listeners.push(listener);
        // for unsubscribe
        // to use const unsubscribe = StateManagement.subscribe(myListenerFunction);
        // unsubscribe(); to remove the listeners protect (memory leaks)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
};

const myEventSystem = {
    events: {},
    // Store actual event handler functions by type to allow proper removal
    eventListeners: {},

    addEvent(element, eventType, handler, protect = false) {
        // Special handling for window/document events (like popstate)
        if (element === window || element === document) {
            if (!this.events[eventType]) {
                this.events[eventType] = [];
                element.addEventListener(eventType, handler);
            }
            this.events[eventType].push({ element, handler, protect });
            return;
        }
        // Always attach to document.body for delegation
        if (!this.events[eventType]) {
            this.events[eventType] = [];
            this.eventListeners[eventType] = (e) => this.handleEvent(eventType, e);
            document.body.addEventListener(eventType, this.eventListeners[eventType], true); // Use capture phase
        }

        // Store the element and handler
        this.events[eventType].push({ element, handler, protect });
    },

    removeEvent(element, eventType, handler) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(
                (evtObj) => !(evtObj.element === element && evtObj.handler === handler)
            );

            // If no handlers left for this event type, remove the listener from the DOM
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

            if (protectedEvents.length === 0 && this.events[eventType].length > 0) {
                // Remove the actual event listener using the stored reference
                document.body.removeEventListener(eventType, this.eventListeners[eventType]);
                delete this.events[eventType];
                delete this.eventListeners[eventType];
            }
            else {
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

export { createVDOM, route, handleLocation, setRoutes, setRoot, StateManagement, myEventSystem, renderComponent };
