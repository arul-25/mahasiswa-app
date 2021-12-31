const client = require("../database/database");

const collection = async () => {
	try {
		console.log("MongoDB Connected fakultas");
		return (await client).db("mahasiswa").collection("fakultas");
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = { collection, client };
