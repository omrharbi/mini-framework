import { h } from '../core/dom.js';

export function Navigation() {
    return h('nav', {},
    h('a', { href: '/' }, 'Home'),
    h('a', { href: '/about' }, 'About')
    );
}