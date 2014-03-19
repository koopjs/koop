
exports.finish = function( key ){
  Cache.getInfo(key, function(err, info){
    if (info.format){
      console.log('figure out how to trigger the export code, maybe need to move to a model, yup');
      delete info.format; 
    }
    delete info.status;
    Cache.updateInfo(key, info, function(err, success){
      console.log('updated info for ', key);
    });
  });
  // select info from koopinfo
  // look for tasks 
  // complete tasks
  // remove from info, 
  // update info; 
};
