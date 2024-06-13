const Hapi = require('@hapi/hapi');
const firestore = require('./Config/firebaseConfig');
const routes = require('./routes/route');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
 
    server.route(routes);
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();