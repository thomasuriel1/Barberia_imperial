/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2757060279")

  // remove field
  collection.fields.removeById("number1267855334")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1267855334",
    "max": 0,
    "min": 0,
    "name": "duracion",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2757060279")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number1267855334",
    "max": null,
    "min": null,
    "name": "duracion",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("text1267855334")

  return app.save(collection)
})
