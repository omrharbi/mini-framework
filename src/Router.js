import { MyEventSystem } from "./event.js";
import { jsx, render } from "./framework.js";

export function getHashPath() {    
    return window.location.hash ;
}

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.initEventListeners();
    }

    initEventListeners() {
        MyEventSystem.addEventListener(window,'hashchange',() => {
            this.handleRouting();
        })
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRouting() {
        const path = getHashPath();
        const route = this.routes[path];
        console.log("route",route);
        

        if (route) {
            route();
            this.currentRoute = path;
        } else {            // Default to home route if not found
            //window.location.hash = '#/';
            render(jsx(NotFoundPage, null), document.getElementById('root'));
        }
    }
    init() {
        console.log("init");
        
        this.handleRouting();
    }
}





const NotFoundPage = () => {
  return jsx("div", { className: "container" },
    jsx("h1", null, "404"),
    jsx("p", null, 
      jsx("strong", null, "File not found")
    ),
    jsx("p", null, "The site configured at this address does not contain the requested file."),
    jsx("p", null,
      "If this is your site, make sure that the filename case matches the URL as well as any file permissions.",
      jsx("br", null),
      "For root URLs (like ",
      jsx("code", null, "http://zone01oujda.ma/"),
      ") you must provide an ",
      jsx("code", null, "index.html"),
      " file."
    ),
  );
};

