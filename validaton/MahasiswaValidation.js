const { body, check } = require("express-validator");

exports.store = [
	check("nama", "tidak boleh kosong").notEmpty(),
	check("nim", "nim tidak boleh kosong").notEmpty().isNumeric().withMessage("hanya alpha"),
	check("email", "email tidak boleh kosong").notEmpty().isEmail().withMessage("alamat email tidak valid"),
	check("fakultas", "fakultas tidak boleh kosong").notEmpty(),
	check("jurusan", "jurusan tidak boleh kosong").notEmpty(),
	check("jenis_kelamin", "Jenis kelamin idak boleh kosong").notEmpty(),
	check("status", "Status tidak boleh kosong").notEmpty()
];
