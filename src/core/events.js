export const MyEvents = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    },
    trigger(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

export function handleEvent(eventType, domElement, customEventName) {
    const handler = (event) => {
        const eventData = {
            type: event.type,
            target: event.target,
            clientX: event.clientX ?? null,
            clientY: event.clientY ?? null,
            key: event.key ?? null,
            code: event.code ?? null,
            shiftKey: event.shiftKey ?? false,
            ctrlKey: event.ctrlKey ?? false,
            altKey: event.altKey ?? false,
            value: event.target?.value ?? null,
            scrollTop: event.target?.scrollTop ?? null,
            scrollLeft: event.target?.scrollLeft ?? null,
            scrollHeight: event.target?.scrollHeight ?? null,
            scrollWidth: event.target?.scrollWidth ?? null,
        };

        if (event.key === 'Enter' || event.code === 'Enter') {
            MyEvents.trigger('enterKeyPress', eventData);
        }

        MyEvents.trigger(customEventName || eventType, eventData);
    };

    domElement.addEventListener(eventType, handler);
    return handler;
}

export function addCustomEventListener(domElement, eventType, callback, customEventName) {
    const handler = handleEvent(eventType, domElement, customEventName);
    MyEvents.on(customEventName || eventType, callback);
    return () => {
        domElement.removeEventListener(eventType, handler);
        MyEvents.off(customEventName || eventType, callback);
    };
}