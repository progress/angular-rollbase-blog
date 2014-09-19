/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    bodyParser = require('body-parser'),
    api = require('./routes/api'),
    errorhandler = require('errorhandler');

var app = module.exports = express();
var jsonParser = bodyParser.json();
// Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(express.static(__dirname + '/public'));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
    app.use(errorhandler());
}


// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/posts', jsonParser, api.posts);
app.post('/api/login', jsonParser, api.login);
app.get('/api/post/:id', jsonParser, api.post);
app.post('/api/post', jsonParser, api.addPost);
app.put('/api/post/:id', jsonParser, api.editPost);
app.post('/api/post/:id', jsonParser, api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
//Modulus uses process.env.PORT while locally it defaults to 3000
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});