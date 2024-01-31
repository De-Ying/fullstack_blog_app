import { useState, useCallback, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Tag from "./tags.component";
import { EditorContext } from "../pages/editor.pages";
import { UserContext } from "../context/user.context";

const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;

  const { blog, setEditorState, setBlog } = useContext(EditorContext);
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCloseEvent = useCallback(() => {
    setEditorState("editor");
  }, [setEditorState]);

  const handleInputChange = useCallback(
    (e, field) => {
      const value = e.target.value;
      setBlog((prevBlog) => ({ ...prevBlog, [field]: value }));
    },
    [setBlog]
  );

  const handleTopicKeyDown = useCallback(
    (e) => {
      if (e.keyCode == 13 || e.keyCode == 188) {
        e.preventDefault();

        const tag = e.target.value.trim();

        if (blog.tags.length >= tagLimit) {
          toast.error(`You can add a maximum of ${tagLimit} tags`);
          return;
        }

        if (!blog.tags.includes(tag)) {
          setBlog((prevBlog) => ({
            ...prevBlog,
            tags: [...prevBlog.tags, tag],
          }));
        } else {
          toast.error(`Tag "${tag}" already exists`);
        }

        e.target.value = "";
      }
    },
    [blog.tags, setBlog]
  );

  const validateBlogData = () => {
    const { title, desc, banner, tags } = blog;

    if (!title.length) return "Write blog title before publishing";
    if (!desc.length || desc.length > characterLimit)
      return `Write a description about your blog withing ${characterLimit} characters`;
    if (!banner.length) return "You must provide a banner to publish the blog";
    if (!tags.length || tags.length > tagLimit)
      return `Enter at least one tag to help us rank your blog, maximum length is ${tagLimit} tag`;

    return null;
  };

  const createBlogThroughServer = async (formData) => {
    try {
      const serverDomain = import.meta.env.VITE_SERVER_API;

      await axios.post(`${serverDomain}/blog/create-blog`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      toast.success("Published 👍");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const publishBlog = () => {
    if (loading) return;

    const validationError = validateBlogData();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    const formData = {
      ...blog,
      draft: false,
    };

    createBlogThroughServer(formData);
  };

  return (
    <AnimationWrapper
      keyValue="publish-form"
    >
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={blog.banner} />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {blog.title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {blog.desc}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={blog.title}
            className="input-box pl-4"
            onChange={(e) => handleInputChange(e, "title")}
          />

          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>

          <textarea
            maxLength={characterLimit}
            defaultValue={blog.desc}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={(e) => handleInputChange(e, "desc")}
          ></textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - blog.desc.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics - (Helps is searching and ranking your blog post)
          </p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleTopicKeyDown}
            />

            {blog.tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>

          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - blog.tags.length} Tags left
          </p>

          <button className="btn-dark px-8" onClick={publishBlog}>
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
