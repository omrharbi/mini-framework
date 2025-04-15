/**
 * Main application file demonstrating the Mini Framework usage
 * Imports all core framework functionality
 */
import {
    createVDOM,
    route,
    handleLocation,
    setRoutes,
    setRoot,
    StateManagement,
    renderComponent,
    myEventSystem
} from './miniframework.js';

/**
 * Home Component - Displays a counter with increment/decrement buttons
 * @returns {Object} Virtual DOM tree representing the home view
 */
function Home() {
    // Get current count from global state, default to 0 if not set
    const count = StateManagement.getState().count || 0;

    return createVDOM('div', {}, [
        createVDOM('h1', {}, ['Counter App']),
        createVDOM('p', {}, [`Current Count: ${count}`]),
        // Button container with styling class
        createVDOM('div', { class: "counter_btn" }, [
            // Increment button - updates state on click
            createVDOM('button', {
                onClick: () => {
                    StateManagement.setState({ count: count + 1 });
                }
            }, ['Increment']),
            // Decrement button - updates state on click
            createVDOM('button', {
                onClick: () => {
                    StateManagement.setState({ count: count - 1 });
                }
            }, ['Decrement']),
        ]),
        // Line break
        createVDOM('br', {}, []),
        // Navigation link to About page
        createVDOM('a', { href: '/about' }, ['Go to About'])
    ]);
}

/**
 * State subscription - Re-renders Home component when state changes
 * Only triggers when on the home route ("/")
 */
StateManagement.subscribe((state) => {
    if (window.location.pathname === "/") {
        renderComponent(Home);
        console.log("Current State:", JSON.stringify(state));
    }
});

/**
 * About Component - Displays information about the framework
 * @returns {Object} Virtual DOM tree representing the about view
 */
function About() {
    return createVDOM('div', {}, [
        createVDOM('h1', {}, ['About Page']),
        createVDOM('p', {}, ['This is a simple demo of the custom framework']),
        // Navigation link back to Home
        createVDOM('a', { href: '/' }, ['Go to Home'])
    ]);
}

/**
 * 404 Component - Displayed when no route matches
 * @returns {Object} Virtual DOM tree for not found page
 */
function NotFound() {
    return createVDOM('div', {}, [
        createVDOM('h1', {}, ['404 - Page Not Found']),
        // Navigation link back to Home
        createVDOM('a', { href: '/' }, ['Go to Home'])
    ]);
}

/**
 * Route Configuration
 * Maps URL paths to component functions
 */
setRoutes({
    '/': Home,       // Root path
    '/about': About, // About page
    404: NotFound    // Fallback for unknown routes
});

// Set the root DOM element where components will render
setRoot('app');

/* 
 * ESSENTIAL ROUTING EVENT HANDLERS
 * These must remain in the application for proper routing functionality
 */

/**
 * Handles browser back/forward navigation
 * Listens to popstate events (browser history changes)
 */
myEventSystem.addEvent(window, 'popstate', handleLocation, true);

// Initial route handling
handleLocation();

/**
 * Global click handler for navigation links
 * Intercepts <a> tag clicks and handles them via the router
 */
myEventSystem.addEvent(document.body, 'click', (e) => {
    if (e.target.tagName === 'A') {
        route(e); // Handle routing without page reload
    }
}, true);

/* END ESSENTIAL ROUTING CODE */