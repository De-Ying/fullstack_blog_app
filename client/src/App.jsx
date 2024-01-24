import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import Editor from "./pages/editor.pages";
import UserAuthForm from "./pages/userAuthForm.page";
import UserContextProvider from "./context/user.context";

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/editor" element={<Editor />}/>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
