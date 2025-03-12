require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const enforce = require("express-sslify");
const pool = require(__dirname + "/config/db.config.js");

const app = express();
const PORT = process.env.PORT || 9001;
const isProduction = process.env.NODE_ENV === "production"; 

// Middleware
app.use(cors());
app.use(express.json());

// Trust reverse proxy headers (Heroku, AWS, etc.)
app.enable("trust proxy");

// Force HTTPS (Only in production)
if (isProduction) {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));

    app.use((req, res, next) => {
        const host = req.headers["x-forwarded-host"] || req.hostname;

        if (host === "freshroulette-app-685e1b56445b.herokuapp.com") {
            console.log("Redirecting from Heroku domain to custom domain...");
            return res.redirect(301, `https://freshroulette.app${req.originalUrl}`);
        }

        next();
    });
}

// Serve static files from the React app (Only in production)
if (isProduction) {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

// API Routes
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
        const fullRecipe = {
            ...recipe,
            ingredients: ingredientsResult.rows,
            nutrition: nutritionResult.rows[0] || null,
            instructions: instructionsResult.rows
        };

        res.status(200).json(fullRecipe);
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

app.get("/ingredients", async (req, res) => {
     const { uuids } = req.query;
 
     if (!uuids) {
         return res.status(400).json({ error: "Recipe UUIDs are required" });
     }
 
     const uuidArray = uuids.split(",");
 
     try {
         const query = `
             SELECT ingredients.*, categories."category" 
             FROM ingredients 
             LEFT JOIN categories ON ingredients."Ingredient" = categories."ingredient"
             WHERE ingredients.uuid = ANY($1)
         `;
 
         const result = await pool.query(query, [uuidArray]);
 
         if (result.rows.length === 0) {
             return res.status(404).json({ error: "No ingredients found for these recipes" });
         }
 
         res.status(200).json(result.rows);
     } catch (error) {
         console.error("Database error:", error);
         res.status(500).json({ error: "Error fetching ingredients" });
     }
});

// React Routing (Only in production)
if (isProduction) {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});