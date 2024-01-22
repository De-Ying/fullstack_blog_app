import mongoose from "mongoose";
import { location } from "../config/db.js";

async function connect(onConnected) {
  try {
    await mongoose.connect(location, {
      autoIndex: true,
    });
    console.log("Connect to DB successfully!");
    if (typeof onConnected === "function") onConnected();
  } catch (e) {
    console.log("Connect to DB failure!");
  }
}

export default connect;