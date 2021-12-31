const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "assets/images");
	},
	filename: function (req, file, cb) {
		let ext = file.originalname.substr(file.originalname.lastIndexOf("."));
		cb(null, file.fieldname + "-" + Date.now() + ext);
	}
});

function checkFileType(file, cb) {
	const fileType = /jpeg|jpg|png/;

	const extName = fileType.test(path.extname(file.originalname).toLowerCase());

	const mimeType = fileType.test(file.mimetype);

	if (mimeType && extName) return cb(null, true);
	cb(new Error("Please upload hanya gambar"));
}

let upload = multer({
	storage: storage,
	limits: {
		fileSize: 1000000
	},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single("image");

module.exports = upload;
