const {
    RegisterHandler,
    LoginHandler,
    getDestinationHandler,
    addFavorit,
    getFavorit,
    deleteFavorit,
    createItinerary,
    getItinerary,
    getDestinationByCategory,
    getAllCategory,
    destinationML,
    search
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
        path: '/createItinerary',
        method: 'POST',
        handler: createItinerary
    },
    {
        path: '/getItinerary/{userId}',
        method: 'GET',
        handler: getItinerary
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
    },
    {
        path:'/search/{keyword}',
        method: 'GET',
        handler: search
    },{
        path:'/suggestion',
        method: 'POST',
        handler: destinationML
    }
    
];

module.exports = routes;