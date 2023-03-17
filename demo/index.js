const Koop = require('@koopjs/koop-core');
const provider = require('@koopjs/provider-file-geojson');

const koop = new Koop({ });
koop.register(provider, { dataDir: './demo/provider-data'});
koop.server.listen(8080);