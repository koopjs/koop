const Koop = require('@koopjs/koop-core');
// const provider = require('@koopjs/provider-file-geojson');
const IWDataProvider = require('./IWProvider');
const koop = new Koop({ logLevel: 'debug' });

// const auth = require('@koopjs/auth-direct-file')(
//   'pass-in-your-secret',
//   `${__dirname}/user-store.json`
// );

// koop.register(auth);
// koop.register(provider, { dataDir: './demo/provider-data'});
koop.register(IWDataProvider, { name: 'IWProvider' });
koop.server.listen(process.env.PORT || 8080);