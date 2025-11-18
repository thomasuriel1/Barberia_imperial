/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_343751955")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "autodate1542800728",
    "name": "fecha",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_343751955")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "autodate1542800728",
    "name": "field",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
})
