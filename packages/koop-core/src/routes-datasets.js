module.exports = [
  {
    path: '/datasets/:id',
    methods: ['get'],
    handler: 'getFromCache'
  },
  {
    path: '/datasets/:id',
    methods: ['put'],
    handler: 'upsertIntoCache'
  },
  {
    path: '/datasets/:id',
    methods: ['delete'],
    handler: 'deleteFromCache'
  },
  {
    path: '/datasets/:id/metadata',
    methods: ['get'],
    handler: 'getFromCatalog'
  },
  {
    path: '/datasets/:id/metadata',
    methods: ['put'],
    handler: 'insertIntoCatalog'
  },
  {
    path: '/datasets/:id/metadata',
    methods: ['delete'],
    handler: 'deleteFromCatalog'
  }
]
