import { Router } from './core/router.js';
import { HomePage } from './app/home.js';
import { Navigation } from './app/Navigation.js';
import { AboutPage } from './app/AboutPage.js';



const router = new Router({
    '/': () => [Navigation(), HomePage()],
    '/about': () => [Navigation(), AboutPage()]
});

router.init();