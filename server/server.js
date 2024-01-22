import express from "express";
import cors from "cors";
import dbConnect from "./src/lib/mongodb.js";
import routes from "./src/routes/index.js";

// Connect to MongoDB
dbConnect();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// routes
routes(app);

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
