import $router from 'wee-routes';
import './bootstrap';

console.log('test');

$router.pjax().map([
    {
        path: '/',
        handler: [
            () => import('../components/welcome').then(m => m.default || m),
        ],
    },
]).run();
