const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postcollaborationsHandler,
      },
      {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deletecollaborationsHandler,
      },
  ];
   
  module.exports = routes;