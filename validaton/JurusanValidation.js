const { check } = require("express-validator");

exports.store = [
	check("fakultas").notEmpty().withMessage("Fakultas harus di isi"),
	check("jurusan")
		.notEmpty()
		.withMessage("Jurusan harus di isi")
		.custom((value) => {
			const pattern = /[0-9]/g;
			if (pattern.test(value)) throw new Error("isi kolom jurusan hanya dengan huruf");
			return true;
		})
];

exports.update = [
	check("fakultas").notEmpty().withMessage("Fakultas harus di isi"),
	check("jurusan")
		.notEmpty()
		.withMessage("Jurusan harus di isi")
		.custom((value) => {
			const pattern = /[0-9]/g;
			if (pattern.test(value)) throw new Error("isi kolom jurusan hanya dengan huruf");
			return true;
		})
];
