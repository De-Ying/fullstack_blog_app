import express from "express";
import cors from "cors";
import dbConnect from "./src/lib/mongodb.js";
import routes from "./src/routes/index.js";
import admin from "firebase-admin";
import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

// Connect to MongoDB
dbConnect();

const app = express();
const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

app.use(express.json());
app.use(cors());

// routes
routes(app);

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
