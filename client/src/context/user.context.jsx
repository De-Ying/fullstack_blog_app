import { createContext, useEffect, useState } from "react";
import { getSessionValue } from "../common/session";

export const UserContext = createContext();

const UserContextProvider = (props) => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {

      let userInSession = getSessionValue("user");

      userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })

    }, [])

    const contextValue = {
      userAuth,
      setUserAuth
    };

    return (
        <UserContext.Provider value={contextValue}>
          {props.children}
        </UserContext.Provider>
      );
}

export default UserContextProvider;