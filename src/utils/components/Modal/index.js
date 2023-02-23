import { useEffect, useState } from "react";
import CSS from "./index.module.css"

function Modal({children, open, setOpenFromParent}) {
  // const handleOpen = (open) => {
  //   setOpen (open)
  //   setOpenFromParent (open)
  // }
  const [isOpen, setOpen] = useState (open)
  useEffect (() => {
    setOpen (open)
  }, [open])
  return isOpen ? <div className={CSS["main-container"]}>
    <div onClick={() => setOpenFromParent ()} className={CSS["background"]}></div>
    <div className={CSS["modal-container"]}>{children}</div>
    </div> : null;
}
export default Modal;