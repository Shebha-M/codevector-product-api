# CodeVector Product API

Backend API built using Node.js, Express, PostgreSQL and Neon Database.

## Features

* Browse 200,000 products
* Category filtering
* Offset pagination
* Cursor pagination
* Fast querying using indexes
* PostgreSQL hosted on Neon


## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Neon DB

## API Endpoints

### Get Products

GET /products?page=1&limit=10

### Filter By Category

GET /products?category=food

### Cursor Pagination

GET /products-cursor

GET /products-cursor?cursor=199991

## Database

Products table contains:

* id
* name
* category
* price
* created_at
* updated_at

## Seed Data

Generate 200,000 products:

node seed.js

## Run Project

npm install

node server.js

Server runs on:

http://localhost:5000

## Design Decisions

* PostgreSQL chosen for reliability and indexing support.
* Cursor pagination implemented to avoid duplicate/missing records when data changes during browsing.
* Bulk insertion used for efficient generation of 200,000 products.
