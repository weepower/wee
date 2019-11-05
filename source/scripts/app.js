import $router from 'wee-routes';
import './bootstrap';

const teest = ';;;;;;';

const what = 'asdfasdf'

const cool = {wht: 'beans'}

$router.pjax().map([
    {
        path: '/',
        handler: [
            () => import('../components/welcome').then(m => m.default || m),
        ],
    },
]).run();
