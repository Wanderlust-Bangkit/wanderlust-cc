const {
    RegisterHandler,
    LoginHandler,
    tesHandler
  } = require ("../Controllers/controller")

const routes =[
    {
        path: '/login',
        method: 'POST',
        handler: LoginHandler
    },

    {
        path: '/register',
        method: 'POST',
        handler: RegisterHandler
    },
    {
        path: '/tes',
        method: 'POST',
        handler: tesHandler
    }
];

module.exports = routes;