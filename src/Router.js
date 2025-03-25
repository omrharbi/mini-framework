export function createRouter() {
    const listeners = new Set();
    const routes = {};
    function getPath() {
        return window.location.pathname;
    }

    function registerRoute(path, loadContentFn) {
        routes[path] = loadContentFn;
    }

    function navigate(path) {
        // Mise à jour de l'URL sans rechargement
        window.history.pushState({}, "", path);

        // Charger le contenu correspondant
        loadContent(path);

        // Notifier les écouteurs
        listeners.forEach(listener => listener(path));
    }

    async function loadContent(path) {
        console.log(`Loading content for path: ${path}`);
    }

    function onRouteChange(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    // Gestion du bouton retour du navigateur
    window.addEventListener("popstate", () => {
        const currentPath = getPath();
        loadContent(currentPath);
        listeners.forEach(listener => listener(currentPath));
    });

    return { getPath, navigate, onRouteChange, registerRoute, loadContent };
}

