const express = require("express");
const { client, createTables, createCustomer } = require("./db");

const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

const init = async () =>
{
	console.log("connected to db...");
	await client.connect();
	console.log("connected to db");

	console.log("creating tables...");
	await createTables();
	console.log("created tables");

	const PORT = 3000;
	app.listen(PORT, () =>
	{
		console.log(`listening on port ${PORT}`);
	});
};

init();
