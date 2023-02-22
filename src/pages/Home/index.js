import MainMenu from "../../utils/components/MainMenu";
import CSS from "./index.module.css"

function Home() {
  const unparsedUser = localStorage.getItem ("user");
  const user = JSON.parse (unparsedUser)

  return <div className={CSS["main-container"]}>
    <MainMenu/>
  {/* <h2>Welcome {user?.username}</h2> */}
  </div>;
}

export default Home