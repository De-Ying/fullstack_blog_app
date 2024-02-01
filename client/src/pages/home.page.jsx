import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import axios from "axios";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

const HomePage = () => {
  const [blogs, setBlog] = useState(null);
  const [trendingBlogs, setTrendingBlog] = useState(null);

  const fetchLatestBlogs = async () => {
    try {
      const { data } = await axios(
        import.meta.env.VITE_SERVER_API + "/blog/latest-blog"
      );

      setBlog(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await axios(
        import.meta.env.VITE_SERVER_API + "/blog/trending-blog"
      );

      setTrendingBlog(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                      className={"mb-7"}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                    className={"mb-7"}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            )}

            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div className=""></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
