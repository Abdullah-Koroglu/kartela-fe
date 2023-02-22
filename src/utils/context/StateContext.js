import React , {useState, createContext} from "react";

export const StateContext = createContext ();

export const StateProvider = ({children}) => {
  const [headerContent, setHeaderContent] = useState ();

  return (
    <StateContext.Provider
      value={
        {
          headerContent, setHeaderContent,
        }
      }
    >
      {children}
    </StateContext.Provider>
  )
}