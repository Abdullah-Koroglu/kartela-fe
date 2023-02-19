import CSS from "./index.module.css"


function Header({children}) {
  return <div className={CSS["container"]}>
    {children}
    <img className={CSS["logo"]} src={window.location.origin + "/logo.png"} alt="Kartela"/>
  </div>;
}

export default Header