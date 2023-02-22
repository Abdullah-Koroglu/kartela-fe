import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import CSS from "./index.module.css"
import Modal from "../../utils/components/Modal";
import UserCreateForm from "../../utils/components/uncommon/UserCreateForm";
import {IoArrowBackCircleOutline} from "react-icons/io5"


import { AiOutlineUserAdd } from 'react-icons/ai'
import { DatePickerField } from "../../utils/components/FormikDatePicker";
import { Link, useNavigate } from "react-router-dom";
import { StateContext } from "../../utils/context/StateContext";

function CreateSession() {
  const {setHeaderContent} = useContext (StateContext)
  const navigate = useNavigate ()
  const [rooms, setRooms] = useState ()
  const [startDate, setStartDate] = useState ()
  const [endDate, setEndDate] = useState ()
  const [clients, setClients] = useState ()
  const [modalOpen, setModalOpen] = useState ()
  const getFormData = async () => {
    const rooms = await axios.get ('rooms')
    const clients = await axios.get ('clients')

    setRooms (rooms.data)
    setClients (clients.data)
  }

  const submitSession = async ({client,room,startTime,endTime}) => {
    try {
      // TODO check the room if available or not before submitting
      const user = JSON.parse(localStorage.getItem ('user'))
      const response = await axios.post('sessions', {data: {
        client,
        room,
        start_time: startTime,
        end_time: endTime,
        therapist_id: user.id
      }})

      if (response) navigate ('/my_sessions')

    } catch (error) {
      // toast.error (error?.message ?? 'error')
      console.log (error)
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
  }, [])

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
        // console.log (values)
        // const {customerId, password} = values
        // login (customerId, password)
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
              Bitiş
            </label>
            <DatePickerField
                // autoComplete="off"
                name="endTime"
                className={CSS["form-field"]}
                selected={endDate}
                onChange={(date) => setEndDate (date)}
                showTimeInput
                dateFormat='dd/MM/yyyy HH:mm'
                // timeClassName={handleColor}
              />
            {/* {errors.password && <p>{errors.password}</p>} */}
          </div>
          {/* <div className={CSS["form-element"]}>
            <label>
              Kategori
            </label>
            <Field className={CSS["form-field"]} as="select" name="room">
                {rooms?.map (room => <option value={room.id}>{room.attributes.name}</option>)}
            </Field>
          </div> */}
          <button className={CSS["form-submit"]} type="submit">KAYDET</button>
        </Form>
      )}
    </Formik>

    </div>
    <div className={CSS["calendar-container"]}>Takvim</div>
  </div>;
}

export default CreateSession