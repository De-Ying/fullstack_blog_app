import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const UserAuthForm = ({ type }) => {

  const handleValidationError = (error) => {
    toast.error(error);
  };

  const userAuthThroughServer = (serverRoute, formData) => {
    let serverDomain = import.meta.env.VITE_SERVER_DOMAIN;
    axios
      .post(serverDomain + serverRoute, formData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ response }) => {
        handleValidationError(response.data.errors);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElement =
      type === "sign-in"
        ? document.getElementById("formSignIn")
        : document.getElementById("formSignUp");

    let apiSignInURL = "/api/auth/signin";
    let apiSignUpURL = "/api/auth/signup";
    let serverRoute = type == "sign-in" ? apiSignInURL : apiSignUpURL;

    // formData
    let form = new FormData(formElement);
    let formData = Object.fromEntries(form.entries());

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <AnimationWrapper
      keyValue={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=""
    >
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form
          id={type == "sign-in" ? "formSignIn" : "formSignUp"}
          className="w-[80%] max-w-[400px]"
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us today!"}
          </h1>

          {type !== "sign-in" ? (
            <InputBox
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
              value=""
            />
          ) : (
            ""
          )}

          <InputBox
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
            value=""
          />

          <InputBox
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
            value=""
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap=2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p className="mx-2">or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don&apos;t have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

UserAuthForm.propTypes = {
  type: PropTypes.string.isRequired,
};

export default UserAuthForm;
