import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import CSS from './index.module.css'
import { StateContext } from "../../utils/context/StateContext";
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { FaCheck, FaTimes } from 'react-icons/fa';
import RichTextEditor from '../../utils/components/RichText/RichText';
import { convertToHTML } from 'draft-convert';
import { toast } from "react-toastify";

const SessionDetail = () => {
  const {setHeaderContent} = useContext (StateContext)
  const [session, setSession] = useState ();
  const [notes, setNotes] = useState ()
  const [isPaid, setIsPaid] = useState ()
  const [isCompleted, setIsCompleted] = useState ()
  const { id } = useParams ()

  const getSession = async () => {
    const session = await axios.get (`sessions/${id}?populate[0]=client&populate[1]=session_type`)
    setNotes (session.data.attributes.notes === null ? '': session.data.attributes.notes )
    setIsPaid (session.data.attributes.is_paid)
    setIsCompleted (session.data.attributes.is_completed)
    setSession (session.data.attributes)
  }

  const updateSession = async () => {
    try {
      const session = await axios.put (`sessions/${id}`, {data: {is_paid: isPaid, is_completed: isCompleted, notes: notes}})
      if (session?.error) {
        try {
          toast.error (session?.error?.message ?? 'error')
        } catch (error) {
          console.log (session.error)
        }finally {
          return
        }
      }
      toast.success ('Başarıyla güncellendi!')
    } catch (error) {
      console.log (error)
    }


  }

  const changeIs = (param) => {
    if (param === true) {
      return false
    }else if (param === false) {
      return null
    }else {
      return true
    }
  }

  useEffect (() => {
    getSession ()
    setHeaderContent (
      <>
        <a href="/my_sessions"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Seans Bilgileri</h2>
      </>
    )
  },[setHeaderContent])

  return <div className={CSS["main-container"]}>
    {session ? <div>
      <div className={CSS['attribute-row']}><b>Kategori:</b> <span className={CSS['answer']}>{session.session_type?.data?.attributes?.name}</span></div>
      <div className={CSS['attribute-row']}><b>Danışan:</b> <span className={CSS['answer']}>{session.client?.data?.attributes?.name}</span></div>
      <div className={CSS['attribute-row']}><b>Tarih:</b> <span className={CSS['answer']}>{moment (session.start_time).format ('Do MMMM YYYY - HH:mm:ss')}</span></div>
      <div className={CSS['attribute-row']}><b>Ücter:</b> <span className={CSS['answer']}>{session.price} ₺</span></div>
      <div className={CSS['attribute-row']}><b>Ödendi mi? :
      </b> <div onClick={() => {setIsPaid (changeIs (isPaid))}} className={CSS['is-attribute']}>{isPaid === true ? <FaCheck color="#50C878"/> : isPaid === false ? <FaTimes color="#f44336"/> : null}</div>
      </div>
      <div className={CSS['attribute-row']}><b>Tamamlandı mı? :</b>
        <div onClick={() => {setIsCompleted (changeIs (isCompleted))}} className={CSS['is-attribute']}>{isCompleted === true ? <FaCheck color="#50C878"/> : isCompleted === false ? <FaTimes color="#f44336"/> : null}</div>
      </div>
      <div className={CSS['note-row']}><b>Notlar :</b> {notes || notes === '' ?
        <div className={CSS['summer-note']}>
          <RichTextEditor value={notes}  onChange={(a) => {setNotes (convertToHTML (a.getCurrentContent ()))}}/>
        </div> : null
      }
      </div>
      <div className={CSS['attribute-row']}><button className={CSS["form-submit"]} onClick={() => {updateSession ();}}>KAYDET</button></div>
    </div>: null}
  </div>
}

export default SessionDetail