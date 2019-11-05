import $router from 'wee-routes';
import './bootstrap';

const teest = ';;;;;;';

$router.pjax().map([
    {
        path: '/',
        handler: [
            () => import('../components/welcome').then(m => m.default || m),
        ],
    },
]).run();
