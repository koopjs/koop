// Routes
// *********************
// 
// This table routes urls to controllers/actions.
//
// If the URL is not specified here, the default route for a URL is:  /:controller/:action/:id
// where :controller, :action, and the :id request parameter are derived from the url
//
// If :action is not specified, Sails will redirect to the appropriate action 
// based on the HTTP verb: (using REST/Backbone conventions)
//
//		GET:	/:controller/read/:id
//		POST:	/:controller/create
//		PUT:	/:controller/update/:id
//		DELETE:	/:controller/destroy/:id
//
// If the requested controller/action doesn't exist:
//   - if a view exists ( /views/:controller/:action.ejs ), Sails will render that view
//   - if no view exists, but a model exists, Sails will automatically generate a 
//       JSON API for the model which matches :controller.
//   - if no view OR model exists, Sails will respond with a 404.
//
module.exports.routes = {
	
	// To route the home page to the "index" action of the "home" controller:
	'/' : {
		controller	: 'home',
    action: 'index'
	},

  'get /gist/:id/preview' : {
    controller  : 'demo',
    action: 'gist'
  },

  'get /geojson': {
    controller: 'geojson',
    action: 'index'
  },
  'get /geojson/:id': {
    controller: 'geojson',
    action: 'find'
  },

  'get /geojson/:id/FeatureServer': {
    controller: 'featureservices',
    action: 'geojson'
  },

  'get /geojson/:id/FeatureServer/:layer': {
    controller: 'featureservices',
    action: 'geojson'
  },

  'get /geojson/:id/FeatureServer/:layer/:method': {
    controller: 'featureservices',
    action: 'geojson'
  },

  'get /gist/:id/FeatureServer/:layer/:method': {
    controller: 'featureservices',
    action: 'gist'
  },

  'get /gist/:id/FeatureServer/:layer': {
    controller: 'featureservices',
    action: 'gist'
  },

  'get /gist/': {
    controller: 'gist',
    action: 'index'
  },

  'get /gist/:id': {
    controller: 'gist',
    action: 'findOne'
  },

  'get /github/:user': {
    controller: 'github',
    action: 'notFound'
  },

  'get /github/:user/:repo': {
    controller: 'github',
    action: 'notFound'
  },

  'get /github/:user/:repo/:file': {
    controller: 'github',
    action: 'index'
  },

  'get /github/:user/:repo/:file/preview' : {
    controller  : 'demo',
    action: 'github'
  },
  
  'get /github/:user/:repo/:file/FeatureServer': {
    controller: 'featureservices',
    action: 'github'
  },

  'get /github/:user/:repo/:file/FeatureServer/:layer': {
    controller: 'featureservices',
    action: 'github'
  },

  'get /github/:user/:repo/:file/FeatureServer/:layer/:method': {
    controller: 'featureservices',
    action: 'github'
  }

  


};
