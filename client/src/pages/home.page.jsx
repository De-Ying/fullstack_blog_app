import { useEffect, useRef, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import axios from "axios";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");
  const activeTabRef = useRef(null);

  const categories = [
    "programming",
    "hollywood",
    "social media",
    "technology",
    "finance",
    "cooking",
    "travel",
  ];

  const fetchLatestBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/blog/latest-blog`
      );
      return data.blogs;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchBlogByCategory = async (category) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/blog/filter-blog`,
        { tag: category }
      );
      return data.blogs;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/blog/trending-blog`
      );
      return data.blogs;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState === "home") {
      fetchLatestData();
    } else {
      fetchBlogByCategory(pageState).then((data) => setBlogs(data));
    }
  }, [pageState]);

  useEffect(() => {
    if (!trendingBlogs) {
      fetchTrendingBlogs().then((data) => setTrendingBlogs(data));
    }
  }, [trendingBlogs]);

  const fetchLatestData = async () => {
    const latestBlogs = await fetchLatestBlogs();
    setBlogs(latestBlogs);
    if (!trendingBlogs) {
      const trending = await fetchTrendingBlogs();
      setTrendingBlogs(trending);
    }
  };

  const loadBlogByCategory = (category) => {
    setBlogs(null);
    setPageState((prevState) => (prevState === category ? "home" : category));
  };

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
            activeTabRef={activeTabRef}
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
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories form all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      className={
                        "tag " +
                        (pageState == category ? " bg-black text-white " : " ")
                      }
                      key={i}
                      onClick={() => loadBlogByCategory(category)}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending
                <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

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
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
