import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useCallback, useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;

  let {
    blog,
    blog: { title, banner, tags, desc },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  const handleCloseEvent = useCallback(() => {
    setEditorState("editor");
  }, [setEditorState]);

  const handleBlogTitleChange = useCallback(
    (e) => {
      let input = e.target;
      if (input.value !== blog.title) {
        setBlog({ ...blog, title: input.value });
      }
    },
    [blog, setBlog]
  );

  const handleBlogDescChange = useCallback(
    (e) => {
      let input = e.target;
      if (input.value !== blog.desc) {
        setBlog({ ...blog, desc: input.value });
      }
    },
    [blog, setBlog]
  );

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // Enter key
      e.preventDefault();
    }
  };

  const handleTopicKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      const tag = e.target.value.trim();

      if (tags.length >= tagLimit) {
        toast.error(`You can add a maximum of ${tagLimit} tags`);
        return;
      }

      if (!tags.includes(tag)) {
        setBlog((prevBlog) => ({ ...prevBlog, tags: [...tags, tag] }));
      } else {
        toast.error(`Tag "${tag}" already exists`);
      }

      e.target.value = "";
    }
  };

  const handleCheck = () => {
    console.log(blog);
  };

  return (
    <AnimationWrapper
      keyValue="publish-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=""
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
            <img src={banner} />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {desc}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />

          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>

          <textarea
            maxLength={characterLimit}
            defaultValue={desc}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogDescChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - desc.length} characters left
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

            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>

          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} Tags left
          </p>

          <button className="btn-dark px-8" onClick={handleCheck}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
