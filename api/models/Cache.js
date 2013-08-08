
// a rather retarded 
module.exports = {

  gist: {

  },

  start: function(){
    setInterval(function(){
      // clear cache
      Cache.data = {};
    }, 360000);
  }

};
