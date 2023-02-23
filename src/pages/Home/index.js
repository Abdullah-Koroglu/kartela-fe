import MainMenu from "../../utils/components/MainMenu";
import CSS from "./index.module.css"

function Home() {
  return <div className={CSS["main-container"]}>
    <MainMenu/>
  </div>;
}

export default Home