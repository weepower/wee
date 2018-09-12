import $router from 'wee-routes';
import './bootstrap';

/**
 * Dynamically load a component
 * @param {String} component
 */
const load = component => import(/* webpackChunkName: "[request]" */ `../components/${component}`)
    .then(m => m.default || m);

$router.pjax().map([
    {
        path: '/',
        handler: [
            () => load('welcome'),
        ],
    },
]).run();
