/*---------------------
	:: Demo 
	-> controller
---------------------*/
var DemoController = {

  gist: function(req, res){
   res.render('demo/gist', { locals:{ id: req.params.id } });
  },

  github: function(req, res){
   res.render('demo/github', { locals:{ id: req.params.id } });
  }


};
module.exports = DemoController;
