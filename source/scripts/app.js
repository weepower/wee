import $router from 'wee-routes';
import './bootstrap';

$router.pjax().map([
    {
        path: '/',
        handler: [
            () => import('../components/welcome').then(m => m.default || m),
        ],
    },
]).run();
