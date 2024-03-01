const uuid = require("uuid");
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL || "postgress://localhost/acme_reservation_planner");

async function createTables()
{
	let sql = `
		drop table if exists reservation cascade;
		drop table if exists customer;
		drop table if exists restaurant;

		create table customer(
			id uuid not null primary key,
			name varchar(255) not null
		);
		create table restaurant(
			id uuid not null primary key,
			name varchar(255) not null
		);
		create table reservation(
			id uuid primary key,
			date date not null,
			party_count integer not null,
			restaurant_id uuid references restaurant(id) not null,
			customer_id uuid references customer(id) not null
		)
	`;
	await client.query(sql);
}

async function createCustomer(name)
{
	let sql = `
		insert into customer
			(id, name)
		values
			($1, $2)
		returning *;
	`;
	const response = await client.query(sql, [uuid.v4(), name]);
	return response;
}

async function createRestaurant(name)
{
	let sql = `
		insert into restaurant
			(id, name)
		values
			($1, $2)
		returning *;
	`;
	const response = await client.query(sql, [uuid.v4(), name]);
	return response;
}

async function fetchCustomers()
{
	let sql = `
		select * from customer;
	`;
	const response = await client.query(sql);
	return response.rows;
}

async function fetchRestaurants()
{
	let sql = `
		select * from restaurant
	`;
	const response = await client.query(sql);
	return response.rows;
}

async function createReservation(date, partyCount, restId, custId)
{
	let sql = `
		insert into reservation
		(id, date, party_count, restaurant_id, customer_id)
		values
		($1, $2, $3, $4, $5)
		returning *;
	`;
	const response = await client.query(sql, [uuid.v4(), date, partyCount, restId, custId]);
	return response.rows[0];
}

async function destroyReservation(id)
{
	let sql = `
		delete from reservation
		where id = $1;
	`;
	await client.query(sql, [id]);
}

async function fetchReservations()
{
	let sql = `
		select * from reservation
	`;
	const response = await client.query(sql);
	return response.rows;
}

module.exports = {
	client,
	createTables,
	createCustomer,
	createRestaurant,
	fetchCustomers,
	fetchRestaurants,
	createReservation,
	destroyReservation,
	fetchReservations,
};
