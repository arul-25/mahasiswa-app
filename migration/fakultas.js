const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
	try {
		await client.connect();
		console.log("MongoDB connected");

		const db = client.db("mahasiswa");

		await db.createCollection("fakultas", {
			validationAction: "error",
			validator: {
				$jsonSchema: {
					bsonType: "object",
					required: ["fakultas"],
					properties: {
						fakultas: {
							bsonType: "string",
							description: "fakultas must be a string"
						}
					}
				}
			}
		});

		const collection = db.collection("fakultas");

		await collection.createIndex(
			{
				fakultas: 1
			},
			{
				unique: true
			}
		);

		await collection.createIndex({
			slug: 1
		});
	} catch (error) {
		console.log(error.message);
	} finally {
		client.close();
	}
}

run().catch(console.dir);
