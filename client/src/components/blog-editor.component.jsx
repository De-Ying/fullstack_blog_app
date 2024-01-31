import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { EditorContext } from "../pages/editor.pages";
import { UserContext } from "../context/user.context";

const BlogEditor = () => {
  const {
    blog,
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const editorInstance = new EditorJS({
      holderId: "textEditor",
      data: blog.content,
      tools: tools,
      placeholder: "Let's write an awesome story",
    });

    setTextEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, [setTextEditor, blog.content]);

  const handleBannerUpload = async (e) => {
    let img = e.target.files[0];

    if (!img) return;

    const loadingToast = toast.loading("Uploading...");

    try {
      const url = await uploadImage(img);
      toast.dismiss(loadingToast);
      toast.success("Uploaded 👍");

      setBlog({ ...blog, banner: url });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = async () => {
    if (!blog.banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }

    if (!blog.title.length) {
      return toast.error("Write blog title to publish it");
    }

    try {
      const data = await textEditor.save();

      if (data.blocks.length) {
        setBlog({ ...blog, content: data });
        setEditorState("publish");
      } else {
        toast.error("Write something in your blog to publish it");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the blog content");
    }
  };

  const createBlogThroughServer = async (formData) => {
    try {
      const serverDomain = import.meta.env.VITE_SERVER_API;

      await axios.post(`${serverDomain}/blog/create-blog`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save the blog");
    } finally {
      setLoading(false);
    }
  };


  const handleSaveDraft = async () => {
    if (!blog.title.length) {
      return toast.error("Write blog title to publish it");
    }

    try {
      const content = await textEditor.save();
      setLoading(true);

      await createBlogThroughServer({ ...blog, content, draft: true });
      toast.success("Draft saved successfully 👍");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the draft");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} className="w-full" />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {blog.title || "[Blog Title]"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            {loading ? "Saving Draft..." : "Save Draft"}
          </button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper
        keyValue="blog-editor"
      >
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={blog.banner || defaultBanner}
                  className="z-20"
                  onError={(e) => {
                    e.target.src = defaultBanner;
                  }}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={blog.title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
