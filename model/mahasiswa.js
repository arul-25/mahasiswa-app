const client = require("../database/database");

const collection = async () => {
	try {
		console.log("MongoDB Connected mahasiswa");
		return (await client).db("mahasiswa").collection("mahasiswa");
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = collection;
