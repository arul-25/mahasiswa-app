const client = require("../database/database");

const collection = async () => {
	try {
		console.log("Mongo db connected jurusan");
		return (await client).db("mahasiswa").collection("jurusan");
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = { collection, client };
