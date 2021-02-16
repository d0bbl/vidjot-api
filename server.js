const port = process.env.PORT || 3000;

const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen( port, () => {
  console.log(`listening for requests on port ${port}`);
});
