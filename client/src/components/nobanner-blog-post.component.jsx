import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
  const {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-4">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

MinimalBlogPost.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    blog_id: PropTypes.string,
    author: PropTypes.shape({
      personal_info: PropTypes.shape({
        fullname: PropTypes.string,
        username: PropTypes.string,
        profile_img: PropTypes.string,
      }),
    }),
    publishedAt: PropTypes.string,
  }),
  index: PropTypes.number
};

export default MinimalBlogPost;
