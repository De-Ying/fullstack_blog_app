import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";

const UserAuthForm = ({ type }) => {
  return (
    <AnimationWrapper 
        keyValue={type} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className=""
    >
        <section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join us today!"}
                </h1>

                {
                    type !== "sign-in" ? 
                    <InputBox 
                        id="fullname"
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon="fi-rr-user"
                        value=""
                    />
                    : ""
                }

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
                >
                    {
                        type.replace("-", " ") 
                    }
                </button>

                <div className="relative w-full flex items-center gap=2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black" />
                    <p className="mx-2">or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                    <img src={googleIcon} className="w-5"/>
                    continue with google
                </button>

                {
                    type == "sign-in" ?
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don&apos;t have an account ?
                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                Join us today
                            </Link>
                        </p>
                    : 
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member ?
                        <Link to="/signin" className="underline text-black text-xl ml-1">
                            Sign in here.
                        </Link>
                    </p>
                }
            </form>
        </section>
    </AnimationWrapper>
  );
};

UserAuthForm.propTypes = {
  type: PropTypes.string.isRequired,
};

export default UserAuthForm;
