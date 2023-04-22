const routes = require('next-routes')();

routes
    .add('/bitRound/new', '/bitRound/new')
    .add('/bitRound/:address', '/bitRound/show');

module.exports = routes;