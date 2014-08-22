/*
 * Serve JSON to our AngularJS client
 */

//post2 was the object definition for my post object it was found at Application Setup > Objects > Post > View in the Integration name section. I filled postData.posts with such objects.
var postData = {
    "posts": []
};
var https = require('https');
var password = 'YOUR ROLLBASE PASSWORD HERE';
var username = 'YOUR ROLLBASE USERNAME HERE';
//My viewId for the posts view was found at Application Setup > Objects > Post > All Posts
var viewId = 'YOUR VIEWID FOR POSTOBJECT HERE';
var sessionId = '';
login();
//This logs back in periodically
var interval = setInterval(login, 3600000);
function login() {
    var loginOptions = {
        host: 'rollbase.com',
        port: 443,
        // Note this is password not Password like in documentation
        path: '/rest/api/login?&output=json&password=' + password + '&loginName=' + username
    };

    console.info('Options prepared:');
    console.info(loginOptions);
    console.info('Do the Login');
    // do the GET request
    var loginGet = https.request(loginOptions, function(res) {
        console.log("statusCode: ", res.statusCode);
        var data = '';

        res.on('data', function(d) {
            data += d;
        });
        res.on('end', function() {
            console.info('GET result:');
            console.log(data);
            var obj = JSON.parse(data);
            if (obj.status == 'ok') {
                console.log(obj.sessionId);
                sessionId = obj.sessionId;
                getInfo();
            } else {
                console.log(obj.message);
            }
        })
    });
loginGet.end();
loginGet.on('error', function(e) {
    console.error(e);
});
}
function getInfo() {
        var getOptions = {
            host: 'rollbase.com',
            port: 443,
            path: '/rest/api/getPage?&output=json&sessionId=' + sessionId + '&viewId=' + viewId
        };
        var getInfo = https.request(getOptions, function(res) {
            console.log("statusCode: ", res.statusCode);
            var data = '';
            res.on('data', function(d) {
                data += d;
            });
            res.on('end', function() {
                // < 400 means request probably succeeded 
                if (res.statusCode < 400) {
                    var obj = JSON.parse(data);
                    console.log(obj);
                    postData = {
                        "posts": []
                    };
                    for (var i = 0; i < obj.length; i++) {
                        var post = {};
                        post.title = obj[i].name;
                        post.text = obj[i].text;
                        post.id = obj[i].id;
                        postData.posts.push(post);
                        console.log(postData);
                    }
                } else {
                    console.log('Getting info failed');
                    console.log(data);
                }
            })
        });
        getInfo.end();
        getInfo.on('error', function(e) {
            console.error(e);
        });
    }
    // GET

exports.posts = function(req, res) {
    var posts = [];
    console.log(postData);
    postData.posts.forEach(function(post, i) {
        posts.push({
            id: i,
            title: post.title,
            text: post.text.substr(0, 50) + '...'
        });
    });
    res.json({
        posts: posts
    });
};

exports.post = function(req, res) {
    var id = req.params.id;
    if (id >= 0 && id < postData.posts.length) {
        res.json({
            post: postData.posts[id]
        });
    } else {
        res.json(false);
    }
};

// POST

exports.addPost = function(req, result) {
    var title = req.body.title;
    var text = req.body.text;
    //Simple check for empty strings to prevent the app from crashing
    if (title.length < 1 || text.length < 1) {
        result.end();
        return;
    }
    var createOptions = {
        host: 'rollbase.com',
        port: 443,
        //Note this is objName not objDefName like in documentation
        // require('querystring').escape() allows strings with spaces and other characters not supported by urls to be included in api calls
        path: '/rest/api/createRecord?objName=post2&useIds=true&title=' + require('querystring').escape(title) + '&text=' + require('querystring').escape(text) + '&output=json&sessionId=' + sessionId
    };
    console.info('Options prepared:');
    console.info(createOptions);
    console.info('Create post');
    // do the GET request
    var createGet = https.request(createOptions, function(res) {
        console.log("statusCode: ", res.statusCode);
        var data = '';

        res.on('data', function(d) {
            data += d;
        });
        res.on('end', function() {
            // < 400 means request probably succeeded 
            if (res.statusCode < 400) {
                console.info('Create result:');
                console.log(data);
                var obj = JSON.parse(data);
                req.body.id = obj.id;
                postData.posts.push(req.body);
                result.json(req.body);
            } else {
                console.log('Creation failed');
                console.log(data);
                result.end();
            }
        })
    });

    createGet.end();
    createGet.on('error', function(e) {
        console.error(e);
    });
};

// PUT

exports.editPost = function(req, result) {
    var id = req.params.id;

    if (id >= 0 && id < postData.posts.length) {
        postData.posts[id] = req.body;
        var title = req.body.title;
        var text = req.body.text;
        var objectId = req.body.id;
        var updateOptions = {
            host: 'rollbase.com',
            port: 443,
            path: '/rest/api/updateRecord?objName=post2&useIds=true&title=' + require('querystring').escape(title) + '&text=' + require('querystring').escape(text) + '&output=json&sessionId=' + sessionId + '&id=' + objectId
        };
        console.info('Options prepared:');
        console.info(updateOptions);
        console.info('Create post');
        // do the GET request
        var updateGet = https.request(updateOptions, function(res) {
            console.log("statusCode: ", res.statusCode);
            var data = '';

            res.on('data', function(d) {
                data += d;
            });
            res.on('end', function() {
                // < 400 means request probably succeeded 
                if (res.statusCode < 400) {
                    console.info('Update result:');
                    console.log(data);
                    result.json(true);

                } else {
                    console.log('Update failed');
                    console.log(data);
                    result.json(false);
                }
            })
        });

        updateGet.end();
        updateGet.on('error', function(e) {
            console.error(e);
        });
    } else {
        result.json(false);
    }
};

// DELETE

exports.deletePost = function(req, result) {
    var id = req.params.id;

    if (id >= 0 && id < postData.posts.length) {
        var objectId = postData.posts[id].id;
        var deleteOptions = {
            host: 'rollbase.com',
            port: 443,
            path: '/rest/api/deleteRecord?objName=post2&output=json&sessionId=' + sessionId + '&id=' + objectId
        };
        postData.posts.splice(id, 1);
        console.info('Options prepared:');
        console.info(deleteOptions);
        console.info('Create post');
        // do the GET request
        var deleteGet = https.request(deleteOptions, function(res) {
            console.log("statusCode: ", res.statusCode);
            var data = '';
            res.on('data', function(d) {
                data += d;
            });
            res.on('end', function() {
                // < 400 means request probably succeeded 
                if (res.statusCode < 400) {
                    var obj = JSON.parse(data);
                    if (obj.status == 'ok') {
                        result.json(true);
                    } else {
                        console.log('Delete failed');
                        console.log(data);
                        result.json(true);
                    }

                } else {
                    console.log('Delete failed');
                    console.log(data);
                    result.json(false);
                }
            })
        });

        deleteGet.end();
        deleteGet.on('error', function(e) {
            console.error(e);
        });
    } else {
        result.json(false);
    }
};