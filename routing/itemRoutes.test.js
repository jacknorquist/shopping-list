'use strict';

const request = require("supertest");

const app = require("../app");
const db = require("../fakeDb");

let item = { name: "Pickle", price: "$700" };

beforeEach(function () {
  db.items.push(item);
});

afterEach(function () {
  db.items = [];
});

/** GET /items - returns `{items: [name: pickle]...}` */

describe("GET /items", function () {
  it("Gets a list of all items", async function () {
    const resp = await request(app).get(`/items`);
    //toEqual(items:[item])
    expect(resp.body).toEqual({ items: db.items });
  });
});

/** GET /items/[name] - returns `{name : pickle}` */

describe("GET /items/:name", function () {
  it("Gets a specific item, a pickle.", async function () {
    const resp = await request(app).get(`/items/Pickle`);
    expect(resp.body).toEqual(item);
  });
});

/** POST /items - create an item from data; return `{name : Hot Dog, price...}` */

describe("POST /items", function () {
  it("Creates a new item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Hot Dog",
        price: "$1.50"
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: { name: "Hot Dog", price: "$1.50" }
    });
  });

});

/** PATCH /items/[name] - update item return `{ updated: {[item]} }` */

describe("PATCH /items/:name", function () {
  it("Updates a single item", async function () {
    const resp = await request(app)
      .patch(`/items/${item.name}`)
      .send({
        name: "Licorice"
      });
    expect(resp.body).toEqual({
      updated: { name: "Licorice", price: '$700' }
    });
  });

  it("Responds with 404 if name invalid", async function () {
    const resp = await request(app).patch(`/items/nothere`).send({
      name: "nothere"
    });
    expect(resp.statusCode).toEqual(404);
  });
});

/** DELETE /items/[name] - delete item,
 *  return `{message: "deleted"}` */

describe("DELETE /items/:name", function () {
  it("Deletes a single item given name", async function () {
    const resp = await request(app)
      .delete(`/items/${item.name}`);
    expect(resp.body).toEqual({ message: "deleted" });
    expect(db.items.length).toEqual(0);
  });
});