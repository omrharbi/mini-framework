import { createElement } from './dom.js';
import { render, updateRender } from './vdom.js';

export class Router {
    constructor(routes) {
        this.routes = routes;
        console.log(routes);
        
        this.currentRoute = null;
        this.initEventListeners();
    }


    initEventListeners() {
        window.addEventListener('popstate', () => this.handleRouting());
        
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.handleRouting();
    }

    handleRouting() {
        const path = window.location.pathname;
        const route = this.routes[path];
        console.log(route);
        
        if (route) {
            const body = document.body;
            body.innerHTML = '';
           
            const routeComponents = route();     
            routeComponents.forEach(component => {              
                body.appendChild(createElement(component));
            });
            this.currentRoute = path;
        } else {
            this.handle404();
        }
    }

    handle404() {
        const app = document.getElementById('app');
        app.innerHTML = '<h1>404 - Page Not Found</h1>';
    }

    init() {
        this.handleRouting();
    }
}