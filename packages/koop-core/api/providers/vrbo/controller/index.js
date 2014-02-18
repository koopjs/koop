
exports.provider = true,
exports.index = function(req, res){
  res.send('VRBO API Wrapper');
};

exports.get = function(req, res){
  VRBO.getListings(req.params, req.query, function(err, listings){
    console.log(err, listings)
    res.json(listings);
  });
  
};
