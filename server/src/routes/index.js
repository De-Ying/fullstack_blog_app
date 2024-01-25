import authRouter from "./auth.route.js";
import uploadRouter from "./upload.route.js";

function routes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/upload", uploadRouter);
}

export default routes;