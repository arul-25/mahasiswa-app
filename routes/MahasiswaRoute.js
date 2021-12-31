const express = require("express");
const router = express.Router();
const { MahasiswaController } = require("../controller");

router.get("/", MahasiswaController.index);
router.get("/create", MahasiswaController.create);
router.post("/store", MahasiswaController.store);
router.get("/:nim/edit", MahasiswaController.edit);
router.put("/:nim/update", MahasiswaController.update);
router.delete("/:nim", MahasiswaController.delete);

module.exports = router;
