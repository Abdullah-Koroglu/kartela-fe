import CSS from "./index.module.css"
import { useContext } from "react";
import { StateContext } from "../../context/StateContext";


function Header({children}) {
  const {headerContent} = useContext (StateContext)
  return <div className={CSS["container"]}>
    {headerContent}
    <img className={CSS["logo"]} src={window.location.origin + "/logo.png"} alt="Kartela"/>
  </div>;
}

export default Header