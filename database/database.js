const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const connect = async () => {
	try {
		await client.connect();
		console.log("Mongo DB Connected");
		return client;
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = connect();
