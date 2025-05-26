export const MyEventSystem = {
    listeners: new Map(),

    addEventListener(domElement, eventType, callback) {
        // Store the callback for later removal if needed
        if (!this.listeners.has(domElement)) {
            this.listeners.set(domElement, new Map());
        }
        
        const elementListeners = this.listeners.get(domElement);
        
        // Remove old listener if exists
        if (elementListeners.has(eventType)) {
            const oldCallback = elementListeners.get(eventType);
            domElement.removeEventListener(eventType, oldCallback);
        }
        
        // Add new listener
        domElement.addEventListener(eventType, callback);
        elementListeners.set(eventType, callback);
    },
    removeEventListener(domElement, eventType, callback) {
        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners || !elementListeners[eventType]) {
            return;
        }

        elementListeners[eventType] = elementListeners[eventType].filter(
            listener => listener.callback !== callback
        );

        if (elementListeners[eventType].length === 0) {
            domElement[`on${eventType}`] = null;
            delete elementListeners[eventType];
        }

        if (Object.keys(elementListeners).length === 0) {
            this.listeners.delete(domElement);
        }
    },

    dispatchEvent(domElement, eventType, nativeEvent) {
        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners || !elementListeners[eventType]) {
            return;
        }

        elementListeners[eventType].forEach((listener) => {
            listener.callback(nativeEvent);
        });
    },
};