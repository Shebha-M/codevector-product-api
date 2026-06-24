const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();


//fetchng data
app.get("/products", async (req, res) => {
  try {
    // Read query params from URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    // Calculating OFFSET
    const offset = (page - 1) * limit;

    //Base query
    let query = "SELECT * FROM products";
    let values = [];

    //If category filter exists
    if (category) 
    {
      values.push(category);
      query += ` WHERE category = $${values.length}`;
    }

    // Add sorting + paginaton
    values.push(limit);
    query += ` ORDER BY id DESC LIMIT $${values.length}`;
    values.push(offset);
    query += ` OFFSET $${values.length}`;

    //    Run query
    const result = await pool.query(query, values);

    //Sending response
    res.json(
    {
      page,
      limit,
      count: result.rows.length,
      data: result.rows,
    });

  } 
  catch (err){
    console.log(err);
    res.status(500).send("Server error");
  }
});


//If 50 products are added while user is browsing, this lines must not see duplicates or miss products.
app.get("/products-cursor", async (req, res) => {
  try {

    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;
    const category = req.query.category;

    let query = `
      SELECT *
      FROM products
      WHERE 1=1
    `;

    let values = [];

    if (category) 
    {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    if (cursor) {
      values.push(cursor);
      query += ` AND id < $${values.length}`;
    }

    values.push(limit);

    query += `
      ORDER BY id DESC
      LIMIT $${values.length}
    `;

    const result = await pool.query(query, values);
    let nextCursor = null;

    if (result.rows.length > 0) {
      nextCursor = result.rows[result.rows.length - 1].id;
    }

    res.json({
      count: result.rows.length,
      nextCursor,
      data: result.rows,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


app.get("/", async (req, res) => {
  try 
  {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]); //send the current time frm db
  } 
  catch (err) 
  {
    console.log(err);
    res.status(500).send("Database error");      //500 -internal server error is
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
{
  console.log(`Server running on port ${PORT}`);
});