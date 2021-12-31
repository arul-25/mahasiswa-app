const { check } = require("express-validator");
exports.store = [
	check("fakultas").notEmpty().withMessage("fakultas harus di isi"),
	check("fakultas").custom((value) => {
		const pattern = /[0-9]/g;
		if (pattern.test(value)) throw new Error("isi kolom fakultas hanya dengan huruf");
		return true;
	})
];

exports.update = [
	check("fakultas").notEmpty().withMessage("fakultas harus di isi"),
	check("fakultas").custom((value) => {
		const pattern = /[0-9]/g;
		if (pattern.test(value)) throw new Error("isi kolom fakultas hanya dengan huruf");
		return true;
	})
];
