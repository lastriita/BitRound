const routes = require('next-routes')();

routes
    .add('/bitRound/new', '/bitRound/new')
    .add('/bitRound/:address', '/bitRound/show')
    .add('/bitRound/:address/request', '/bitRound/requests/new');

module.exports = routes;