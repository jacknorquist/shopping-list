const express = require("express");

const db = require("../fakeDb");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");



router.get('/', function (req, res) {
  return res.json({items : db.items});
});


router.post('/', function (req, res) {
  if(!("name" in req.body) && !("price" in req.body)) {
    throw new BadRequestError("An item is required");
  }
  db.items.push(req.body);

  return res.status(201).json({ added: req.body });
});


router.get('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  if(!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`)
  }
  return res.json(item);
});


router.patch('/:name', function (req, res) {
  if(!("name" in req.body) && !("price" in req.body)) {
    throw new BadRequestError("An item is required");
  }
  const item = db.items.find(i => i.name === req.params.name);
  if(!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`)
  }
  const index = db.items.indexOf(item);
  db.items[index] = {name: req.body.name, price : req.body.price || item.price};
  return res.json({ updated: req.body });
});


router.delete('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  if(!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`)
  }
  const index = db.items.indexOf(item);
  db.items.splice(index, 1);
  return res.json({ message: "deleted" });
});

module.exports = router;