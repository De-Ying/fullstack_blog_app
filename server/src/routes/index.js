import authRouter from "./auth.route.js";

function routes(app) {
  app.use("/api/auth", authRouter);
}

export default routes;