const routes = (handler) => [
    {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthHandler,
      },
      {
        method: 'PUT',
        path: '/authentications',
        handler: handler.postAuthHandler,
      },
      {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.postAuthHandler,
      },
  ];
   
  module.exports = routes;