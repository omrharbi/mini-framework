export const MyEventSystem = {
    listeners: new Map(),

    addEventListener(domElement, eventType, callback) {
        if (!this.listeners.has(domElement)) {
            this.listeners.set(domElement, {});
        }
        
        const elementListeners = this.listeners.get(domElement);

        if (!elementListeners[eventType]) {
            elementListeners[eventType] = [];
            domElement[`on${eventType}`] = (nativeEvent) => {
                this.dispatchEvent(domElement, eventType, nativeEvent);
            };
        }
        elementListeners[eventType].push({ callback });
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