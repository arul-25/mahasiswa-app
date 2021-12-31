const express = require("express");
const router = express.Router();
const { FakultasController } = require("../controller");
const { FakultasValidaton } = require("../validaton");

router.get("/", FakultasController.index);
router.get("/create", FakultasController.create);
router.post("/store", FakultasValidaton.store, FakultasController.store);
router.get("/:slug/edit", FakultasController.edit);
router.put("/update", FakultasValidaton.update, FakultasController.update);
router.delete("/:slug/delete", FakultasController.delete);

module.exports = router;
