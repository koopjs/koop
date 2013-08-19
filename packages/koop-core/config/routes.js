module.exports.routes = {
	
	'/' : {
		controller	: 'home',
    action: 'index'
	},

  'get /services': {
    controller: 'services',
    action: 'list'
  } 

};
