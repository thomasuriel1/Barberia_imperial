/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2757060279")

  // remove field
  collection.fields.removeById("date27834329")

  // remove field
  collection.fields.removeById("date3152135767")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2757060279")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date27834329",
    "max": "",
    "min": "",
    "name": "fecha",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date3152135767",
    "max": "",
    "min": "",
    "name": "hora",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
