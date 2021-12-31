const { collection } = require("../model/fakultas");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
	const FakultasModel = await collection();
	try {
		console.log("fakultas index");
		const result = FakultasModel.find({});
		const fakultas = await result.toArray();
		res.render("fakultas/index", {
			layout: "layouts/app-layout",
			title: "Fakultas",
			fakultas,
			msg: req.flash("msg")
		});
	} catch (error) {
		console.log(error.message);
		res.end();
	}
};

exports.create = async (req, res) => {
	res.render("fakultas/create", {
		layout: "layouts/app-layout",
		title: "Fakultas Create",
		error: req.flash("error")
	});
};

exports.store = async (req, res) => {
	try {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			req.flash("error", error.array()), res.redirect("/fakultas/create");
		} else {
			const FakultasModel = await collection();
			try {
				await FakultasModel.insertOne({
					fakultas: req.body.fakultas.toLowerCase(),
					slug: req.body.fakultas.replace(/ /g, "-").toLowerCase()
				});

				req.flash("msg", "data fakultas berhasil di tambahkan..."), res.redirect("/fakultas");
			} catch (error) {
				const pattern = /duplicate key error/;

				let msg = pattern.test(error.message) ? `Nama fakultas ${req.body.fakultas} sudah ada` : error.message;
				return req.flash("error", [{ msg }]), res.redirect("/fakultas/create");
			}
		}
	} catch (error) {
		alert(error.message);
		console.log(error.message);
		res.redirect("/fakultas/create");
	}
};

exports.edit = async (req, res) => {
	const FakultasModel = await collection();
	const fakultas = await FakultasModel.findOne({ slug: req.params.slug }, { projection: { _id: 0 } });

	if (!fakultas) return res.status(404).send("404 Not Found");

	res.render("fakultas/edit", {
		layout: "layouts/app-layout",
		title: "Fakultas edit",
		fakultas,
		error: req.flash("error")
	});
};

exports.update = async (req, res) => {
	const { fakultas, fakultas_lama, slug } = req.body;
	try {
		const error = validationResult(req);

		if (!error.isEmpty()) {
			req.flash("error", error.array()), res.redirect(`/fakultas/${slug}/edit`);
		} else {
			if (fakultas == fakultas_lama) return res.redirect(`/fakultas/${slug}/edit`);
			const FakultasModel = await collection();
			try {
				await FakultasModel.findOneAndUpdate(
					{
						slug: slug
					},
					{
						$set: {
							fakultas: fakultas.toLowerCase(),
							slug: fakultas.replace(/ /g, "-").toLowerCase()
						}
					}
				);
				return req.flash("update fakultas sukses..."), res.redirect("/fakultas");
			} catch (error) {
				const pattern = /duplicate key error/;

				const msg = pattern.test(error.message) ? `fakultas ${fakultas} sudah ada!` : error.message;

				req.flash("error", [{ msg }]), res.redirect(`/fakultas/${slug}/edit`);
			}
		}
	} catch (error) {
		alert(error.message);

		res.redirect(`/fakultas/${req.body.slug}/edit`);
	}
};

exports.delete = async (req, res) => {
	try {
		const FakultasModel = await collection();
		FakultasModel.findOneAndDelete({ slug: req.params.slug })
			.then(() => (req.flash("msg", "berhasil menghapus fakultas"), res.redirect("/fakultas")))
			.catch((error) => (req.flash("msg", error.message), res.redirect("/fakultas")));
	} catch (error) {
		console.log(error.message);
		req.flash("msg", error.message), res.redirect("/fakultas");
	}
};
