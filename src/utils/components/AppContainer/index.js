import { useContext } from "react";
import { StateContext } from "../../context/StateContext";
import Header from "../Header";
import CSS from "./index.module.css"

function Container({children, headerChild}) {

  return <div className={CSS["main-container"]}>
    <Header/>
      <div className={CSS["app-container"]}>
        {children}
      </div>
  </div>;
}

export default Container