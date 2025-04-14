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
        elementListeners[eventType].push({ callback });
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
