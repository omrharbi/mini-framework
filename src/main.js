import { addEventListener, addEventListeners } from "./evenet";

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

// Universal event handler

export function handleEvent(eventType, domElement, customEventName) {
   addEventListener(eventType, (event) => {
      const eventData = {
          type: event.type,
          target: event.target,
          clientX: event.clientX || null,
          clientY: event.clientY || null,
          key: event.key || null,
          code: event.code || null,
          shiftKey: event.shiftKey || false,
          ctrlKey: event.ctrlKey || false,
          altKey: event.altKey || false,
          value: event.target.value || null,
          scrollTop: event.target.scrollTop || null,
          scrollLeft: event.target.scrollLeft || null,
          scrollHeight: event.target.scrollHeight || null,
          scrollWidth: event.target.scrollWidth || null,
      };

      // Trigger a specific event for "Enter" key press
      if (event.key === 'Enter' || event.code === 'Enter') {
          MyEvents.trigger('enterKeyPress', eventData);
      }

      // Trigger the custom event or the native event
      MyEvents.trigger(customEventName || eventType, eventData);
  });
}

document.querySelectorAll(".tab").forEach((button) => {
  handleEvent("click", button, "click");
});

// Handle the custom event
MyEvents.on("click", (eventData) => {
  const clickedButton = eventData.target; // The button that was clicked

  // Remove 'active' class from all buttons
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.remove("active");
  });
 
  clickedButton.classList.add("active");
 
  console.log(clickedButton.textContent); // Logs the text of the clicked button
});
 