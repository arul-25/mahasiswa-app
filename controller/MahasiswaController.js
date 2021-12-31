const collection = require("../model/mahasiswa");
const { collection: fakultasCollection } = require("../model/fakultas");
const { collection: jurusanCollection } = require("../model/jurusan");
const upload = require("../middleware/multer");
const { MulterError } = require("multer");
const { validationResult } = require("express-validator");
const { MahasiswaValidation } = require("../validaton");
const fs = require("fs");
const { Long } = require("mongodb");

exports.index = async (req, res) => {
	const MahasiswaModel = await collection();
	const mahasiswa = await MahasiswaModel.find({}).toArray();
	res.render("mahasiswa/index", {
		layout: "layouts/app-layout",
		title: "Halaman mahasiswa",
		msg: req.flash("msg"),
		mahasiswa
	});
};

exports.create = async (req, res) => {
	const FakultasModel = await fakultasCollection();
	const fakultas = await FakultasModel.find().toArray();
	res.render("mahasiswa/create", {
		layout: "layouts/app-layout",
		title: "Tambah Mahasiswa",
		fakultas,
		error: req.flash("error")
	});
};

exports.store = (req, res) => {
	upload(req, res, async (err) => {
		await Promise.all(MahasiswaValidation.store.map((validation) => validation.run(req)));
		const error = validationResult(req);
		let image_error = null;
		if (err instanceof MulterError) {
			image_error = err.message;
		} else if (err) {
			image_error = err.message;
		}

		let errorMsg = {};

		if (!error.isEmpty()) errorMsg = error.mapped();

		if (image_error != null) {
			errorMsg.image = {
				msg: image_error
			};
		} else if (!req.file) {
			errorMsg.image = {
				msg: "Gambar tidak boleh kosong"
			};
		}

		if (Object.keys(errorMsg).length > 0) {
			if (req.file) {
				if (fs.existsSync(`./assets/images/${req.file.filename}`)) {
					fs.unlinkSync(`./assets/images/${req.file.filename}`);
				}
			}
			req.flash("error", errorMsg), res.redirect("/mahasiswa/create");
		} else {
			const { nama, nim, email, fakultas, jurusan, jenis_kelamin, status } = req.body;
			const image = req.file.filename;
			const MahasiswaModel = await collection();

			try {
				MahasiswaModel.insertOne({
					nama: nama.toLowerCase(),
					nim: Long.fromBigInt(nim),
					email: email.toLowerCase(),
					jurusan: jurusan,
					fakultas: fakultas,
					jenis_kelamin: jenis_kelamin,
					image: image.toString(),
					status: status
				})
					.then(() => {
						req.flash("msg", "Mahasiswa berhasil di tambahkan"), res.redirect("/mahasiswa");
					})
					.catch((error) => {
						console.log("catch");
						const pattern = /duplicate key error/;
						if (fs.existsSync("./assets/images/" + image)) {
							console.log("unlynk catch");
							fs.unlinkSync("./assets/images/" + image);
						}

						if (pattern.test(error.message)) {
							let errorMsg = {};
							for (key in error.keyValue) {
								errorMsg[key] = { msg: `${key} ${error.keyValue[key]} sudah ada` };
							}
							req.flash("error", errorMsg), res.redirect("/mahasiswa/create");
						} else {
							req.flash("msg", error.message), res.redirect("/mahasiswa");
						}
					});
			} catch (error) {
				console.log(error.message);
				console.log("catch 2");
				if (fs.existsSync("./assets/images/" + image)) {
					console.log("unlynk catch 2");
					fs.unlinkSync("./assets/images/" + image);
				}
				res.redirect("/mahasiswa/create");
			}
		}
	});
};

