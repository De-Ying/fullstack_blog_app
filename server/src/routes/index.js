import authRouter from "./auth.route.js";
import uploadRouter from "./upload.route.js";
import blogRouter from "./blog.route.js";

function routes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/image", uploadRouter);
  app.use("/api/blog", blogRouter);
}

export default routes;