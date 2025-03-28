export function createRouter() {
    const listeners = new Set();
    const routes = {};
    // Returns the current path from the URL
    function getPath() {
        return window.location.pathname;
    }

    // Register a new route with a loadContent function
    function registerRoute(path, loadContentFn) {
        routes[path] = loadContentFn;
    }

    // Navigate to a new route
    function navigate(path) {
        const currentPath = getPath();
        if (currentPath === path) {
            return;
        }
        window.history.pushState({}, "", path);
        // loadContent(path);
        // Notify all listeners of the route change
        listeners.forEach(listener => listener(path));
    }
    // async function loadContent(path) {
    //     console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
        
    //     // Call the registered loadContent function for the route if it exists
    //     if (routes[path]) {
    //         try {
    //             await routes[path](); // Execute the function registered for the path
    //         } catch (error) {
    //             console.error(`Error loading content for ${path}:`, error);
    //         }
    //     } else {
    //         console.warn(`No content registered for path: ${path}`);
    //     }
    // }

    // Add a listener for route changes
    function onRouteChange(listener) {
        listeners.add(listener);
        
        // Return a cleanup function to remove the listener
        return () => listeners.delete(listener);
    }

    // Handle the back and forward buttons in the browser (popstate event)
    window.addEventListener("popstate", () => {
        const currentPath = getPath();
        loadContent(currentPath);
        listeners.forEach(listener => listener(currentPath));
    });
    // loadContent(getPath());

    return { getPath, navigate, onRouteChange, registerRoute, loadContent };
}
