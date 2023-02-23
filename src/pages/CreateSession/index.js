import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import CSS from "./index.module.css"
import Modal from "../../utils/components/Modal";
import UserCreateForm from "../../utils/components/uncommon/UserCreateForm";
import {IoArrowBackCircleOutline} from "react-icons/io5"


import { AiOutlineUserAdd } from 'react-icons/ai'
import { DatePickerField } from "../../utils/components/FormikDatePicker";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../../utils/context/StateContext";
import { toast } from "react-toastify";
import Calendar from "../../utils/components/Calendar";


function CreateSession() {
  const {setHeaderContent} = useContext (StateContext)
  const navigate = useNavigate ()
  const [rooms, setRooms] = useState ([])
  const [sessionTypes, setSessionTypes] = useState ([])
  const [startDate, setStartDate] = useState ()
  const [clients, setClients] = useState ()
  const [modalOpen, setModalOpen] = useState ()
  const getFormData = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const rooms = await axios.get ('rooms')
    const sessionTypes = await axios.get ('session-types?filters[is_for_event]=false')
    const clients = await axios.get (`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*`)

    setSessionTypes (sessionTypes.data)
    setRooms (rooms.data)
    setClients (clients.data)
  }

  const submitSession = async ({client, room, startTime, duration, price, session_type}) => {
    try {
      const endTime = new Date(startTime.getTime () + (duration * 60000)).getTime ()

      const response = await axios.post('sessions/check_and_create', {data: {
        client,
        room,
        start_time: startTime.getTime (),
        end_time: endTime,
        price,
        session_type
      }})
      if (response?.error){
        toast.error (response.error?.message ?? 'error')
        return
      }
      if (response?.message){
        toast.error (response.message ?? 'error')
        return
      }
      if (response) {
        setHeaderContent (<>
          <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
          <h2 className={CSS["page-header"]}>Seans Listesi</h2>
        </>)
        navigate ('/my_sessions')}

    } catch (error) {
      console.log ({error})
    }
  }

  useEffect (() => {
    getFormData ()
    setHeaderContent (
      <>
        <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Seans Ekle</h2>
      </>
    )
  }, [setHeaderContent])

  const handleCloseModal = (e) => {
    setModalOpen (e); getFormData ()
  }

  return <div className={CSS["main-container"]}>
    <Modal setOpenFromParent={(e) => {handleCloseModal (e)}} open={modalOpen}>{<UserCreateForm done={() => handleCloseModal () }/>}</Modal>
    <div className={CSS["form-container"]}>
    <Formik
      initialValues={{
        // customerId: '',
        // password: '',
      }}
      // validationSchema={FormSchema}
      onSubmit={(values) => {
        submitSession (values)
      }}
    >
      {({ errors }) => (
        <Form>
          <div className={CSS["form-element"]}>
            <label>
              Danışan
            </label>
            <div className={CSS["row"]}>
              <Field className={CSS["form-field"]} as="select" name="client">
                <option value={-1}>Seçiniz</option>
                {clients?.map (client => <option value={client.id}>{client.attributes.name}</option>)}
              </Field>
              <AiOutlineUserAdd onClick={() => {setModalOpen (true)}} size={'1.5rem'} className={CSS["add-user-icon"]}/>
            </div>
          </div>
          <div className={CSS["form-element"]}>
            <label>
              Oda
            </label>
            <Field className={CSS["form-field"]} as="select" name="room">
                <option value={-1}>Seçiniz</option>
                {rooms?.map (room => <option value={room.id}>{room.attributes.name}</option>)}
            </Field>
          </div>
          <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
            <label>
              Başlangıç
            </label>
            <DatePickerField
                // autoComplete="off"
                name="startTime"
                className={CSS["form-field"]}
                selected={startDate}
                onChange={(date) => setStartDate (date)}
                showTimeInput
                dateFormat='dd/MM/yyyy HH:mm'
                // timeClassName={handleColor}
              />
            {/* {errors.password && <p>{errors.password}</p>} */}
          </div>
          <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
            <label>
              Süre (dakika)
            </label>
              <Field type="number" name="duration" className={CSS["form-field"]} />
            {/* <DatePickerField
                // autoComplete="off"

                selected={endDate}
                onChange={(date) => setEndDate (date)}
                showTimeInput
                dateFormat='dd/MM/yyyy HH:mm'
                // timeClassName={handleColor}
              /> */}
            {/* {errors.password && <p>{errors.password}</p>} */}
          </div>
          <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
            <label>
              Ücret (₺)
            </label>
              <Field  type="number" name="price" className={CSS["form-field"]} />
            {/* {errors.password && <p>{errors.password}</p>} */}
          </div>
          <div className={CSS["form-element"]}>
            <label>
            Kategori
            </label>
            <Field className={CSS["form-field"]} as="select" name="session_type">
                <option value={-1}>Seçiniz</option>
                {sessionTypes?.map (type => <option value={type.id}>{type.attributes.name}</option>)}
            </Field>
          </div>
          <button className={CSS["form-submit"]} type="submit">KAYDET</button>
        </Form>
      )}
    </Formik>

    </div>
    <div className={CSS["calendar-container"]}>{Calendar ()}</div>
  </div>;
}

export default CreateSession