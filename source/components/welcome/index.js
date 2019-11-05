import { RouteHandler } from 'wee-routes';

export default new RouteHandler({
    init() {
        console.log('welcome');

        const test = {
            what: 'cool',
        };
    },
});
