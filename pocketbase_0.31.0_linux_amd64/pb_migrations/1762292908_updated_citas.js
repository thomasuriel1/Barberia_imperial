/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942636046")

  // remove field
  collection.fields.removeById("text1876853840")

  // remove field
  collection.fields.removeById("text289095329")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1335821281",
    "hidden": false,
    "id": "relation3737697308",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "barbero",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2757060279",
    "hidden": false,
    "id": "relation3414618666",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "servicio",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942636046")

  // add field
  collection.fields.addAt(3, new Field({
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

  // add field
  collection.fields.addAt(4, new Field({
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

  // remove field
  collection.fields.removeById("relation3737697308")

  // remove field
  collection.fields.removeById("relation3414618666")

  return app.save(collection)
})
