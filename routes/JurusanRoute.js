const express = require("express");
const router = express.Router();
const { JurusanController } = require("../controller");
const { JurusanValidation } = require("../validaton");

router.get("/", JurusanController.index);
router.get("/create", JurusanController.create);
router.post("/store", JurusanValidation.store, JurusanController.store);
router.get("/:slug/edit", JurusanController.edit);
router.put("/:slug/update", JurusanValidation.update, JurusanController.update);
router.delete("/:slug", JurusanController.delete);

router.post("/api/getJurusan", JurusanController.getJurusan);

module.exports = router;
