import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import UserContextProvider from "./context/user.context";

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />}></Route>
          <Route path="signup" element={<UserAuthForm type="sign-up" />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
