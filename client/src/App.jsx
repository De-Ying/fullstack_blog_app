import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import Editor from "./pages/editor.pages";
import UserAuthForm from "./pages/userAuthForm.page";
import UserContextProvider from "./context/user.context";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";

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
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
