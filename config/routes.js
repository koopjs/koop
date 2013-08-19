module.exports.routes = {
	
	'/' : {
		controller	: 'home',
    action: 'home'
	},

  'get /services': {
    controller: 'services',
    action: 'list'
  } 

};
