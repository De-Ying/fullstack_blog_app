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
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const activeTabRef = useRef(null);

  const { query } = useParams();

  const searchBlogs = async ({ page = 1, create_new_array = false }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/blog/search-blog`,
        { query, page }
      );

      const formattedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/blog/search-blog-count",
        data_to_send: { query },
        create_new_array,
      });

      setBlogs(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_API}/user/search-user`,
      { query }
    );

    const { users } = response.data;
    setUsers(users);
  };

  useEffect(() => {
    resetState();

    searchBlogs({ page: 1, create_new_array: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const BlogCardWrapper = () => {
    return (
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

        <LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />
      </>
    );
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users === null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                transition={{ duration: 1, delay: i * 0.08 }}
                key={i}
                className={"mb-7"}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
          activeTabRef={activeTabRef}
        >
          <BlogCardWrapper />
          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

        <div>
            <h1 className="font-medium text-xl mb-8">
                User related to search
                <i className="fi fi-rr-user mt-1 ml-1"></i>
            </h1>

            <UserCardWrapper />
        </div>

      </div>
    </section>
  );
};

export default SearchPage;
