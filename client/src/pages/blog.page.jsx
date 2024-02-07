import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";

const blogStructure = {
  title: "",
  desc: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = async ({ page = 1 }) => {
    try {
      const {
        data: { blog },
      } = await axios.post(`${import.meta.env.VITE_SERVER_API}/blog/get-blog`, {
        blog_id,
      });

      setBlog(blog);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/blog/search-blog`,
        {
          tag: blog.tags[0],
          limit: 6,
          page,
          eliminate_blog: blog_id,
        }
      );

      setSimilarBlogs(data.blogs);

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    resetState();
    fetchBlog({ page: 1 });
  }, [blog_id]);

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider value={{ blog, setBlog }}>
          <div className="max-w-[980px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />

            <div className="mt-12">
              <h2>{title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />

                  <p>
                    {fullname}
                    <br />@
                    <Link
                      to={`/user/${author_username}`}
                      className="hover:underline"
                    >
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />

            

            <BlogInteraction />

            {similarBlogs !== null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>

                {
                  similarBlogs.map((blog, i) => {
                    const { author: { personal_info } } = blog;

                    return (
                      <AnimationWrapper 
                        key={i} 
                        transition={{ duration: 1, delay: i*0.08}}
                      >
                        <BlogPostCard content={blog} author={personal_info}/>
                      </AnimationWrapper>
                    )
                  })
                }
              </>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
