import { useState } from "react";
import Calendar from "../../utils/components/Calendar";
import CSS from "./index.module.css"

const CalendarPage = () => {

  return (
    <div className={CSS["main-container"]}>

      {Calendar ()}
    </div>
  )

}

export default CalendarPage