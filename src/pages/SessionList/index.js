import { useContext, useEffect, useState } from "react";
import CSS from "./index.module.css"

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import { millisToMinutesAndSeconds } from "../../utils/services/functions";
import moment from 'moment'
import 'moment/locale/tr'  // without this line it didn't work
import { StateContext } from "../../utils/context/StateContext";
import { IoArrowBackCircleOutline } from "react-icons/io5";
moment.locale('tr')

const columns = [
  {
    id: 'name',
    label: 'İsim',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'gender',
    label: 'Cinsiyet',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'room',
    label: 'Oda',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'start_date',
    label: 'Başlangıç',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'duration',
    label: 'Süre',
    minWidth: 170,
    align: 'right',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'price',
    label: 'Ücret (₺)',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'is_paid',
    label: 'Ödendi mi?',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'is_completed',
    label: 'Tamamlandı mı?',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
];

function createData(start_date, duration, price, is_paid, is_completed, name, gender,room, id) {

  return { start_date, duration, price, is_paid, is_completed, name, gender,room, id};
}


function SessionList() {
  const {setHeaderContent} = useContext (StateContext)
  const [rows, setRows] = useState ([])
  const [clients, setClients] = useState ([])
  const [rooms, setRooms] = useState ([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterData, setFilterData] = useState ({
    client: undefined,
    room: undefined,
    is_paid: undefined,
    is_completed: undefined,
  })

  const boolSelect = [
    {value: true, label: 'Evet'},
    {value: false, label: 'Hayır'},
    {value: 0, label: 'Boş'},
  ]

  const getSessions = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    // TODO pagination yap
    let queryString = `sessions?populate=*&pagination[page]=${page+1}&pagination[pageSize]=${rowsPerPage}&sort[0]=start_time%3Adesc&filters[$and][0][client][therapist][id]=${user.id}`
    let and = 1
    if (filterData.client > 0) {
      queryString = `${queryString}&filters[$and][${and}][client][id]=${filterData.client}`
    }
    if (filterData.room > 0) {
      queryString = `${queryString}&filters[$and][${and}][room][id]=${filterData.room}`
    }
    if (filterData.is_paid !== undefined && parseInt (filterData.is_paid) !== -1) {
      queryString = `${queryString}&filters[$and][${and}][is_paid]${parseInt (filterData.is_paid) !== 0 ? `=${filterData.is_paid}`: `[$null]=true`}`
    }
    if (filterData.is_completed !== undefined && parseInt (filterData.is_completed) !== -1 ) {
      queryString = `${queryString}&filters[$and][${and}][is_completed]${parseInt (filterData.is_completed) !== 0 ? `=${filterData.is_completed}`: `[$null]=true`}`
    }


    const sessions = await axios.get (queryString)
    const clients = await axios.get (`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*`)
    const rooms = await axios.get ('rooms')

    setClients (clients.data)
    setRooms (rooms.data)

    setRows(sessions.data.map ((session) => {
      const sessionData = session.attributes
      const startTime = new Date (sessionData.start_time).getTime ()
      const endTime = new Date (sessionData.end_time).getTime ()
      const duration = millisToMinutesAndSeconds(endTime - startTime)

      return createData(
        moment(startTime).format('MMMM Do YYYY, HH:mm:ss'),
        duration,
        sessionData.price,
        sessionData.is_paid === true ? 'V' : sessionData.is_paid === false ? 'X' : null,
        sessionData.is_completed === true ? 'V' : sessionData.is_completed === false ? 'X' : null,
        sessionData.client.data.attributes.name,
        sessionData.client.data.attributes.gender,
        sessionData.room.data.attributes.name,
        session.id
        )
      }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect (() => {
    setHeaderContent (
      <>
        <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Seanslarım</h2>
      </>
    )
  },[setHeaderContent])

  useEffect (() => {
    getSessions ()
  }, [filterData, rowsPerPage, page])

  return <div className={CSS["main-container"]}>
    <div className={CSS["filter-row"]}>
      <div className={CSS["filter-element"]}>
        <span className={CSS["filter-header"]}>Danışan : </span>
        <select value={filterData.client} onChange={(e) => {setFilterData ((past) => {return {...past, client: e.target.value}})}} className={CSS["filter-select"]}>
          <option value={-1}>Seçiniz..</option>
          {clients.map (client => <option key={client.id} value={client.id}>{client.attributes.name}</option>)}
        </select>
      </div>
      <div className={CSS["filter-element"]}>
        <span className={CSS["filter-header"]}>Oda : </span>
        <select value={filterData.room} onChange={(e) => {setFilterData ((past) => {return {...past, room: e.target.value}})}} className={CSS["filter-select"]}>
          <option value={-1}>Seçiniz..</option>
          {rooms.map (room => <option key={room.id} value={room.id}>{room.attributes.name}</option>)}
        </select>
      </div>
      <div className={CSS["filter-element"]}>
        <span className={CSS["filter-header"]}>Ödendi mi? : </span>
        <select value={filterData.is_paid} onChange={(e) => {setFilterData ((past) => {return {...past, is_paid: e.target.value}})}} className={CSS["filter-select"]}>
          <option value={-1}>Seçiniz..</option>
          {boolSelect.map (bool => <option key={bool.value} value={bool.value}>{bool.label}</option>)}
        </select>
      </div>
      <div className={CSS["filter-element"]}>
        <span className={CSS["filter-header"]}>Tamamlandı mı? : </span>
        <select value={filterData.is_completed} onChange={(e) => {setFilterData ((past) => {return {...past, is_completed: e.target.value}})}} className={CSS["filter-select"]}>
          <option value={-1}>Seçiniz..</option>
          {boolSelect.map (bool => <option key={bool.value} value={bool.value}>{bool.label}</option>)}
        </select>
      </div>

    </div>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </div>;
}

export default SessionList