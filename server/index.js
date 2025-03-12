require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require(__dirname + "/config/db.config.js");

const app = express();
const PORT = process.env.PORT || 9001;
const isProduction = process.env.NODE_ENV?.trim().toLowerCase() === "production";

app.enable("trust proxy");

if (isProduction) {
    app.use((req, res, next) => {
        const host = req.headers["x-forwarded-host"] || req.hostname;

        // Redirect Heroku Subdomain to Custom Domain
        if (host === "freshroulette-app-685e1b56445b.herokuapp.com") {
            console.log("Redirecting from Heroku domain to custom domain...");
            return res.redirect(301, `https://freshroulette.app${req.originalUrl}`);
        }

        // Force HTTPS (Heroku Handles This, But Added for Safety)
        if (req.headers["x-forwarded-proto"] !== "https") {
            console.log("Redirecting to HTTPS...");
            return res.redirect(`https://freshroulette.app${req.originalUrl}`);
        }

        next();
    });
}

app.use(cors());
app.use(express.json());

if (isProduction) {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

const handleQuery = (res, query, errorMessage) => {
    console.log(`Executing query: ${query}`);
    pool.query(query, (error, result) => {
        if (error) {
            console.error(`Database error: ${errorMessage}`, error);
            res.status(500).json({ error: errorMessage, details: error.message });
            return;
        }
        res.status(200).json(result.rows);
    });
};

app.get("/recipes", (req, res) => {
    handleQuery(res, "SELECT * FROM recipes", "Error fetching recipes");
});

app.get("/recipes/:uuid", async (req, res) => {
    const { uuid } = req.params;
    try {
        const recipeQuery = `SELECT * FROM recipes WHERE uuid::text = $1`;
        const recipeResult = await pool.query(recipeQuery, [uuid]);

        if (recipeResult.rows.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const recipe = recipeResult.rows[0];
        const ingredientsQuery = `SELECT * FROM ingredients WHERE uuid::text = $1`;
        const nutritionQuery = `SELECT * FROM nutrition WHERE uuid::text = $1`;
        const instructionsQuery = `SELECT * FROM instructions WHERE uuid::text = $1 ORDER BY sub_index`;

        const [ingredientsResult, nutritionResult, instructionsResult] = await Promise.all([
            pool.query(ingredientsQuery, [uuid]),
            pool.query(nutritionQuery, [uuid]),
            pool.query(instructionsQuery, [uuid])
        ]);

        res.status(200).json({
            ...recipe,
            ingredients: ingredientsResult.rows,
            nutrition: nutritionResult.rows[0] || null,
            instructions: instructionsResult.rows
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: `Database error: ${error.message}` });
    }
});

app.get("/nutrition", (req, res) => {
    handleQuery(res, "SELECT * FROM nutrition", "Error fetching nutrition data");
});

app.get("/instructions", (req, res) => {
    handleQuery(res, "SELECT * FROM instructions", "Error fetching instructions");
});

app.get("/ingredients", (req, res) => {
    handleQuery(
        res,
        `SELECT ingredients.*, categories."category" 
         FROM ingredients 
         LEFT JOIN categories ON ingredients."Ingredient" = categories."ingredient";`,
        "Error fetching ingredients"
    );
});

if (isProduction) {
    app.get("*", (req, res) => {
        const indexPath = path.join(__dirname, "../client/build", "index.html");
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error("Error serving React index.html:", err);
                res.status(500).send("Internal Server Error");
            }
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server running in ${isProduction ? "production" : "development"} mode on port ${PORT}`);
});
