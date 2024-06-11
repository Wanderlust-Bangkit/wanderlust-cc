const {
    RegisterHandler,
    LoginHandler,
    tesHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit,
    createItenary,
    getItenary
  } = require ("../Controllers/controller")

const routes = [
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
    },
    {
        path: '/itenary',
        method: 'POST',
        handler: createItenary
    },
    {
        path: '/itenary',
        method: 'GET',
        handler: getItenary
    },
    
];

module.exports = routes;