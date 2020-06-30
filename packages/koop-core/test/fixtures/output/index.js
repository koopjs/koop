class MockOutput {
  pullData (req, res) {
    this.model.pull(req, (err, data) => {
      if (err) res.status(err.code || 500).json({ error: err.message })
      else {
        res.status(200).json({ message: 'success' })
      }
    })
  }
}

MockOutput.routes = [
  {
    path: '/koop-output/:layer',
    methods: ['get', 'post'],
    handler: 'pullData'
  }
]
MockOutput.type = 'output'
MockOutput.version = '1.0.0'
module.exports = MockOutput
