import authRouter from "./auth.route.js";
import siteRouter from "./site.route.js";
import blogRouter from "./blog.route.js";
import userRouter from "./user.route.js";

function routes(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/site", siteRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/user", userRouter);
}

export default routes;