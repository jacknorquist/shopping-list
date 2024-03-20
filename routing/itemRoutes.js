const express = require("express");

const db = require("../fakeDb");
const router = new express.Router();



router.get('/', function (req, res) {
  console.log(db.items);
  return res.json(db.items);
});


router.post('/', function (req, res) {
  db.items.push(req.body);
  console.log(db.items);
  return res.json({ added: req.body });
});


router.get('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  return res.json(item);
});


router.patch('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  const index = db.items.indexOf(item);
  db.items[index] = req.body;
  return res.json({ updated: req.body });
});


router.delete('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  const index = db.items.indexOf(item);
  db.items.splice(index, 1);
  return res.json({ message: "deleted" });
});

module.exports = router;