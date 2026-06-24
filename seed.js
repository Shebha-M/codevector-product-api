const pool = require("./db");

function getRandomCategory() 
{
  const categories = ["electronics", "fashion", "books", "food", "sports"];
  return categories[Math.floor(Math.random() * categories.length)];
}

async function seedData() {
  try 
  {
    const batchSize = 1000;
    const total = 200000;

    for (let i = 0; i < total; i += batchSize) {
      let values = [];

      for (let j = 0; j < batchSize; j++) {
        const name = `Product-${i + j}`;
        const category = getRandomCategory();
        const price = Math.floor(Math.random() * 1000);

        values.push(`('${name}', '${category}', ${price})`);
      }

      const query = `
        INSERT INTO products (name, category, price)
        VALUES ${values.join(",")}
      `;
      await pool.query(query);
      console.log(`Inserted ${i + batchSize} products`);
    }

    console.log("DONE 🚀");
  } 
  catch (err) {
    console.log(err);
  }
}

seedData();