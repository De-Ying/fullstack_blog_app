import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import Editor from "./pages/editor.pages";
import UserAuthForm from "./pages/userAuthForm.page";
import UserContextProvider from "./context/user.context";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/editor" element={<Editor />}/>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="blog/:blog_id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
