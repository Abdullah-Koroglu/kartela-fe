import { useContext, useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Calendar from "../../utils/components/Calendar";
import { StateContext } from "../../utils/context/StateContext";
import CSS from "./index.module.css"

const CalendarPage = () => {
  const {setHeaderContent} = useContext (StateContext)

  useEffect (() => {
    setHeaderContent (
      <>
        <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Takvim</h2>
      </>
    )
  }, [])

  return (
    <div className={CSS["main-container"]}>
      {Calendar ()}
    </div>
  )

}

export default CalendarPage