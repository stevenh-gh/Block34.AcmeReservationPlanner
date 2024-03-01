const express = require("express");
const {
	client,
	createTables,
	createCustomer,
	createRestaurant,
	fetchCustomers,
	fetchRestaurants,
	createReservation,
	destroyReservation,
	fetchReservations,
} = require("./db");

const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/customers", async (req, res, next) =>
{
	try
	{
		res.send(await fetchCustomers());
	}
	catch (err)
	{
		next(err);
	}
});

app.get("/api/restaurants", async (req, res, next) =>
{
	try
	{
		res.send(await fetchRestaurants());
	}
	catch (err)
	{
		next(err);
	}
});

app.get("/api/reservations", async (req, res, next) =>
{
	try
	{
		res.send(await fetchReservations());
	}
	catch (err)
	{
		next(err);
	}
});

app.post("/api/customers/:id/reservations", async (req, res, next) =>
{
	try
	{
		res.send(await createReservation(req.body.date, req.body.partyCount, req.body.restId, req.params.id));
	}
	catch (err)
	{
		next(err);
	}
});

app.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) =>
{
	try
	{
		await destroyReservation(req.params.id);
		res.sendStatus(204);
	}
	catch (err)
	{
		next(err);
	}
});

const init = async () =>
{
	console.log("connected to db...");
	await client.connect();
	console.log("connected to db");

	console.log("creating tables...");
	await createTables();
	console.log("created tables");

	console.log("seeding tables...");
	await createCustomer("steven");
	await createCustomer("kevin");
	await createCustomer("louise");
	await createCustomer("scott");

	await createRestaurant("mcdonalds");
	await createRestaurant("panda express");
	await createRestaurant("dennys");
	await createRestaurant("kfc");
	console.log("seeded tables");

	const PORT = 3000;
	app.listen(PORT, () =>
	{
		console.log(`listening on port ${PORT}`);
	});
};

init();
