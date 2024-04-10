class Output {
  static type = 'output';
  static version = '0.0.1';
  static name = 'output-using-pull-callback';
  static routes = [
    {
      path: '$namespace/output-path',
      methods: ['get', 'post'],
      handler: 'handler',
    },
  ];

  handler(req, res, next) {
    this.model.pull(req, (err, data) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(data);
    });
  }
}

module.exports = Output;
