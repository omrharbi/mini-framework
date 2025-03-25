function createRouter() {
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
        try {
            // Si nous avons une fonction de chargement enregistrée pour cette route
            if (routes[path]) {
                routes[path]();
                return;
            }
            
            // Sinon, charger le contenu du fichier HTML via fetch
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            
            const html = await response.text();
            
            // Extraire le contenu du body
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            // Remplacer le contenu principal
            document.getElementById('app-content').innerHTML = bodyContent;
            
            // Mettre à jour le titre si disponible
            const title = doc.querySelector('title');
            if (title) {
                document.title = title.textContent;
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
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

// Créer une instance globale du routeur
window.Router = createRouter();