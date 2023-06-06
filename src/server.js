require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(Inert);

  server.route([
    ...routes,
    {
      method: 'GET',
      path: '/openapi.json',
      handler: (request, h) => {
        return h.file('openapi.json');
      },
    },
    {
      method: 'GET',
      path: '/docs',
      handler: (request, h) => {
        return h.file('openapi.html');
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada http://localhost:${server.info.port}`);
};

init();
