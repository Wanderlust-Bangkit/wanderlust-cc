const {
    RegisterHandler,
    LoginHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit,
    createItinenary,
    getItinenary,
    getDestinationByCategory,
    getAllCategory,
    destinationML
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
        path: '/itinenary',
        method: 'POST',
        handler: createItinenary
    },
    {
        path: '/itinenary',
        method: 'GET',
        handler: getItinenary
    },
    {
        path: '/destination/{category}',
        method: 'GET',
        handler: getDestinationByCategory
    },
    {
        path: '/categories',
        method: 'GET',
        handler: getAllCategory
    },{
        path:'/suggestion',
        method: 'GET',
        handler: destinationML
    }
    
];

module.exports = routes;