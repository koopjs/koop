// Configure installed adapters
// If you define an attribute in your model definition, 
// it will override anything from this global config.
module.exports.adapters = {

	'default': 'memory',

	memory: {
		module: 'sails-dirty',
		inMemory: true
	}

};
