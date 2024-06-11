const {
    RegisterHandler,
    LoginHandler,
    tesHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit
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
        path: '/destination',
        method: 'GET',
        handler: getDestinationHandler
    },
    {
        path: '/addFavorit',
        method: 'POST',
        handler: addFavorit 
    },
    {
        path: '/favorit/{userId}',
        method: 'GET',
        handler: getFavorit 
    },
    {
        path: '/deleteFavorit',
        method: 'POST',
        handler: deleteFavorit 
    }
];

module.exports = routes;