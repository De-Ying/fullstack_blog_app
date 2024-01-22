import dotenv from "dotenv";
dotenv.config();

const location = process.env.DB_LOCATION;

export { location };