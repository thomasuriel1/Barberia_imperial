/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1335821281")

  // remove field
  collection.fields.removeById("bool599580611")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1335821281")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "bool599580611",
    "name": "disponible",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
