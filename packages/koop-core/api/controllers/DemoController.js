/*---------------------
	:: Demo 
	-> controller
---------------------*/
var DemoController = {

  gist: function(req, res){
   res.render('demo/gist', { locals:{ id: req.params.id } });
  },

  github: function(req, res){
   res.render('demo/github', { locals:{ user: req.params.user, repo: req.params.repo, file: req.params.file } });
  }


};
module.exports = DemoController;
