require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const pool = require(__dirname + "/config/db.config.js");

const app = express();

const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());

// Functions
const handleQuery = (res, query, errorMessage) => {
    pool.query(query, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: errorMessage });
            return;
        }
        res.status(200).json(result.rows);
    });
};

// Routes
app.get('/recipes', (req, res) => {
    const query = 'SELECT * FROM recipes';
    const errorMessage = 'Error fetching recipes';
    handleQuery(res, query, errorMessage);
});

app.get('/nutrition', (req, res) => {
    const query = 'SELECT * FROM nutrition';
    const errorMessage = 'Error fetching nutrition data';
    handleQuery(res, query, errorMessage);
});

app.get('/instructions', (req, res) => {
    const query = 'SELECT * FROM instructions';
    const errorMessage = 'Error fetching instructions';
    handleQuery(res, query, errorMessage);
});

app.get('/ingredients', (req, res) => {
    const query = 'SELECT ingredients.*, categories."category" FROM ingredients left join categories on ingredients."Ingredient" = categories."ingredient";';
    const errorMessage = 'Error fetching ingredients';
    handleQuery(res, query, errorMessage);
});

app.listen(PORT, () => {
    console.log(`Server listening on the port ${PORT}`);
});