exports.edit = async (req, res) => {
	console.log(req.params.nim);
	const MahasiswaModel = await collection();
	const FakultasModel = await fakultasCollection();
	const JurusanModel = await jurusanCollection();
	const fakultas = await FakultasModel.find({}).toArray();

	const mahasiswa = await MahasiswaModel.findOne({ nim: Long.fromBigInt(req.params.nim) }, { projection: { _id: 0 } });
	const jurusan = await JurusanModel.find({ fakultas: mahasiswa.fakultas }).toArray();
	res.render("mahasiswa/edit", {
		layout: "layouts/app-layout",
		title: "Edit Mahasiswa",
		mahasiswa,
		fakultas,
		jurusan,
		error: req.flash("error")
	});
};

exports.update = (req, res) => {
	upload(req, res, async (err) => {
		await Promise.all(MahasiswaValidation.store.map((validation) => validation.run(req)));
		const error = validationResult(req);
		let image_error = null;

		if (err instanceof MulterError) {
			image_error = err.message;
		} else if (err) {
			image_error = err.message;
		}

		let errorMsg = {};

		if (!error.isEmpty()) errorMsg = error.mapped();

		if (image_error != null) {
			errorMsg.image = {
				msg: image_error
			};
		}

		if (Object.keys(errorMsg).length > 0) {
			if (req.file) {
				if (fs.existsSync(`./assets/images/${req.file.filename}`)) {
					fs.unlinkSync(`./assets/images/${req.file.filename}`);
				}
			}
			req.flash("error", errorMsg), res.redirect("/mahasiswa/" + req.params.nim + "/edit");
		} else {
			const { nama, nim, email, fakultas, jurusan, jenis_kelamin, status, old_image } = req.body;

			let body = {
				nama: nama.toLowerCase(),
				nim: Long.fromBigInt(nim),
				email: email.toLowerCase(),
				jurusan: jurusan,
				fakultas: fakultas,
				jenis_kelamin: jenis_kelamin,
				status: status
			};

			if (req.file) body.image = req.file.filename.toString();

			const MahasiswaModel = await collection();

			try {
				MahasiswaModel.updateOne(
					{
						nim: Long.fromBigInt(req.params.nim)
					},
					{
						$set: body
					}
				)
					.then(() => {
						if (req.file) {
							if (fs.existsSync("./assets/images/" + old_image)) {
								fs.unlinkSync("./assets/images/" + old_image);
							}
						}
						req.flash("msg", "mahasiswa berhasil di ubah"), res.redirect("/mahasiswa");
					})
					.catch((error) => {
						const pattern = /duplicate key error/;

						if (fs.existsSync("./assets/images/" + req.file?.filename)) {
							fs.unlinkSync("./assets/images/" + req.file.filename);
						}

						if (pattern.test(error.message)) {
							let errorMsg = {};
							for (key in error.keyValue) {
								errorMsg[key] = { msg: `${key} ${error.keyValue[key]} sudah ada` };
							}
							req.flash("error", errorMsg), res.redirect("/mahasiswa/" + req.params.nim + "/edit");
						} else {
							req.flash("msg", error.message), res.redirect("/mahasiswa");
						}
					});
			} catch (error) {
				console.log(error.message);
				console.log("catch 2");
				if (fs.existsSync("./assets/images/" + req.file?.filename)) {
					fs.unlinkSync("./assets/images/" + req.file.filname);
				}
				res.redirect("/mahasiswa");
			}
		}
	});
};

exports.delete = async (req, res) => {
	try {
		const MahasiswaModel = await collection();
		const mahasiswa = await MahasiswaModel.findOne({ nim: Long.fromBigInt(req.params.nim) }, { projection: { image: 1 } });
		MahasiswaModel.deleteOne({
			nim: Long.fromBigInt(req.params.nim)
		})
			.then(() => {
				if (fs.existsSync(`./assets/images/${mahasiswa.image}`)) {
					fs.unlinkSync(`./assets/images/${mahasiswa.image}`);
				}

				req.flash("msg", "Data mahasiswa berhasil dihapus"), res.redirect("/mahasiswa");
			})
			.catch((error) => {
				req.flash("msg", error.message), res.redirect("/mahasiswa");
			});
	} catch (error) {
		req.flash("msg", error.message), res.redirect("/mahasiswa");
	}
};
