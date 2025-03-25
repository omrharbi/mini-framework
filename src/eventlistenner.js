import { createRouter } from "./Router.js";
// Créer une instance globale du routeur
window.Router = createRouter();
const MyEvents = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    trigger(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((callback) => callback(data));
        }
    },
};

function handleEvent(eventType, domElement, customEventName) {

    domElement[`on${eventType}`] = (event) => {
        const eventData = {
            type: event.type, //
            target: event.target,
            clientX: event.clientX || null,
            clientY: event.clientY || null,
            key: event.key || null, // The key pressed (e.g., "a", "Enter")
            code: event.code || null, // Physical key (e.g., "KeyA", "ArrowUp")
            shiftKey: event.shiftKey || false, // Was Shift key pressed?
            ctrlKey: event.ctrlKey || false, // Was Ctrl key pressed?
            altKey: event.altKey || false, // Was Alt key pressed?
            value: event.target.value || null,
            scrollTop: event.target.scrollTop || null, // Vertical scroll position
            scrollLeft: event.target.scrollLeft || null, // Horizontal scroll position
            scrollHeight: event.target.scrollHeight || null, // Total height of the content
            scrollWidth: event.target.scrollWidth || null, // Total width of the content
        };
        MyEvents.trigger(customEventName || eventType, eventData);
    };
}

document.querySelectorAll(".tab").forEach((button) => {
    handleEvent("click", button, "click");
});
MyEvents.on("click", (eventData) => {
    const clickedButton = eventData.target;
    document.querySelectorAll(".tab").forEach((button) => {
        button.classList.remove("active");
    });

    clickedButton.classList.add("active");
    console.log(clickedButton.textContent);
    const newB = clickedButton.textContent.replace(/\s+/g, '');  // This removes all spaces

    const newPath = `/${newB.toLowerCase()}`;
    Router.navigate(newPath);
});