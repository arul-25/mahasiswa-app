const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
	try {
		await client.connect();
		console.log("MongoDB Connected");

		const db = client.db("mahasiswa");
		await db.createCollection("mahasiswa", {
			validationAction: "error",
			validator: {
				$jsonSchema: {
					bsonType: "object",
					required: ["nama", "nim", "email", "jurusan", "fakultas", "jenis_kelamin", "image", "status"],
					properties: {
						nama: {
							bsonType: "string",
							description: "nama must be a string"
						},
						nim: {
							bsonType: "long",
							description: "nim must be number"
						},
						email: {
							bsonType: "string",
							pattern: "@gmail.com$",
							description: "email must be a string and valid address"
						},
						jurusan: {
							bsonType: "string",
							description: "jurusan must be a string"
						},
						fakultas: {
							bsonType: "string",
							description: "fakultas must be a string"
						},
						jenis_kelamin: {
							enum: ["Pria", "Wanita"],
							description: "pilih hanya satu dari pilihan jenis kelamin"
						},
						image: {
							bsonType: "string",
							description: "pilih gambar anda"
						},
						status: {
							enum: ["Aktif", "Tidak Aktif"],
							description: "Pilih status"
						}
					}
				}
			}
		});
		const collection = db.collection("mahasiswa");

		await collection.createIndex(
			{
				nim: 1
			},
			{
				unique: true
			}
		);
		await collection.createIndex(
			{
				email: 1
			},
			{
				unique: true
			}
		);

		await collection.createIndex({
			fakultas: 1,
			jurusan: 1,
			status: 1,
			jenis_kelamin: 1
		});

		await collection.createIndex({
			name: "text"
		});
	} catch (error) {
		console.log(error.message);
	} finally {
		client.close();
	}
}

run().catch(console.dir);
