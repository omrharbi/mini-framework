import { h } from '../core/dom.js';

export function AboutPage() {
    return h('div', {},
    h('h1', {}, 'About Page'),
    h('p', {}, 'Learn more about us.')
    );
}
