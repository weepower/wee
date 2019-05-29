module.exports = {
    paths: {
        root: 'public',
        assets: 'assets',
        source: 'source',
        components: 'source/components',
        build: 'build',
    },
    script: {
        entry: {
            app: 'app.js',
        },
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js',
        },
    },
    manifest: {
        enabled: false,
        options: {
            filename: 'assets.json',
        },
    },
    chunking: {
        vendor: {
            enabled: false,
            options: {
                name: 'vendor',
            },
        },
        common: {
            enabled: false,
            options: {
                name: 'common',
            },
        },
    },
    style: {
        entry: {},
        output: {
            filename: '[name].min.css',
            chunkFilename: '[name].min.css',
        },
        breakpoints: {
            mobileLandscape: 480,
            tablet: 768,
            desktop: 1024,
            desktop2: 1280,
            desktop3: 1440,
        },
        breakpointOffset: 25,
    },
    purgeCss: {
        enabled: false,
        paths: [
            'public/index.html',
        ],
    },
    configureWebpack: {},
    chainWebpack: (config) => {},
    server: {
        ghostMode: false,
        host: 'auto',
        port: 9000,
        https: true,
        proxy: 'https://wee.dev',
        static: true,
        reload: {
            enable: true,
            watch: {
                root: true,
                paths: [],
                extensions: [
                    'html',
                ],
                ignore: [],
            },
        },
    },
};
