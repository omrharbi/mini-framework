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

// Handle the custom event
MyEvents.on("click", (eventData) => {
  const clickedButton = eventData.target; // The button that was clicked

  // Remove 'active' class from all buttons
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.remove("active");
  });

  // Add 'active' class to the clicked button
  clickedButton.classList.add("active");

  // Log the clicked button's text for debugging
  console.log(clickedButton.textContent); // Logs the text of the clicked button
});
// handleEvent("input", document.getElementById("myInput"), "inputChange");
// handleEvent("mousemove", document.getElementById("mouse-area"), "mouseMove");
// handleEvent("scroll", document.getElementById("scroll-area"), "scrollEvent");
// handleEvent("keydown", document.getElementById("myInput"), "keyDown");
// handleEvent("keyup", document.getElementById("myInput"), "keyUp");

// MyEvents.on("buttonClick", (data) => {
//   const output = document.getElementById("output");
//   output.innerHTML += `<p>Button clicked! Target: ${data.target.tagName}</p>`;
// });

// MyEvents.on("buttonClick", (data) => {
//   console.log(data);
//   document.querySelectorAll(".tab").forEach((button) => {
//     button.classList.remove("active");
//   });

//   const output = document.querySelector(".tab");
//     output.classList.add("active")
// });

// MyEvents.on("mouseMove", (data) => {
//   const output = document.getElementById("output");
//   output.innerHTML = `<p>Mouse Position: X=${data.clientX}, Y=${data.clientY}</p>`;
// });

// MyEvents.on("scrollEvent", (data) => {
//   const output = document.getElementById("output");
//   output.innerHTML = `
//     <p>Scroll Position:</p>
//     <ul>
//       <li>Vertical (scrollTop): ${data.scrollTop}</li>
//       <li>Horizontal (scrollLeft): ${data.scrollLeft}</li>
//       <li>Total Height (scrollHeight): ${data.scrollHeight}</li>
//       <li>Total Width (scrollWidth): ${data.scrollWidth}</li>
//     </ul>
//   `;
// });

// MyEvents.on("keyDown", (data) => {
//   const output = document.getElementById("output");
//   output.innerHTML = `
//   <p>Key Down:</p>
//   <ul>
//     <li>Key: ${data.key}</li>
//     <li>Code: ${data.code}</li>
//     <li>Shift Key: ${data.shiftKey}</li>
//     <li>Ctrl Key: ${data.ctrlKey}</li>
//     <li>Alt Key: ${data.altKey}</li>
//   </ul>
// `;
// });

// MyEvents.on("keyUp", (data) => {
//   const output = document.getElementById("output");
//   output.innerHTML += `<p>Key Up: ${data.key} (${data.code})</p>`;
// });
