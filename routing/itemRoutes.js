'use strict';

const express = require("express");

const db = require("../fakeDb");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../expressError");


/**
 * Route returns items in database.
 */
router.get('/', function (req, res) {
  return res.json({ items: db.items });
});

/**
 * Route adds item to db if valid request. BadRequestError if request body is
 * not valid.
 */
router.post('/', function (req, res) {
  if (Object.keys(req.body).length === 0 || req.body === undefined) {
    throw new BadRequestError("Items are required");
  }
  db.items.push(req.body);

  return res.status(201).json({ added: req.body });
});



/**
 * Route returns item from database based on url param :name. Returns
 * notFoundError if not found.
 */
router.get('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  if (!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`);
  }
  return res.json(item);
});

/**
 * Route updates item in database based on url param :name. Returns badRequestError
 * invalid body. Returns notFoundError if item doesn't exist.
 */
router.patch('/:name', function (req, res) {
  if (Object.keys(req.body).length === 0 || req.body === undefined) {
    throw new BadRequestError("Items are required");
  }
  let item = db.items.find(i => i.name === req.params.name);
  if (!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`);
  }
  //Name may not be in body
  item = { name: req.body.name || item.name, price: req.body.price || item.price };
  return res.json({ updated: item });
});

/**
 * Route deletes item from database based on url param :name. Returns
 *  notFoundError if not found
 */
router.delete('/:name', function (req, res) {
  const item = db.items.find(i => i.name === req.params.name);
  if (!item) {
    throw new NotFoundError(`Couldn't find ${req.params.name}`);
  }
  const index = db.items.indexOf(item);
  db.items.splice(index, 1);
  return res.json({ message: "deleted" });
});

module.exports = router;