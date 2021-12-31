const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGO_URI);

async function run() {
	try {
		await client.connect();
		console.log("MongoDB connected");

		const db = await client.db("mahasiswa");

		await db.createCollection("jurusan", {
			validator: {
				$jsonSchema: {
					bsonType: "object",
					required: ["jurusan", "fakultas"],
					properties: {
						jurusan: {
							bsonType: "string",
							description: "Must be a string"
						},
						fakultas: {
							bsonType: "string",
							description: "fakultas must be a string"
						}
					}
				}
			},
			validationAction: "error"
		});

		const collection = await db.collection("jurusan");

		await collection.createIndex(
			{
				jurusan: 1
			},
			{
				unique: true
			}
		);

		await collection.createIndex({
			fakultas: 1,
			jurusan: 1
		});

		await collection.createIndex({
			slug: 1
		});
	} catch (error) {
		console.log(error.message);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
