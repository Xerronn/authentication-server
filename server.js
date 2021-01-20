const restify = require('restify');
const errors = require('restify-errors');
const fs = require('fs');

var server = restify.createServer({
    name: 'test'
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(function(req, res, next) {
    
    fs.readFile('data/keys.txt', 'utf8', function(err, data) {
        if (err) throw err;

        let values = [];
        let keysJSON = JSON.parse(data);

        for (let key in keysJSON) {
            values.push(keysJSON[key]);
        }

        if (!values.includes(req.query.key)) {
            console.log("No API key supplied");
            return next(new errors.UnauthorizedError("API key invalid or unprovided"));
        } else return next();
    });
});

server.listen(8888, function() {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/test', function(req, res, next) {
    res.send(true);
    return next();
});