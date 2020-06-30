const should = require('should') // eslint-disable-line

const createController = require('../../lib/provider-registration/create-controller')

describe('Tests for create-controller', function () {
  it('should extend a controller authored with function syntax', () => {
    const OutputController = function OutputController () {
      this.foo = 'bar'
    }
    OutputController.routes = ['route-test']
    const mockModel = 'model-test'
    const extendedController = createController(mockModel, OutputController)
    extendedController.should.have.property('model', 'model-test')
    extendedController.should.have.property('foo', 'bar')
    extendedController.should.have.property('routes').deepEqual(['route-test'])
    extendedController.should.have.property('namespace', 'OutputController')
  })

  it('should extend a controller authored with class syntax', () => {
    class OutputController {
      constructor () {
        this.foo = 'bar'
      }
    }
    OutputController.routes = ['route-test']
    const mockModel = 'model-test'
    const extendedController = createController(mockModel, OutputController)
    extendedController.should.have.property('model', 'model-test')
    extendedController.should.have.property('foo', 'bar')
    extendedController.should.have.property('routes').deepEqual(['route-test'])
    extendedController.should.have.property('namespace', 'OutputController')
  })

  it('should produce a controller when no base controller is provided', () => {
    const mockModel = 'model-test'
    const extendedController = createController(mockModel)
    extendedController.should.have.property('model', 'model-test')
    extendedController.should.have.property('routes').deepEqual([])
    extendedController.should.have.property('namespace', 'DefaultController')
  })

  it('should use a default namespace when unnamed constructor functions are used', () => {
    const mockModel = 'model-test'
    const extendedController = createController(mockModel, function () {})
    extendedController.should.have.property('namespace', 'UndefinedControllerNamespace')
  })
})
