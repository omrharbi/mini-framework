export function createRouter() {
    function getHashPath () {
        return window.location.hash
    }
    return { getHashPath };
}
