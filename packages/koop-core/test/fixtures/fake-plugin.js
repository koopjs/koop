class fakePlugin {
  testFunc () {
    return true
  }
}
fakePlugin.type = 'plugin'
fakePlugin.version = '0.0.0'

class legacyPlugin {
  testFunc () {
    return true
  }
}
legacyPlugin.plugin_name = 'legacyPluginName'
legacyPlugin.type = 'plugin'
legacyPlugin.version = '0.0.0'

class renamedPlugin {
  testFunc () {
    return true
  }
}
renamedPlugin.pluginName = 'test-plugin'
renamedPlugin.type = 'plugin'
renamedPlugin.version = '0.0.0'

class dependencyPlugin {
  constructor (deps) {
    this.deps = deps
  }
}
dependencyPlugin.dependencies = [
  'fakePlugin',
  'legacyPluginName',
  'test-plugin'
]
dependencyPlugin.type = 'plugin'
dependencyPlugin.version = '0.0.0'

class namePrecedencePlugin {}
namePrecedencePlugin.pluginName = 'correctPluginName'
namePrecedencePlugin.plugin_name = 'incorrectPluginName'
namePrecedencePlugin.type = 'plugin'
namePrecedencePlugin.version = '0.0.0'

module.exports = {
  fakePlugin,
  legacyPlugin,
  renamedPlugin,
  dependencyPlugin,
  namePrecedencePlugin
}
