# Angular Rollbase Blog

Angular example blog app based on https://github.com/btford/angular-express-blog, demonstrating the use of https://github.com/progress/angular-express-rollbase-seed/ where the Node server references the Rollbase REST Api. The blog can be viewed on http://angularrollbaseblog2-21893.onmodulus.net/.A post on how to use this can be found on http://mendoncakeegan.wordpress.com/2014/08/28/angular-rollbase-blog-v2/.

### Running the app

1. Create an Object in Rollbase. Its integration name will be use in objectIntegrationName variable located at routes\api.js file<br/>
2. Create a new field with the type of text, label it as "text". Make sure the integration name is "text" as well.<br/>
3. Supply the credential in routes\api.js <br/>
4. Run the application by invoking node app.js <br/>

## Directory Layout
    
    app.js                      --> app config
    package.json                --> for npm
    AngularRollbaseDemo_v2.xml  --> xml file that can be used to generate Rollbase app
    public/                     --> all of the files to be used in on the client side
      css/                      --> css files
        app.css                 --> default stylesheet
      js/                       --> javascript files
        app.js                  --> declare top-level app module
        controllers.js          --> application controllers
        directives.js           --> custom angular directives
        filters.js              --> custom angular filters
        services.js             --> custom angular services
    routes/
      api.js                    --> route for serving JSON. This is simulating Corticon.
      index.js                  --> route for serving HTML pages and partials
    views/
      index.jade                --> main page for app
      layout.jade               --> doctype, title, head boilerplate
      partials/                 --> contains various partial views
        addPost.jade            --> view for adding post
        deletePost.jade         --> view for deleting post
        editPost.jade           --> view for editing post 
        index.jade              --> view for index page with all posts 
        login.jade              --> view for logging in
        readPost.jade           --> view for reading post        

## Contact

For a blog post on this project please check out http://mendoncakeegan.wordpress.com/2014/08/28/angular-rollbase-blog-v2/ <br/>
For more on Rollbase please check out http://www.progress.com/products/rollbase. <br/>
For more on AngularJS please check out http://angularjs.org/. <br/>
For more on NodeJS please check out http://nodejs.org/. <br/>

## License

MIT
