import { h } from '../core/dom.js';
import { MyEvents } from '../core/events.js';

export function HomePage() {
    const handleClick = () => {
        console.log('Button clicked!');
        MyEvents.trigger('customClick', { message: 'Hello from HomePage!' });
    };

    return h('div', {},
        h('h1', { class: 'title' }, 'Home Page'),
        h('p', {}, 'Welcome to the home page!'),
        h('button', { onClick: handleClick }, 'Click me!')
    );
}