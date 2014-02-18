module.exports = {
  'get /vrbo': {
    controller: 'vrbo',
    action: 'index'
  }, 

   'get /vrbo/:minx/:miny/:maxx/:maxy': {
    controller: 'vrbo',
    action: 'get'
  }
};
