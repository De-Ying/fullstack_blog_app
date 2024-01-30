import { nanoid } from "nanoid";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

function validateBlogData(title, desc, banner, tags, content) {
  if (!title.length) return "You must provide a title to publish the blog";
  if (!desc.length || desc.length > 200)
    return "Blog description must be under 200 characters";
  if (!banner.length) return "You must provide a banner to publish the blog";
  if (!content.blocks.length)
    return "There must be some blog content to publish it";
  if (!tags.length || tags.length > 10)
    return "You must provide tags, Maximum 10";

  return null; // Không có lỗi
}

export default {
  async store(req, res) {
    try {
      const authorId = req.user;
      const { title, desc, banner, tags, content, draft } = req.body;

      // Validate input data
      const validationError = validateBlogData(
        title,
        desc,
        banner,
        tags,
        content
      );
      if (validationError) {
        return res.status(403).json({ error: validationError });
      }

      // Format tags
      const formattedTags = tags.map((tag) => tag.toLowerCase());

      // Create blog_id unique
      const blog_id =
        title
          .replace(/[^a-zA-Z0-9]/g, " ")
          .replace(/\s+/g, "-")
          .trim() + nanoid();

      // Create blog object
      const newBlog = new Blog({
        title,
        desc,
        banner,
        content,
        tags: formattedTags,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
      });

      // Save blog in database
      const savedBlog = await newBlog.save();

      // Update information user
      const incrementVal = draft ? 0 : 1;
      await User.findOneAndUpdate(
          { _id: authorId },
          { $inc: { "account_info.total_posts": incrementVal }, $push: { blogs: savedBlog._id } }
      );

      // Return id of new blog
      return res.status(200).json({ id: savedBlog.blog_id });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
