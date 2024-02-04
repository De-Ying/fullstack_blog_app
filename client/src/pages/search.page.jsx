import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";

const SearchPage = () => {
  const [blogs, setBlogs] = useState(null);
  const activeTabRef = useRef(null);

  const { query } = useParams();

  const searchBlogs = async ({ page = 1, create_new_array = false }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/site/search-blog`,
        { query, page }
      );

      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/site/search-blog-count",
        data_to_send: { query },
        create_new_array,
      });

      setBlogs(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // reset
    searchBlogs({ page: 1 });
  }, [query]);

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["trending blogs"]}
          activeTabRef={activeTabRef}
        >
          <>
            {blogs === null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
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
            ) : (
              <NoDataMessage message="No blogs published" />
            )}

            <LoadMoreDataBtn
              state={blogs}
              fetchDataFunc={searchBlogs}
            />
          </>
        </InPageNavigation>
      </div>
    </section>
  );
};

export default SearchPage;
