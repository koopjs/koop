# koop-cli-new-project

A minimal Koop project template from [Koop CLI](https://github.com/koopjs/koop-cli).

See the [specification](https://koopjs.github.io/docs/usage/koop-core) for more details.

## Configuration

### App Configuration

The Koop application is configured with the [config](https://www.npmjs.com/package/config) package. By default the configurations are stored as JSON files in the `config` folder. It is recommended to namespace the configuration for plugins in order to avoid any potential key conflict.

### Koop Configuration

The Koop project configuration `koop.json` is the configuration for the app/plugin code. It is part of the code and used to store internal properties of the app/plugin. It should not be changed with the deployment.

## Development

### Testing

This project uses [mocha](https://www.npmjs.com/package/mocha) as the testing framework and [chaijs](https://www.chaijs.com/) as the assertion library. All test files in the `test` directory should have the special extension `.test.js`, which will be executed by the command:

```
$ npm test
```

### Dev Server

This project by default uses the [Koop CLI](https://github.com/koopjs/koop-cli) to set up the dev server. It can be invoked via

```
$ npm start
```

The server will be running at `http://localhost:8080` or at the port specified at the configuration.

For more details, check the [Koop CLI documentation](https://github.com/koopjs/koop-cli/blob/master/README.md).
