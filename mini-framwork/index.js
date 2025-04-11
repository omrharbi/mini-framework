//  import { App } from "./app.js"; 
import { App, } from "../todo-mvc/app/main.js";
import { render, setApp } from "./framework.js";
// Set the App component
setApp(App); 
render();
// eventEnter()