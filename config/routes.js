module.exports.routes = {

  //'/*': function(req, res, next) {sails.log.verbose(req.method, req.url); next();},

  '/' : {
    controller	: 'home',
    action: 'index'
  },

  'get /services': {
    controller: 'services',
    action: 'list'
  } 

};
