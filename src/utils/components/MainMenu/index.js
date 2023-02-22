import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CSS from "./index.module.css"

const menuArr = [
  {slug:'calendar', displayName: 'Takvim'},
  {slug:'create_event', displayName: 'Etkinlik Oluştur'},
  {slug:'create_session', displayName: 'Seans Oluştur'},
  {slug:'my_sessions', displayName: 'Seanslarım'},
  {slug:'my_clients', displayName: 'Danışanlarım'},
]
function Menu() {
  const navigate = useNavigate ()
  return <div className={CSS["main-container"]}>
    {menuArr.map ((item) =>  <div
    key={item.slug}
    onClick={() => {navigate (`/${item.slug}`)}}
    className={CSS['menu-item']}>
        {item.displayName}
    </div>)}
  </div>;
}

export default Menu