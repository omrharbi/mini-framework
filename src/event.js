export const MyEventSystem = {
    // Store all event listeners
    listeners: new Map(),

    // Add an event listener
    addEventListener(domElement, eventType, callback) {
        // Initialize listeners for this element if not present
        if (!this.listeners.has(domElement)) {
            this.listeners.set(domElement, {});
        }
        

        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners[eventType]) {
            elementListeners[eventType] = [];

            // Attach native listener only once
            domElement[`on${eventType}`] = (nativeEvent) => {
                this.dispatchEvent(domElement, eventType, nativeEvent);
            };
        }

        // Prevent duplicate registration
        const alreadyExists = elementListeners[eventType].some(
            (listener) => listener.callback === callback
        );

        if (!alreadyExists) {
            elementListeners[eventType].push({ callback });
        }
    },

    // Remove an event listener
    removeEventListener(domElement, eventType, callback) {
        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners || !elementListeners[eventType]) {
            return;
        }

        // Filter out the specific listener
        elementListeners[eventType] = elementListeners[eventType].filter(
            (listener) => listener.callback !== callback
        );

        // Optional: clean up if no listeners remain
        if (elementListeners[eventType].length === 0) {
            delete elementListeners[eventType];
            domElement[`on${eventType}`] = null;
        }

        if (Object.keys(elementListeners).length === 0) {

            this.listeners.delete(domElement);
        }
    },

    // Dispatch an event to all registered listeners
    dispatchEvent(domElement, eventType, nativeEvent) {
        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners || !elementListeners[eventType]) {
            return;
        }

        // Call all registered callbacks
        elementListeners[eventType].forEach((listener) => {
            listener.callback(nativeEvent);

        });
    },
};
