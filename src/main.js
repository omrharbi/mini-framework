import { h } from './dom.js';
import { Router } from './router.js';
import { HomePage } from './pages/home.js';




function AboutPage() {
    return h('div', {},
    h('h1', {}, 'About Page'),
    h('p', {}, 'Learn more about us.')
    );
}

function Navigation() {
    return h('nav', {},
    h('a', { href: '/' }, 'Home'),
    h('a', { href: '/about' }, 'About')
    );
}

const router = new Router({
    '/': () => [Navigation(), HomePage()],
    '/about': () => [Navigation(), AboutPage()]
});

router.init();