const { collection } = require("../model/jurusan");
const { collection: fakultasCollection } = require("../model/fakultas");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
	const JurusanModel = await collection();
	const jurusan = await JurusanModel.find({}).toArray();
	res.render("jurusan/index", {
		layout: "layouts/app-layout",
		title: "Halaman Jurusan",
		jurusan,
		msg: req.flash("msg")
	});
};

exports.create = async (req, res) => {
	const FakultasModel = await fakultasCollection();
	const fakultas = await FakultasModel.find({}).toArray();

	res.render("jurusan/create", {
		layout: "layouts/app-layout",
		title: "Create Jurusan",
		fakultas,
		error: req.flash("error")
	});
};

exports.store = async (req, res) => {
	try {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			req.flash("error", error.mapped()), res.redirect("/jurusan/create");
		} else {
			const jurusanModel = await collection();
			jurusanModel
				.insertOne({
					fakultas: req.body.fakultas.toLowerCase(),
					jurusan: req.body.jurusan.toLowerCase(),
					slug: req.body.jurusan.replace(/ /g, "-").toLowerCase()
				})
				.then(() => {
					req.flash("msg", "Data jurusan berhasil ditambahkan"), res.redirect("/jurusan");
				})
				.catch((error) => {
					const pattern = /duplicate key error/;

					let msg = pattern.test(error.message) ? `Jurusan ${req.body.jurusan} sudah ada` : error.message;
					req.flash("error", { jurusan: { msg } }), res.redirect("/jurusan/create");
				});
		}
	} catch (error) {
		console.log(error.message);
		res.redirect("/jurusan/create");
	}
};

exports.edit = async (req, res) => {
	try {
		const JurusanModel = await collection();
		const FakultasModel = await fakultasCollection();
		const fakultas = await FakultasModel.find({}, { projection: { fakultas: 1 } }).toArray();
		const jurusan = await JurusanModel.findOne({ slug: req.params.slug }, { projection: { _id: 0 } });

		if (!jurusan) return res.status(404).send("Not Found");

		res.render("jurusan/edit", {
			layout: "layouts/app-layout",
			title: "Edit Jurusan",
			jurusan,
			fakultas,
			error: req.flash("error")
		});
	} catch (error) {
		console.log(error.message);
		res.redirect("/jurusan");
	}
};

exports.update = async (req, res) => {
	try {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			req.flash("error", error.mapped()), res.redirect(`/jurusan/${req.params.slug}/edit`);
		} else {
			const JurusanModel = await collection();
			JurusanModel.updateOne(
				{
					slug: req.params.slug
				},
				{
					$set: {
						jurusan: req.body.jurusan.toLowerCase(),
						fakultas: req.body.fakultas.toLowerCase(),
						slug: req.body.jurusan.replace(/ /g, "-").toLowerCase()
					}
				}
			)
				.then(() => (req.flash("msg", "Jurusan berhasil di update"), res.redirect("/jurusan")))
				.catch((error) => {
					const pattern = /duplicate key error/;
					let msg = pattern.test(error.message) ? `Jurusan ${req.body.jurusan} sudah ada` : error.message;

					req.flash("error", { jurusan: { msg } }), res.redirect(`/jurusan/${req.params.slug}/edit`);
				});
		}
	} catch (error) {
		console.log(error.message);
		req.flash("msg", error.message), res.redirect("/jurusan");
	}
};

exports.delete = async (req, res) => {
	try {
		const JurusanModel = await collection();
		JurusanModel.deleteOne({ slug: req.params.slug })
			.then(() => (req.flash("msg", "Jurusan telah dihapus"), res.redirect("/jurusan")))
			.catch((error) => (req.flash("msg", error.message), res.redirect("/jurusan")));
	} catch (error) {
		console.log(error.message);
		req.flash("msg", error.message), res.redirect("/jurusan");
	}
};

exports.getJurusan = async (req, res) => {
	try {
		console.log(req.body.fakultas);
		const JurusanModel = await collection();
		const jurusan = await JurusanModel.find(
			{
				fakultas: req.body.fakultas
			},
			{
				projection: {
					jurusan: 1
				}
			}
		).toArray();
		return res.send(jurusan);
	} catch (error) {
		console.log(error.message);
	}
};
