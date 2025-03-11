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

// React Routing (Only in production)
if (isProduction) {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
