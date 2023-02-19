import React , {useState, createContext} from "react";

export const StateContext = createContext ();

export const StateProvider = ({children}) => {
  const [authData, setAuthData] = useState ();
  const [sessionKey, setSessionKey] = useState ();

  return (
    <StateContext.Provider
      value={
        {
          authData, setAuthData,
          sessionKey, setSessionKey
        }
      }
    >
      {children}
    </StateContext.Provider>
  )
}