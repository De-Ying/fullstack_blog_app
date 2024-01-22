import express from "express";
import dbConnect from "./src/lib/mongodb.js";
import routes from "./src/routes/index.js";

// Connect to MongoDB
dbConnect();

const app = express();
const PORT = 3000;

app.use(express.json());

// routes
routes(app);

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
