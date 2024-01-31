import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import axios from "axios";

const HomePage = () => {
  const [ blogs, setBlog ] = useState(null);

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

  useEffect(() => {
    fetchLatestBlogs();
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
                {
                    blogs === null ? <Loader /> :
                    blogs.map((blog, i) => {
                        return <h1 key={i}>{blog.title}</h1>
                    })
                }
            </>

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
