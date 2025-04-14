export const MyEventSystem = {
    // Store all event listeners
    listeners: {},

    // Add an event listener
    addEventListener(domElement, eventType, callback) {
    
        // Initialize the event listener structure if not already present
        if (!this.listeners[domElement]) {
            this.listeners[domElement] = {};
        }
        if (!this.listeners[domElement][eventType]) {
            this.listeners[domElement][eventType] = [];
        }

        // Push the new listener into the array
        this.listeners[domElement][eventType].push({
            callback,
        });

        // Attach a single native event listener to handle all custom listeners
        domElement[`on${eventType}`] = (nativeEvent) => {
            this.dispatchEvent(domElement, eventType, nativeEvent);
        };
         
    },
    
    // Remove an event listener
    removeEventListener(domElement, eventType, callback, options = {}) {
        const useCapture = options.capture || false;

        if (
            !this.listeners[domElement] ||
            !this.listeners[domElement][eventType]
        ) {
            return;
        }

        // Filter out the specific listener
        this.listeners[domElement][eventType] = this.listeners[
            domElement
        ][eventType].filter(
            (listener) =>
                listener.callback !== callback ||
                listener.useCapture !== useCapture
        );
    },

    // Dispatch an event to all registered listeners
    dispatchEvent(domElement, eventType, nativeEvent) {
        if (
            !this.listeners[domElement] ||
            !this.listeners[domElement][eventType]
        ) {
            return;
        }

        // Call all registered listeners for this event type
        this.listeners[domElement][eventType].forEach((listener) => {
            listener.callback(nativeEvent);
        });
    },
};