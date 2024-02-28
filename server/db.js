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

module.exports = {
	client,
	createTables,
	createCustomer,
	createRestaurant,
};
