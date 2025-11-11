/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942636046")

  // remove field
  collection.fields.removeById("text289095329")

  // remove field
  collection.fields.removeById("text1876853840")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942636046")

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text289095329",
    "max": 0,
    "min": 0,
    "name": "barbero_nombre",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1876853840",
    "max": 0,
    "min": 0,
    "name": "servicio_nombre",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
