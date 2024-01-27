import { createContext, useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  desc: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const contextValue = {
    blog,
    setBlog,
    editorState,
    setEditorState,
    textEditor,
    setTextEditor
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
