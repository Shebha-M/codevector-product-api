const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();


//fetchng data
app.get("/products", async (req, res) => {
  try {
    // 1. Read query params from URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    // 2. Calculate OFFSET
    const offset = (page - 1) * limit;

    // 3. Base query
    let query = "SELECT * FROM products";
    let values = [];

    // 4. If category filter exists
    if (category) {
      values.push(category);
      query += ` WHERE category = $${values.length}`;
    }

    // 5. Add sorting + pagination
    values.push(limit);
    query += ` ORDER BY id DESC LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    // 6. Run query
    const result = await pool.query(query, values);

    // 7. Send response
    res.json({
      page,
      limit,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
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

    if (category) {
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
    res.status(500).send("Database error");      //500 -internal server error
  }
});

app.listen(5000, () => 
{
  console.log("Server running on port 5000");
});