import { useEffect, useState } from "react"
import axios from "axios"
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import CSS from "./index.module.css"
import groupBy from 'lodash/groupBy';
import moment from 'moment'
import 'moment/locale/tr'  // without this line it didn't work
moment.locale('tr')


const Calendar = () => {
  const [sessions, setSessions] = useState ([])
  const [date, setDate] = useState (new Date(moment().startOf('day')))

  const getSessions = async () => {
    const sessions = await axios.get (`sessions?populate=*&sort[0]=start_time&filters[$and][0][start_time][$gte]=${date.getTime ()- 86400000}&filters[$and][1][start_time][$lte]=${date.getTime ()}`)
    const ordered = groupBy (sessions.data , ({attributes}) => attributes.room.data.attributes.color)
    setSessions (ordered)
  }
  useEffect (() => {
  }, [])

  useEffect (() => {
    getSessions ()
    console.log (date)
  }, [date] )
  return (
    <div className={CSS["main-container"]}>
      <ReactCalendar className={CSS["calendar-main"]} onChange={setDate} value={date} />
      {
        Object.keys(sessions)?.map (key => {
          const room =  sessions[key]
          return <div key={key} style={{backgroundColor: key}} className={CSS["room-container"]}>
            {
              room.map (session => {
                return <div key={session.id} className={CSS["session-container"]}>
                  { `${session.attributes.client.data.attributes.name} ${moment(session.attributes.start_time).format('HH:mm')} - ${moment(session.attributes.end_time).format('HH:mm')} ---
                  ${moment(session.attributes.start_time).format('MMMM Do YYYY,  HH:mm')}` }
                  </div>
              })
            }
          </div>
          // room.map (session => {
          //   console.log ({key, session})
          // })

        })
      }
    </div>
  )

}

export default Calendar